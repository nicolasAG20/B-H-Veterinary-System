import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacunacion } from './entities/vacunacion.entity';
import { CreateVacunacionDto } from './dto/create-vacunacion.dto';
import { UpdateVacunacionDto } from './dto/update-vacunacion.dto';

@Injectable()
export class VacunacionService {
  constructor(
    @InjectRepository(Vacunacion)
    private readonly vacunacionRepository: Repository<Vacunacion>,
  ) {}

  async create(createDto: CreateVacunacionDto) {
    const { historialMedicoId, productoId, ...rest } = createDto;
    const vacunacion = this.vacunacionRepository.create({
      ...rest,
      historialMedico: { idHistorial_medico: historialMedicoId } as any,
      producto: { idProducto: productoId } as any,
    });
    await this.vacunacionRepository.save(vacunacion);
    return { message: 'Vacunacion creada correctamente', vacunacion };
  }

  async findAll() {
    return this.vacunacionRepository.find({ relations: ['historialMedico', 'producto'] });
  }

  async findOne(id: number) {
    const vacunacion = await this.vacunacionRepository.findOne({
      where: { idVacunacion: id },
      relations: ['historialMedico', 'producto'],
    });
    if (!vacunacion) {
      throw new NotFoundException(`Vacunacion #${id} no encontrada`);
    }
    return vacunacion;
  }

  async update(id: number, updateDto: UpdateVacunacionDto) {
    await this.findOne(id);
    const { historialMedicoId, productoId, ...rest } = updateDto;
    const updateData: any = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== undefined),
    );
    if (historialMedicoId !== undefined) updateData.historialMedico = { idHistorial_medico: historialMedicoId };
    if (productoId !== undefined) updateData.producto = { idProducto: productoId };
    await this.vacunacionRepository.update(id, updateData);
    return { message: 'Vacunacion actualizada', vacunacion: await this.findOne(id) };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.vacunacionRepository.delete(id);
    return { message: 'Vacunacion eliminada correctamente' };
  }
}
