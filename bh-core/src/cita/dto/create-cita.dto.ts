import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PagoDto } from './pago.dto';

/**
 * DTO para el agendamiento de una nueva cita veterinaria.
 *
 * Contiene los datos requeridos para registrar una cita con pago obligatorio.
 * El sistema calcula el total automáticamente a partir de los servicios
 * seleccionados y verifica que el monto pagado sea suficiente antes de
 * confirmar el agendamiento.
 */
export class CreateCitaDto {
  /**
   * Fecha y hora programadas para la cita.
   * Debe estar en formato ISO 8601 (ej. `2026-06-20T10:00:00`).
   */
  @IsDateString({}, { message: 'La fecha y hora son obligatorias' })
  fecha_hora: string;

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

  /**
   * Motivo de cancelación de la cita.
   * Solo aplica cuando la cita es cancelada posteriormente.
   */
  @IsString()
  @IsOptional()
  motivo_cancelacion?: string;

  /**
   * Información del pago realizado para confirmar el agendamiento.
   * El monto debe cubrir el total calculado de los servicios seleccionados.
   */
  @ValidateNested()
  @Type(() => PagoDto)
  pago: PagoDto;
}
