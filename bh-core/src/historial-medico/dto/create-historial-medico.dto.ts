import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para registrar medicamentos prescritos dentro del historial médico.
 * Se ajusta al esquema CrearMedicamentoRequest definido en open-api.yml.
 */
class CrearMedicamentoRequestDto {
  @IsInt()
  @IsPositive()
  productoId: number;

  @IsString()
  @IsNotEmpty()
  nombre_medicamento: string;

  @IsString()
  @IsNotEmpty()
  dosis: string;

  @IsString()
  @IsNotEmpty()
  duracion: string;
}

/**
 * DTO para registrar el historial médico de una cita.
 * Endpoint Swagger:
 * POST /appointments/{appointmentId}/medical-record
 */
export class CreateHistorialMedicoDto {
  @IsString()
  @IsNotEmpty()
  motivo_visita: string;

  @IsString()
  @IsNotEmpty()
  diagnostico: string;

  @IsString()
  @IsNotEmpty()
  tratamiento: string;

  @IsNumber()
  @IsPositive()
  peso_mascota: number;

  @IsDateString()
  @IsOptional()
  proxima_visita?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrearMedicamentoRequestDto)
  @IsOptional()
  medicamentos?: CrearMedicamentoRequestDto[];
}