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
    const { mascotaId, usuarioId, servicioIds, ...rest } = createCitaDto;
    const servicios = servicioIds?.length
      ? await this.servicioRepository.findBy({ idServicio: In(servicioIds) })
      : [];
    const cita = this.citaRepository.create({
      ...rest,
      mascota: { idMascota: mascotaId } as any,
      usuario: { id: usuarioId } as any,
      servicios,
    });
    await this.citaRepository.save(cita);
    return { message: 'Cita creada correctamente', cita };
  }

  async findAll() {
    return this.citaRepository.find({ relations: ['mascota', 'usuario', 'servicios'] });
  }

  async findOne(id: number) {
    const cita = await this.citaRepository.findOne({
      where: { idCita: id },
      relations: ['mascota', 'usuario', 'servicios'],
    });
    if (!cita) {
      throw new NotFoundException(`Cita #${id} no encontrada`);
    }
    return cita;
  }

  async update(id: number, updateCitaDto: UpdateCitaDto) {
    const cita = await this.findOne(id);
    const { mascotaId, usuarioId, servicioIds, ...rest } = updateCitaDto;
    const updateData: any = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== undefined),
    );
    if (mascotaId !== undefined) updateData.mascota = { idMascota: mascotaId };
    if (usuarioId !== undefined) updateData.usuario = { id: usuarioId };
    if (servicioIds !== undefined) {
      cita.servicios = await this.servicioRepository.findBy({ idServicio: In(servicioIds) });
    }
    Object.assign(cita, updateData);
    await this.citaRepository.save(cita);
    return { message: 'Cita actualizada', cita };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.citaRepository.delete(id);
    return { message: 'Cita eliminada correctamente' };
  }
}
