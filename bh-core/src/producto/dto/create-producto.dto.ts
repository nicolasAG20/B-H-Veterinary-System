import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsString, Matches, MaxLength, Min } from 'class-validator';

export class CreateProductoDto {
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Matches(/\S/, { message: 'El nombre no puede estar vacío' })
  @MaxLength(100, { message: 'El nombre no puede superar 100 caracteres' })
  nombre: string;

  @Type(() => Number)
  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;

  @Type(() => Number)
  @IsInt({ message: 'El stock mínimo debe ser un número entero' })
  @Min(1, { message: 'El stock mínimo debe ser mayor a cero' })
  stock_minimo: number;

  @Type(() => Number)
  @IsInt({ message: 'El precio debe ser un número entero' })
  @Min(1, { message: 'El precio debe ser mayor a cero' })
  precio: number;

  @IsDateString({}, { message: 'La fecha de vencimiento debe tener formato de fecha válido' })
  fecha_vencimiento: string;
}
