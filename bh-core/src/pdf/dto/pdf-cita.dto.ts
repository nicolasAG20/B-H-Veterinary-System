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
import { PagoDto } from '../../cita/dto/pago.dto';

/**
 * DTO para generar un pdf de las citas en un rango de fechas
 *
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
