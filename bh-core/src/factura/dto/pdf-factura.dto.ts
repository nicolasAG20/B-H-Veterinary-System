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

/**
 * DTO para rango de las facturas para el PDF.
 *
 *Contiene los datos de inicio y fin del rango de fechas. 
 */
export class PdfFacturaDto {
  /**
   * Fecha y hora para el inicio del rango de las facturas.
   * Debe estar en formato ISO 8601 (ej. `2026-06-20T10:00:00`).
   */
  @IsDateString({}, { message: 'La fecha y hora son obligatorias' })
  fecha_inicio: string;
    /**
   * Fecha y hora para el final del rango de las facturas.
   * Debe estar en formato ISO 8601 (ej. `2026-06-20T10:00:00`).
   */
  @IsDateString({}, { message: 'La fecha y hora son obligatorias' })
  fecha_fin: string;
  
}
