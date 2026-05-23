import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { HistorialMedico } from './entities/historial-medico.entity';

import { CreateHistorialMedicoDto } from './dto/create-historial-medico.dto';
import { UpdateHistorialMedicoDto } from './dto/update-historial-medico.dto';

import { Cita, EstadoCita } from '../cita/entities/cita.entity';

import { Medicamento } from '../medicamento/entities/medicamento.entity';

@Injectable()
export class HistorialMedicoService {
  constructor(
    @InjectRepository(HistorialMedico)
    private readonly historialRepository: Repository<HistorialMedico>,

    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,

    @InjectRepository(Medicamento)
    private readonly medicamentoRepository: Repository<Medicamento>,
  ) {}

  /**
   * Registrar historial médico al finalizar una cita.
   */
  async create(createDto: CreateHistorialMedicoDto) {
    const {
      citaId,
      usuarioId,
      medicamentos_prescritos,
      ...historialData
    } = createDto;

    /**
     * Buscar cita
     */
    const cita = await this.citaRepository.findOne({
      where: {
        idCita: citaId,
      },
    });

    /**
     * Validar existencia
     */
    if (!cita) {
      throw new NotFoundException(
        `La cita #${citaId} no existe`,
      );
    }

    /**
     * Validar estado finalizado
     */
    if (cita.estado !== EstadoCita.FINALIZADA) {
      throw new BadRequestException(
        'No se puede registrar el historial médico porque la cita aún no ha finalizado',
      );
    }

    /**
     * Validar historial existente
     */
    const historialExistente =
      await this.historialRepository.findOne({
        where: {
          cita: {
            idCita: citaId,
          },
        },
      });

    if (historialExistente) {
      throw new ConflictException(
        'La cita ya tiene un historial médico registrado',
      );
    }

    /**
     * Crear historial
     */
    const historial =
      this.historialRepository.create({
        ...historialData,

        fecha_creacion: new Date(),

        cita: {
          idCita: citaId,
        } as Cita,

        usuario: {
          id: usuarioId,
        } as any,
      });

    /**
     * Guardar historial
     */
    const historialGuardado =
      await this.historialRepository.save(
        historial,
      );

    /**
     * Registrar medicamentos
     */
    const medicamentos =
      medicamentos_prescritos.map(
        (medicamento) =>
          this.medicamentoRepository.create({
            nombre_medicamento:
              medicamento.nombre_medicamento,

            dosis: medicamento.dosis,

            duracion: medicamento.duracion,

            historialMedico: historialGuardado,
          }),
      );

    const medicamentosGuardados =
      await this.medicamentoRepository.save(
        medicamentos,
      );

    return {
      message:
        'Historial médico registrado correctamente',

      historial: {
        ...historialGuardado,
        medicamentos: medicamentosGuardados,
      },
    };
  }

  async findAll() {
    return await this.historialRepository.find({
      relations: [
        'cita',
        'usuario',
        'medicamentos',
      ],
    });
  }

  async findOne(id: number) {
    const historial =
      await this.historialRepository.findOne({
        where: {
          idHistorial_medico: id,
        },

        relations: [
          'cita',
          'usuario',
          'medicamentos',
        ],
      });

    if (!historial) {
      throw new NotFoundException(
        `Historial médico #${id} no encontrado`,
      );
    }

    return historial;
  }

  async update(
    id: number,
    updateDto: UpdateHistorialMedicoDto,
  ) {
    await this.findOne(id);

    await this.historialRepository.update(
      id,
      updateDto,
    );

    return {
      message:
        'Historial médico actualizado correctamente',
    };
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.historialRepository.delete(id);

    return {
      message:
        'Historial médico eliminado correctamente',
    };
  }
}