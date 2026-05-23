import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Cita } from './entities/cita.entity';
import { Servicio } from '../servicio/entities/servicio.entity';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';

@Injectable()
export class CitaService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,

    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
  ) {}

  async create(createCitaDto: CreateCitaDto) {
    const {
      mascotaId,
      usuarioId,
      veterinarioId,
      servicioIds,
      fecha_hora,
      ...rest
    } = createCitaDto;

    /**
     * Validar conflicto de horario del veterinario.
     * En la base de datos el veterinario se guarda en la columna Usuario_id.
     */
    const citaExistente = await this.citaRepository.findOne({
      where: {
        fecha_hora: new Date(fecha_hora),
        usuario: {
          id: veterinarioId,
        },
      },
      relations: ['usuario'],
    });

    if (citaExistente) {
      throw new NotFoundException(
        'El veterinario ya tiene una cita agendada en este horario',
      );
    }

    const servicios = servicioIds?.length
      ? await this.servicioRepository.findBy({
          idServicio: In(servicioIds),
        })
      : [];

    /**
     * Crear la cita.
     * Se usa usuario con veterinarioId porque la entidad Cita no tiene
     * la propiedad veterinario, solo tiene la relación usuario.
     */
    const cita = this.citaRepository.create({
      ...rest,
      fecha_hora,
      mascota: {
        idMascota: mascotaId,
      } as any,
      usuario: {
        id: veterinarioId || usuarioId,
      } as any,
      servicios,
    });

    await this.citaRepository.save(cita);

    return {
      message: 'Cita creada correctamente',
      cita,
    };
  }

  async findAll() {
    return this.citaRepository.find({
      relations: ['mascota', 'usuario', 'servicios'],
    });
  }

  async findOne(id: number) {
    const cita = await this.citaRepository.findOne({
      where: {
        idCita: id,
      },
      relations: ['mascota', 'usuario', 'servicios'],
    });

    if (!cita) {
      throw new NotFoundException(`Cita #${id} no encontrada`);
    }

    return cita;
  }

  async update(id: number, updateCitaDto: UpdateCitaDto) {
    const cita = await this.findOne(id);

    const {
      mascotaId,
      usuarioId,
      veterinarioId,
      servicioIds,
      ...rest
    } = updateCitaDto as any;

    const updateData: any = Object.fromEntries(
      Object.entries(rest).filter(([, value]) => value !== undefined),
    );

    if (mascotaId !== undefined) {
      updateData.mascota = {
        idMascota: mascotaId,
      };
    }

    if (veterinarioId !== undefined) {
      updateData.usuario = {
        id: veterinarioId,
      };
    } else if (usuarioId !== undefined) {
      updateData.usuario = {
        id: usuarioId,
      };
    }

    if (servicioIds !== undefined) {
      cita.servicios = await this.servicioRepository.findBy({
        idServicio: In(servicioIds),
      });
    }

    Object.assign(cita, updateData);

    await this.citaRepository.save(cita);

    return {
      message: 'Cita actualizada',
      cita,
    };
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.citaRepository.delete(id);

    return {
      message: 'Cita eliminada correctamente',
    };
  }
}