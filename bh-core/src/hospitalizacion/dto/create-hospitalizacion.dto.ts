import { IsDateString, IsInt, IsPositive, IsString, MinLength } from 'class-validator';

/**
 * DTO para registrar la internación de una mascota en la clínica.
 *
 * Contiene únicamente los datos requeridos al momento del ingreso.
 * La fecha de salida y el estado de egreso se registran posteriormente
 * mediante el endpoint de alta (`PATCH /hospitalizations/:id/discharge`).
 */
export class CreateHospitalizacionDto {
  /**
   * Motivo clínico por el cual se interna la mascota.
   * Debe ser descriptivo para facilitar el seguimiento médico.
   */
  @IsString({ message: 'El motivo debe ser un texto' })
  @MinLength(5, { message: 'El motivo debe tener al menos 5 caracteres' })
  motivo: string;

  /**
   * Fecha y hora de ingreso a hospitalización.
   * Debe estar en formato ISO 8601 (ej. `2026-06-21T08:00:00`).
   */
  @IsDateString({}, { message: 'La fecha de ingreso debe ser una fecha válida' })
  fecha_ingreso: string;

  /**
   * Identificador de la mascota que será internada.
   * La mascota debe estar registrada y no encontrarse ya hospitalizada.
   */
  @IsInt({ message: 'El identificador de la mascota debe ser un número entero' })
  @IsPositive({ message: 'El identificador de la mascota debe ser mayor a cero' })
  mascotaId: number;

  /**
   * Identificador del veterinario que realiza la internación.
   */
  @IsInt({ message: 'El identificador del veterinario debe ser un número entero' })
  @IsPositive({ message: 'El identificador del veterinario debe ser mayor a cero' })
  veterinarioId: number;
}
