import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servicio } from './entities/servicio.entity';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';

@Injectable()
export class ServicioService {
  constructor(
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
  ) {}

  async create(createServicioDto: CreateServicioDto) {
    const servicio = this.servicioRepository.create(createServicioDto);
    await this.servicioRepository.save(servicio);
    return { message: 'Servicio creado correctamente', servicio };
  }

  async findAll() {
    return this.servicioRepository.find();
  }

  async findOne(id: number) {
    const servicio = await this.servicioRepository.findOneBy({ idServicio: id });
    if (!servicio) {
      throw new NotFoundException(`Servicio #${id} no encontrado`);
    }
    return servicio;
  }

  async update(id: number, updateServicioDto: UpdateServicioDto) {
    await this.findOne(id);
    const updateData = Object.fromEntries(
      Object.entries(updateServicioDto).filter(([, v]) => v !== undefined),
    );
    await this.servicioRepository.update(id, updateData);
    return { message: 'Servicio actualizado', servicio: await this.findOne(id) };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.servicioRepository.delete(id);
    return { message: 'Servicio eliminado correctamente' };
  }
}
