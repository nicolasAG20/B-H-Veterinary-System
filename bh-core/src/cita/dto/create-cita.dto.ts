import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

import { EstadoCita } from '../entities/cita.entity';

/**
 * DTO para la creación de una nueva cita veterinaria.
 *
 * Contiene los datos requeridos para registrar y confirmar una cita,
 * incluyendo la mascota, el veterinario asignado, la fecha, los servicios
 * y la información de pago.
 */
export class CreateCitaDto {
  /**
   * Fecha y hora programadas para la cita.
   * Debe estar en formato ISO 8601 (ej. `2026-06-20T10:00:00`).
   */
  @IsDateString({}, { message: 'La fecha y hora son obligatorias' })
  fecha_hora: string;

  /**
   * Estado inicial de la cita.
   * Debe ser uno de los valores definidos en el enum `EstadoCita`.
   */
  @IsEnum(EstadoCita, { message: 'Estado inválido' })
  estado: EstadoCita;

  /**
   * Precio total de la cita calculado a partir de los servicios.
   * Campo opcional — puede ser calculado por el sistema.
   */
  @IsInt()
  @IsOptional()
  precio_total?: number;

  /**
   * Motivo de cancelación de la cita.
   * Solo aplica cuando el estado es `CANCELADA`.
   */
  @IsString()
  @IsOptional()
  motivo_cancelacion?: string;

  /**
   * Identificador de la mascota que será atendida.
   */
  @IsInt({ message: 'La mascota es obligatoria' })
  @IsPositive()
  mascotaId: number;

  /**
   * Identificador del usuario que agenda la cita (cliente o recepcionista).
   */
  @IsInt({ message: 'El usuario es obligatorio' })
  @IsPositive()
  usuarioId: number;

  /**
   * Identificador del veterinario asignado para atender la cita.
   */
  @IsInt()
  @IsPositive()
  veterinarioId: number;

  /**
   * Lista de IDs de servicios veterinarios a incluir en la cita.
   * Solo se permiten servicios con estado activo.
   */
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  servicioIds?: number[];
}
