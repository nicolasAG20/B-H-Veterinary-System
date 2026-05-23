import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto) {
    const { usuarioId, ...rest } = createClienteDto;
    const cliente = this.clienteRepository.create({
      ...rest,
      usuario: { id: usuarioId } as any,
    });
    await this.clienteRepository.save(cliente);
    return { message: 'Cliente creado correctamente', cliente };
  }

  async findAll() {
    return this.clienteRepository.find({ relations: ['usuario', 'mascotas'] });
  }

  async findOne(id: number) {
    const cliente = await this.clienteRepository.findOne({
      where: { idCliente: id },
      relations: ['usuario', 'mascotas'],
    });
    if (!cliente) {
      throw new NotFoundException(`Cliente #${id} no encontrado`);
    }
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    await this.findOne(id);
    const { usuarioId, ...rest } = updateClienteDto;
    const updateData: any = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== undefined),
    );
    if (usuarioId !== undefined) {
      updateData.usuario = { id: usuarioId };
    }
    await this.clienteRepository.update(id, updateData);
    return { message: 'Cliente actualizado', cliente: await this.findOne(id) };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.clienteRepository.delete(id);
    return { message: 'Cliente eliminado correctamente' };
  }
}
