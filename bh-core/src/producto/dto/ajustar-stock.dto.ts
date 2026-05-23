import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Matches, MaxLength, NotEquals } from 'class-validator';

export class AjustarStockDto {
  @Type(() => Number)
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @NotEquals(0, { message: 'La cantidad debe ser diferente de cero' })
  cantidad: number;

  @IsString({ message: 'El motivo debe ser texto' })
  @IsNotEmpty({ message: 'El motivo es obligatorio' })
  @Matches(/\S/, { message: 'El motivo no puede estar vacío' })
  @MaxLength(255, { message: 'El motivo no puede superar 255 caracteres' })
  motivo: string;
}