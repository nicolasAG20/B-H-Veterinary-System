import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mascota, EstadoMascota } from './entities/mascota.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';

@Injectable()
export class MascotaService {
  constructor(
    @InjectRepository(Mascota)
    private readonly mascotaRepository: Repository<Mascota>,

    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async create(createMascotaDto: CreateMascotaDto) {
    const { clienteId, estado, ...rest } = createMascotaDto;

    const cliente = await this.clienteRepository.findOne({
      where: { idCliente: clienteId},
    });

    if (!cliente){
      throw new NotFoundException(
        'Cliente #${clienteId} no encontrado',
      );
    }

    const mascota = this.mascotaRepository.create({
      ...rest,
      estado: estado ?? EstadoMascota.ACTIVA,
      cliente,
    });

    await this.mascotaRepository.save(mascota);

    return{
      message: 'Mascota creada correctamente',
      mascota,
    };
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


  async findByCliente(clienteId: number){
    const cliente = await this.clienteRepository.findOne({
       where: { idCliente: clienteId},
    })

    if(!cliente){
      throw new NotFoundException('Cliente #${clienteId} no encontrado');
    }

    return this.mascotaRepository.find({
      where: { cliente: { idCliente: clienteId } },
      relations: ['cliente'],
    });
   
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
