import { IsDateString, IsString, MinLength } from 'class-validator';

/**
 * DTO para registrar una nota de evolución diaria de una mascota hospitalizada.
 *
 * El identificador de la hospitalización no se incluye en el body —
 * se obtiene directamente del parámetro de ruta
 * `PATCH /hospitalizations/:hospitalizacionId/evolution-notes`.
 */
export class CreateNotaEvolucionDto {
  /**
   * Contenido clínico de la nota de evolución.
   * Debe describir el estado actual de la mascota, cambios observados
   * y cualquier acción médica realizada durante el día.
   */
  @IsString({ message: 'La nota debe ser un texto' })
  @MinLength(5, { message: 'La nota debe tener al menos 5 caracteres' })
  nota: string;

  /**
   * Fecha en que se registra la nota de evolución.
   * Debe estar en formato ISO 8601 (ej. `2026-06-22`).
   */
  @IsDateString({}, { message: 'La fecha debe ser una fecha válida' })
  fecha: string;
}
