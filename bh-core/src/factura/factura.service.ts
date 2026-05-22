import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factura } from './entities/factura.entity';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';

@Injectable()
export class FacturaService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,
  ) {}

  async create(createFacturaDto: CreateFacturaDto) {
    const { citaId, ...rest } = createFacturaDto;
    const factura = this.facturaRepository.create({
      ...rest,
      cita: { idCita: citaId } as any,
    });
    await this.facturaRepository.save(factura);
    return { message: 'Factura creada correctamente', factura };
  }

  async findAll() {
    return this.facturaRepository.find({ relations: ['cita'] });
  }

  async findOne(id: number) {
    const factura = await this.facturaRepository.findOne({
      where: { idFactura: id },
      relations: ['cita'],
    });
    if (!factura) {
      throw new NotFoundException(`Factura #${id} no encontrada`);
    }
    return factura;
  }

  async update(id: number, updateFacturaDto: UpdateFacturaDto) {
    await this.findOne(id);
    const { citaId, ...rest } = updateFacturaDto;
    const updateData: any = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== undefined),
    );
    if (citaId !== undefined) updateData.cita = { idCita: citaId };
    await this.facturaRepository.update(id, updateData);
    return { message: 'Factura actualizada', factura: await this.findOne(id) };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.facturaRepository.delete(id);
    return { message: 'Factura eliminada correctamente' };
  }
}
