import { IsDateString, IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateProductoDto {
  @IsInt()
  @IsPositive()
  stock: number;

  @IsInt()
  @IsPositive()
  stock_minimo: number;

  @IsNumber()
  @IsPositive()
  precio: number;

  @IsDateString()
  fecha_vencimiento: string;
}
