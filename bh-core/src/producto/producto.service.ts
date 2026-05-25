import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { AjustarStockDto } from './dto/ajustar-stock.dto';
import {
  ActorAuditoria,
  AUDIT_CLIENT,
  IAuditClient,
  TipoAccion,
} from '../audit/audit.types';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @Inject(AUDIT_CLIENT)
    private readonly auditClient: IAuditClient,
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


  async adjustStock(
    id: number,
    ajustarStockDto: AjustarStockDto,
    actor: ActorAuditoria,
  ): Promise<Producto> {
    const producto = await this.findOne(id);
    const nuevoStock = producto.stock + ajustarStockDto.cantidad;

    if (nuevoStock < 0) {
      throw new BadRequestException('El stock resultante no puede ser negativo');
    }

    producto.stock = nuevoStock;
    const productoActualizado = await this.productoRepository.save(producto);

    await this.auditClient.registrar({
      tipo_accion: TipoAccion.AJUSTE_INVENTARIO,
      usuarioId: actor.id,
      nombre_usuario: actor.nombre,
      rol: actor.rol,
      fecha_hora: new Date().toISOString(),
    });

    return productoActualizado;
  }

    async findLowStock(): Promise<Producto[]> {
    return this.productoRepository
      .createQueryBuilder('producto')
      .where('producto.stock < producto.stock_minimo')
      .orderBy('producto.stock', 'ASC')
      .addOrderBy('producto.nombre', 'ASC')
      .getMany();
  }

  async findNearExpiration(dias = 30): Promise<Producto[]> {
    const fechaInicio = new Date();
    fechaInicio.setHours(0, 0, 0, 0);

    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + dias);
    fechaFin.setHours(23, 59, 59, 999);

    return this.productoRepository
      .createQueryBuilder('producto')
      .where('producto.fecha_vencimiento BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin,
      })
      .orderBy('producto.fecha_vencimiento', 'ASC')
      .addOrderBy('producto.nombre', 'ASC')
      .getMany();
  }
}
