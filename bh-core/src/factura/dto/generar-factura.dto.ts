import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';

export class MedicamentoAdicionalDto {
  @IsInt()
  @IsPositive()
  productoId: number;

  @IsInt()
  @IsPositive()
  cantidad: number;
}

export class GenerarFacturaDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  descuento?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicamentoAdicionalDto)
  @IsOptional()
  medicamentos_adicionales?: MedicamentoAdicionalDto[];
}
