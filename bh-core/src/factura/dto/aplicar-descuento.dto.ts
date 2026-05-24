import { IsNumber, Max, Min } from 'class-validator';

export class AplicarDescuentoDto {
  @IsNumber()
  @Min(0.01)
  @Max(100)
  porcentaje_descuento: number;
}
