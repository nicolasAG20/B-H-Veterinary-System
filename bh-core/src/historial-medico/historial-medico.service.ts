import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { HistorialMedico } from './entities/historial-medico.entity';
import { CreateHistorialMedicoDto } from './dto/create-historial-medico.dto';
import { UpdateHistorialMedicoDto } from './dto/update-historial-medico.dto';

import { Cita, EstadoCita } from '../cita/entities/cita.entity';
import { Medicamento } from '../medicamento/entities/medicamento.entity';
import { Mascota } from '../mascota/entities/mascota.entity';
import { RolUsuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class HistorialMedicoService {
  constructor(
    @InjectRepository(HistorialMedico)
    private readonly historialRepository: Repository<HistorialMedico>,

    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,

    @InjectRepository(Medicamento)
    private readonly medicamentoRepository: Repository<Medicamento>,

    @InjectRepository(Mascota)
    private readonly mascotaRepository: Repository<Mascota>,

    private readonly dataSource: DataSource,
  ) {}

  async createMedicalRecord(
    appointmentId: number,
    veterinarioId: number,
    createDto: CreateHistorialMedicoDto,
  ) {
    const cita = await this.citaRepository.findOne({
      where: { idCita: appointmentId },
      relations: ['usuario', 'mascota'],
    });

    if (!cita) throw new NotFoundException('Cita no encontrada.');

    if (!cita.usuario || cita.usuario.id !== veterinarioId) {
      throw new ForbiddenException(
        'Solo el veterinario asignado a la cita puede registrar el historial médico.',
      );
    }

    if (cita.estado !== EstadoCita.FINALIZADA) {
      throw new ConflictException(
        'No se puede registrar el historial médico hasta que la cita haya finalizado.',
      );
    }

    const historialExistente = await this.historialRepository.findOne({
      where: { cita: { idCita: appointmentId } },
    });

    if (historialExistente) {
      throw new ConflictException('La cita ya tiene un historial médico registrado.');
    }

    const historial = this.historialRepository.create({
      motivo_visita: createDto.motivo_visita,
      diagnostico: createDto.diagnostico,
      tratamiento: createDto.tratamiento,
      peso_mascota: createDto.peso_mascota,
      proxima_visita: createDto.proxima_visita
        ? new Date(createDto.proxima_visita)
        : null,
      fecha_creacion: new Date(),
      cita,
      usuario: cita.usuario,
    });

    const historialGuardado = await this.historialRepository.save(historial);

    await this.mascotaRepository.update(cita.mascota.idMascota, {
      peso: createDto.peso_mascota,
    });

    const medicamentos = createDto.medicamentos ?? [];

    const medicamentosGuardados = await this.medicamentoRepository.save(
      medicamentos.map((medicamento) =>
        this.medicamentoRepository.create({
          nombre: medicamento.nombre_medicamento,
          dosis: medicamento.dosis,
          duracion: medicamento.duracion,
          producto: { idProducto: medicamento.productoId } as any,
          historialMedico: historialGuardado,
        }),
      ),
    );

    return {
      message: 'Historial médico registrado exitosamente.',
      historial: {
        ...historialGuardado,
        medicamentos: medicamentosGuardados,
      },
    };
  }

  async getPetMedicalHistory(petId: number, user: any) {
    const mascota = await this.dataSource.query(
      `
      SELECT 
        m.idMascota,
        c.Usuario_id AS usuarioClienteId
      FROM Mascota m
      INNER JOIN Cliente c ON c.idCliente = m.Cliente_id
      WHERE m.idMascota = ?
      `,
      [petId],
    );

    if (!mascota.length) {
      throw new NotFoundException('Mascota no encontrada.');
    }

    if (
      user.rol === RolUsuario.CLIENTE &&
      Number(mascota[0].usuarioClienteId) !== Number(user.sub)
    ) {
      throw new ForbiddenException(
        'No tiene permisos para acceder a este historial médico.',
      );
    }

    return this.dataSource.query(
      `
      SELECT 
        h.idHistorial_medico,
        h.motivo_visita,
        h.diagnostico,
        h.tratamiento,
        h.peso_mascota,
        h.proxima_visita,
        h.fecha_creacion,
        h.Cita_id,
        h.Usuario_id,
        c.Mascota_id
      FROM Historial_medico h
      INNER JOIN Cita c ON c.idCita = h.Cita_id
      WHERE c.Mascota_id = ?
      ORDER BY h.fecha_creacion DESC
      `,
      [petId],
    );
  }

  async getMedicalRecordById(recordId: number, user: any) {
    const historial = await this.dataSource.query(
      `
      SELECT 
        h.idHistorial_medico,
        h.motivo_visita,
        h.diagnostico,
        h.tratamiento,
        h.peso_mascota,
        h.proxima_visita,
        h.fecha_creacion,
        h.Cita_id,
        h.Usuario_id,
        c.Mascota_id,
        cl.Usuario_id AS usuarioClienteId
      FROM Historial_medico h
      INNER JOIN Cita c ON c.idCita = h.Cita_id
      INNER JOIN Mascota m ON m.idMascota = c.Mascota_id
      INNER JOIN Cliente cl ON cl.idCliente = m.Cliente_id
      WHERE h.idHistorial_medico = ?
      `,
      [recordId],
    );

    if (!historial.length) {
      throw new NotFoundException('Registro médico no encontrado.');
    }

    const registro = historial[0];

    if (
      user.rol === RolUsuario.CLIENTE &&
      Number(registro.usuarioClienteId) !== Number(user.sub)
    ) {
      throw new ForbiddenException(
        'No tiene permisos para acceder a este historial médico.',
      );
    }

    return registro;
  }

  async updateMedicalRecord(
    recordId: number,
    veterinarioId: number,
    updateDto: UpdateHistorialMedicoDto,
  ) {
    const historial = await this.historialRepository.findOne({
      where: { idHistorial_medico: recordId },
      relations: ['usuario', 'cita', 'cita.mascota'],
    });

    if (!historial) {
      throw new NotFoundException('Registro médico no encontrado.');
    }

    if (!historial.usuario || historial.usuario.id !== veterinarioId) {
      throw new ForbiddenException(
        'Solo el veterinario que creó el historial médico puede corregirlo.',
      );
    }

    this.validarTiempoCorreccion(historial.fecha_creacion);

    if (updateDto.motivo_visita !== undefined) {
      historial.motivo_visita = updateDto.motivo_visita;
    }

    if (updateDto.diagnostico !== undefined) {
      historial.diagnostico = updateDto.diagnostico;
    }

    if (updateDto.tratamiento !== undefined) {
      historial.tratamiento = updateDto.tratamiento;
    }

    if (updateDto.peso_mascota !== undefined) {
      historial.peso_mascota = updateDto.peso_mascota;

      if (historial.cita?.mascota) {
        await this.mascotaRepository.update(historial.cita.mascota.idMascota, {
          peso: updateDto.peso_mascota,
        });
      }
    }

    if (updateDto.proxima_visita !== undefined) {
      historial.proxima_visita = updateDto.proxima_visita
        ? new Date(updateDto.proxima_visita)
        : null;
    }

    const historialActualizado = await this.historialRepository.save(historial);

    return {
      message: 'Registro actualizado exitosamente.',
      historial: historialActualizado,
    };
  }

  private validarTiempoCorreccion(fechaCreacion: Date): void {
    if (!fechaCreacion) {
      throw new BadRequestException('El registro no tiene fecha de creación válida.');
    }

    const horas =
      (new Date().getTime() - new Date(fechaCreacion).getTime()) /
      (1000 * 60 * 60);

    if (horas > 24) {
      throw new ForbiddenException(
        'El tiempo de edición terminó. Solo se puede corregir el historial médico durante las primeras 24 horas.',
      );
    }
  }
}
