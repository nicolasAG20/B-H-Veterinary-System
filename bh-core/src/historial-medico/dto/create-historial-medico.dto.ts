import { IsDateString, IsInt, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

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
}
