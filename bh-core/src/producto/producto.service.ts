import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto) {
    const producto = this.productoRepository.create(createProductoDto);
    await this.productoRepository.save(producto);
    return { message: 'Producto creado correctamente', producto };
  }

  async findAll() {
    return this.productoRepository.find();
  }

  async findOne(id: number) {
    const producto = await this.productoRepository.findOneBy({ idProducto: id });
    if (!producto) {
      throw new NotFoundException(`Producto #${id} no encontrado`);
    }
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    await this.findOne(id);
    const updateData = Object.fromEntries(
      Object.entries(updateProductoDto).filter(([, v]) => v !== undefined),
    );
    await this.productoRepository.update(id, updateData);
    return { message: 'Producto actualizado', producto: await this.findOne(id) };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.productoRepository.delete(id);
    return { message: 'Producto eliminado correctamente' };
  }
}
