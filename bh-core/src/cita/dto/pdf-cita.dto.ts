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
export class pdfCitaDto {
  /**
   * Fecha y hora para el inicio del rango de las citas.
   * Debe estar en formato ISO 8601 (ej. `2026-06-20T10:00:00`).
   */
  @IsDateString({}, { message: 'La fecha y hora son obligatorias' })
  fecha_inicio: string;
    /**
   * Fecha y hora para el final del rango de las citas.
   * Debe estar en formato ISO 8601 (ej. `2026-06-20T10:00:00`).
   */
  @IsDateString({}, { message: 'La fecha y hora son obligatorias' })
  fecha_fin: string;
  
}
