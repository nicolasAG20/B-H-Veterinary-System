import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotaEvolucion } from './entities/nota-evolucion.entity';
import { CreateNotaEvolucionDto } from './dto/create-nota-evolucion.dto';
import { UpdateNotaEvolucionDto } from './dto/update-nota-evolucion.dto';

@Injectable()
export class NotaEvolucionService {
  constructor(
    @InjectRepository(NotaEvolucion)
    private readonly notaEvolucionRepository: Repository<NotaEvolucion>,
  ) {}

  async create(createDto: CreateNotaEvolucionDto) {
    const { hospitalizacionId, ...rest } = createDto;
    const nota = this.notaEvolucionRepository.create({
      ...rest,
      hospitalizacion: { idHospitalizacion: hospitalizacionId } as any,
    });
    await this.notaEvolucionRepository.save(nota);
    return { message: 'Nota de evolución creada correctamente', nota };
  }

  async findAll() {
    return this.notaEvolucionRepository.find({ relations: ['hospitalizacion'] });
  }

  async findOne(id: number) {
    const nota = await this.notaEvolucionRepository.findOne({
      where: { idNota_evolucion: id },
      relations: ['hospitalizacion'],
    });
    if (!nota) {
      throw new NotFoundException(`Nota de evolución #${id} no encontrada`);
    }
    return nota;
  }

  async update(id: number, updateDto: UpdateNotaEvolucionDto) {
    await this.findOne(id);
    const { hospitalizacionId, ...rest } = updateDto;
    const updateData: any = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== undefined),
    );
    if (hospitalizacionId !== undefined) updateData.hospitalizacion = { idHospitalizacion: hospitalizacionId };
    await this.notaEvolucionRepository.update(id, updateData);
    return { message: 'Nota de evolución actualizada', nota: await this.findOne(id) };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.notaEvolucionRepository.delete(id);
    return { message: 'Nota de evolución eliminada correctamente' };
  }
}
