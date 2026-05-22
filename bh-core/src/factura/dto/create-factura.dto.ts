import { IsEnum, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { EstadoFactura } from '../entities/factura.entity';

export class CreateFacturaDto {
  @IsInt()
  @IsOptional()
  total?: number;

  @IsInt()
  @IsOptional()
  subtotal?: number;

  @IsInt()
  @IsOptional()
  descuento?: number;

  @IsInt()
  @IsOptional()
  monto_pagado?: number;

  @IsEnum(EstadoFactura)
  @IsOptional()
  estado?: EstadoFactura;

  @IsString()
  @IsOptional()
  motivo_anulacion?: string;

  @IsInt()
  @IsPositive()
  citaId: number;
}
