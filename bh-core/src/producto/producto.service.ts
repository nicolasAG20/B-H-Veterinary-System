import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { AjustarStockDto } from './dto/ajustar-stock.dto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const producto = this.productoRepository.create({
      nombre: createProductoDto.nombre.trim(),
      stock: createProductoDto.stock,
      stock_minimo: createProductoDto.stock_minimo,
      precio: createProductoDto.precio,
      fecha_vencimiento: new Date(createProductoDto.fecha_vencimiento),
    });

    return this.productoRepository.save(producto);
  }

  async findAll(search?: string): Promise<Producto[]> {
    const textoBusqueda = search?.trim();
    if (!textoBusqueda) {
      return this.productoRepository.find();
  }
    return this.productoRepository.find({
      where: { nombre: Like(`%${textoBusqueda}%`) },
    });
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOneBy({ idProducto: id });
    if (!producto) {
      throw new NotFoundException(`Producto #${id} no encontrado`);
    }
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    if (Object.keys(updateProductoDto).length === 0) {
      throw new BadRequestException('Debe enviar al menos un campo para actualizar');
    }

    const producto = await this.findOne(id);

    if (updateProductoDto.nombre !== undefined) {
      producto.nombre = updateProductoDto.nombre.trim();
    }

    if (updateProductoDto.stock_minimo !== undefined) {
      producto.stock_minimo = updateProductoDto.stock_minimo;
    }

    if (updateProductoDto.precio !== undefined) {
      producto.precio = updateProductoDto.precio;
    }

    if (updateProductoDto.fecha_vencimiento !== undefined) {
      producto.fecha_vencimiento = new Date(updateProductoDto.fecha_vencimiento);
    }

    return this.productoRepository.save(producto);
  }


  async adjustStock(id: number, ajustarStockDto: AjustarStockDto): Promise<Producto> {
    const producto = await this.findOne(id);
    const nuevoStock = producto.stock + ajustarStockDto.cantidad;

    if (nuevoStock < 0) {
      throw new BadRequestException('El stock resultante no puede ser negativo');
    }

    producto.stock = nuevoStock;
    return this.productoRepository.save(producto);
  } 
}
