import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
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
    const servicio = this.servicioRepository.create({
      ...createServicioDto,
      activo: true,
    });
    return this.servicioRepository.save(servicio);
  }

  async findAll(activo?: boolean) {
    const where: FindOptionsWhere<Servicio> | undefined =
      activo === undefined ? undefined : { activo };

    return this.servicioRepository.find({ where });
  }

  async findOne(id: number) {
    const servicio = await this.servicioRepository.findOneBy({ idServicio: id });
    if (!servicio) {
      throw new NotFoundException(`Servicio #${id} no encontrado`);
    }
    return servicio;
  }

  async update(id: number, updateServicioDto: UpdateServicioDto) {
    const servicio = await this.findOne(id);
    Object.assign(servicio, updateServicioDto);
    return this.servicioRepository.save(servicio);
  }

  async deactivate(id: number) {
    const servicio = await this.findOne(id);

    if (!servicio.activo) {
      throw new ConflictException('El servicio ya se encuentra desactivado');
    }

    servicio.activo = false;
    await this.servicioRepository.save(servicio);

    return { mensaje: 'Servicio desactivado exitosamente' };
  }
}
