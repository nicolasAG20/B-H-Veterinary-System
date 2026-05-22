import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mascota } from './entities/mascota.entity';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';

@Injectable()
export class MascotaService {
  constructor(
    @InjectRepository(Mascota)
    private readonly mascotaRepository: Repository<Mascota>,
  ) {}

  async create(createMascotaDto: CreateMascotaDto) {
    const { clienteId, ...rest } = createMascotaDto;
    const mascota = this.mascotaRepository.create({
      ...rest,
      cliente: { idCliente: clienteId } as any,
    });
    await this.mascotaRepository.save(mascota);
    return { message: 'Mascota creada correctamente', mascota };
  }

  async findAll() {
    return this.mascotaRepository.find({ relations: ['cliente'] });
  }

  async findOne(id: number) {
    const mascota = await this.mascotaRepository.findOne({
      where: { idMascota: id },
      relations: ['cliente'],
    });
    if (!mascota) {
      throw new NotFoundException(`Mascota #${id} no encontrada`);
    }
    return mascota;
  }

  async update(id: number, updateMascotaDto: UpdateMascotaDto) {
    await this.findOne(id);
    const { clienteId, ...rest } = updateMascotaDto;
    const updateData: any = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== undefined),
    );
    if (clienteId !== undefined) {
      updateData.cliente = { idCliente: clienteId };
    }
    await this.mascotaRepository.update(id, updateData);
    return { message: 'Mascota actualizada', mascota: await this.findOne(id) };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.mascotaRepository.delete(id);
    return { message: 'Mascota eliminada correctamente' };
  }
}
