import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

export class MedicamentoPrescritoDto {
  @IsInt()
  @IsPositive()
  productoId: number;

  @IsString()
  @IsNotEmpty({
    message: 'La dosis es obligatoria',
  })
  dosis: string;

  @IsString()
  @IsNotEmpty({
    message: 'La duración es obligatoria',
  })
  duracion: string;
}

export class CreateHistorialMedicoDto {
  @IsString()
  @IsNotEmpty({
    message: 'El motivo de la visita es obligatorio',
  })
  motivo_visita: string;

  @IsString()
  @IsNotEmpty({
    message: 'El diagnóstico es obligatorio',
  })
  diagnostico: string;

  @IsString()
  @IsNotEmpty({
    message: 'El tratamiento es obligatorio',
  })
  tratamiento: string;

  @IsNumber()
  @IsPositive({
    message: 'El peso debe ser mayor a 0',
  })
  @Min(0.1)
  peso_mascota: number;

  @IsDateString()
  @IsNotEmpty({
    message: 'La próxima visita es obligatoria',
  })
  proxima_visita: string;

  @IsInt()
  @IsPositive()
  citaId: number;

  @IsInt()
  @IsPositive()
  usuarioId: number;

  @IsArray()
  @ArrayMinSize(1, {
    message: 'Debe registrar al menos un medicamento',
  })
  @ValidateNested({ each: true })
  @Type(() => MedicamentoPrescritoDto)
  medicamentos_prescritos: MedicamentoPrescritoDto[];
}