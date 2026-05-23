import { Controller, Get, Post, Body, Patch, Put, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { AjustarStockDto } from './dto/ajustar-stock.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../usuario/entities/usuario.entity';

@Controller('products')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productoService.create(createProductoDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('search') search?: string) {
    return this.productoService.findAll(search);
  }

  @Get(':productId')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('productId', ParseIntPipe) productId: number) {
    return this.productoService.findOne(productId);
  }

  @Put(':productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  update(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productoService.update(productId, updateProductoDto);
  }

  @Patch(':productId/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  adjustStock(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() ajustarStockDto: AjustarStockDto,
  ) {
    return this.productoService.adjustStock(productId, ajustarStockDto);
  }}