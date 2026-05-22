import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicamento } from './entities/medicamento.entity';
import { CreateMedicamentoDto } from './dto/create-medicamento.dto';
import { UpdateMedicamentoDto } from './dto/update-medicamento.dto';

@Injectable()
export class MedicamentoService {
  constructor(
    @InjectRepository(Medicamento)
    private readonly medicamentoRepository: Repository<Medicamento>,
  ) {}

  async create(createDto: CreateMedicamentoDto) {
    const { historialMedicoId, productoId, ...rest } = createDto;
    const medicamento = this.medicamentoRepository.create({
      ...rest,
      historialMedico: { idHistorial_medico: historialMedicoId } as any,
      producto: { idProducto: productoId } as any,
    });
    await this.medicamentoRepository.save(medicamento);
    return { message: 'Medicamento creado correctamente', medicamento };
  }

  async findAll() {
    return this.medicamentoRepository.find({ relations: ['historialMedico', 'producto'] });
  }

  async findOne(id: number) {
    const medicamento = await this.medicamentoRepository.findOne({
      where: { idMedicamento: id },
      relations: ['historialMedico', 'producto'],
    });
    if (!medicamento) {
      throw new NotFoundException(`Medicamento #${id} no encontrado`);
    }
    return medicamento;
  }

  async update(id: number, updateDto: UpdateMedicamentoDto) {
    await this.findOne(id);
    const { historialMedicoId, productoId, ...rest } = updateDto;
    const updateData: any = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== undefined),
    );
    if (historialMedicoId !== undefined) updateData.historialMedico = { idHistorial_medico: historialMedicoId };
    if (productoId !== undefined) updateData.producto = { idProducto: productoId };
    await this.medicamentoRepository.update(id, updateData);
    return { message: 'Medicamento actualizado', medicamento: await this.findOne(id) };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.medicamentoRepository.delete(id);
    return { message: 'Medicamento eliminado correctamente' };
  }
}
