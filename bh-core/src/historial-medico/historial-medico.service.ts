import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialMedico } from './entities/historial-medico.entity';
import { CreateHistorialMedicoDto } from './dto/create-historial-medico.dto';
import { UpdateHistorialMedicoDto } from './dto/update-historial-medico.dto';

@Injectable()
export class HistorialMedicoService {
  constructor(
    @InjectRepository(HistorialMedico)
    private readonly historialRepository: Repository<HistorialMedico>,
  ) {}

  async create(createDto: CreateHistorialMedicoDto) {
    const { citaId, usuarioId, ...rest } = createDto;
    const historial = this.historialRepository.create({
      ...rest,
      cita: { idCita: citaId } as any,
      usuario: { id: usuarioId } as any,
    });
    await this.historialRepository.save(historial);
    return { message: 'Historial médico creado correctamente', historial };
  }

  async findAll() {
    return this.historialRepository.find({ relations: ['cita', 'usuario', 'medicamentos', 'vacunaciones'] });
  }

  async findOne(id: number) {
    const historial = await this.historialRepository.findOne({
      where: { idHistorial_medico: id },
      relations: ['cita', 'usuario', 'medicamentos', 'vacunaciones'],
    });
    if (!historial) {
      throw new NotFoundException(`Historial médico #${id} no encontrado`);
    }
    return historial;
  }

  async update(id: number, updateDto: UpdateHistorialMedicoDto) {
    await this.findOne(id);
    const { citaId, usuarioId, ...rest } = updateDto;
    const updateData: any = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== undefined),
    );
    if (citaId !== undefined) updateData.cita = { idCita: citaId };
    if (usuarioId !== undefined) updateData.usuario = { id: usuarioId };
    await this.historialRepository.update(id, updateData);
    return { message: 'Historial médico actualizado', historial: await this.findOne(id) };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.historialRepository.delete(id);
    return { message: 'Historial médico eliminado correctamente' };
  }
}