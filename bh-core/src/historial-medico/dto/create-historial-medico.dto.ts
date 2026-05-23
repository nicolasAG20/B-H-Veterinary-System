import { IsArray, IsDateString, IsInt, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MedicamentoPrescritoDto {
  @IsString()
  nombre: string;

  @IsString()
  dosis: string;

  @IsString()
  duracion: string;
}

export class CreateHistorialMedicoDto {
  @IsString()
  motivo_visita: string;

  @IsString()
  diagnostico: string;

  @IsString()
  @IsOptional()
  tratamiento?: string;

  @IsNumber()
  @IsPositive()
  peso_mascota: number;

  @IsDateString()
  @IsOptional()
  proxima_visita?: string;

  @IsDateString()
  @IsOptional()
  fecha_creacion?: string;

  @IsInt()
  @IsPositive()
  citaId: number;

  @IsInt()
  @IsPositive()
  usuarioId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicamentoPrescritoDto)
  medicamentos_prescritos: MedicamentoPrescritoDto[];
}