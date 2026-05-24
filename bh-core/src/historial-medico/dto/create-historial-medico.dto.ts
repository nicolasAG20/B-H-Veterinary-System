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
  nombre: string;

  @IsString()
  @IsNotEmpty()
  dosis: string;

  @IsString()
  @IsNotEmpty()
  duracion: string;
}

/**
 * DTO para registrar vacunas aplicadas dentro del historial medico.
 */
class CrearVacunacionRequestDto {
  /** Producto de inventario asociado a la vacuna aplicada. */
  @IsInt()
  @IsPositive()
  productoId: number;

  /** Nombre de la vacuna aplicada. */
  @IsString()
  @IsNotEmpty()
  nombre: string;

  /** Fecha en que se aplico la vacuna. */
  @IsDateString()
  fecha_aplicacion: string;

  /** Fecha programada para la siguiente dosis. */
  @IsDateString()
  fecha_proxima_dosis: string;
}

/**
 * DTO para registrar el historial médico de una cita.
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

  /**
 * Vacunas aplicadas durante la atencion medica.
 */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrearVacunacionRequestDto)
  @IsOptional()
  vacunaciones?: CrearVacunacionRequestDto[];
  
  /**
   * peso actual de la mascota registrado durante la atención
   * Debe ser un número positivo para evitar valores vacíos, negativos o cero
   */
  @IsNumber()
  @IsPositive()
  peso_mascota: number;
  
}