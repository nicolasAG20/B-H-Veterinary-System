import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hospitalizacion } from './entities/hospitalizacion.entity';
import { CreateHospitalizacionDto } from './dto/create-hospitalizacion.dto';
import { UpdateHospitalizacionDto } from './dto/update-hospitalizacion.dto';

@Injectable()
export class HospitalizacionService {
  constructor(
    @InjectRepository(Hospitalizacion)
    private readonly hospitalizacionRepository: Repository<Hospitalizacion>,
  ) {}

  async create(createDto: CreateHospitalizacionDto) {
    const { usuarioId, mascotaId, ...rest } = createDto;
    const hospitalizacion = this.hospitalizacionRepository.create({
      ...rest,
      usuario: { id: usuarioId } as any,
      mascota: { idMascota: mascotaId } as any,
    });
    await this.hospitalizacionRepository.save(hospitalizacion);
    return { message: 'Hospitalizacion creada correctamente', hospitalizacion };
  }

  async findAll() {
    return this.hospitalizacionRepository.find({ relations: ['usuario', 'mascota', 'notasEvolucion'] });
  }

  async findOne(id: number) {
    const hospitalizacion = await this.hospitalizacionRepository.findOne({
      where: { idHospitalizacion: id },
      relations: ['usuario', 'mascota', 'notasEvolucion'],
    });
    if (!hospitalizacion) {
      throw new NotFoundException(`Hospitalizacion #${id} no encontrada`);
    }
    return hospitalizacion;
  }

  async update(id: number, updateDto: UpdateHospitalizacionDto) {
    await this.findOne(id);
    const { usuarioId, mascotaId, ...rest } = updateDto;
    const updateData: any = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== undefined),
    );
    if (usuarioId !== undefined) updateData.usuario = { id: usuarioId };
    if (mascotaId !== undefined) updateData.mascota = { idMascota: mascotaId };
    await this.hospitalizacionRepository.update(id, updateData);
    return { message: 'Hospitalizacion actualizada', hospitalizacion: await this.findOne(id) };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.hospitalizacionRepository.delete(id);
    return { message: 'Hospitalizacion eliminada correctamente' };
  }
}
