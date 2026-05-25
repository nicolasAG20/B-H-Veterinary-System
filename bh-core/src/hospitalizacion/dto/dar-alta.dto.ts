import { IsDateString, IsEnum } from 'class-validator';
import { EstadoEgreso } from '../entities/hospitalizacion.entity';

/**
 * DTO para registrar el alta de una mascota hospitalizada.
 *
 * Ambos campos son obligatorios: no se permite dar de alta una mascota
 * sin registrar la fecha de salida y el estado en que egresó.
 * El sistema actualizará automáticamente el estado de la mascota
 * según el estado de egreso registrado.
 */
export class DarAltaDto {
  /**
   * Fecha y hora en que la mascota recibe el alta y egresa de la clínica.
   * Debe estar en formato ISO 8601 (ej. `2026-06-25T14:00:00`).
   */
  @IsDateString({}, { message: 'La fecha de salida debe ser una fecha válida' })
  fecha_salida: string;

  /**
   * Estado clínico en que egresa la mascota al recibir el alta.
   * - `RECUPERADA`: la mascota superó su condición. Estado → ACTIVA.
   * - `TRASLADADA`: fue transferida a otra institución. Estado → ACTIVA.
   * - `FALLECIDA`: la mascota no sobrevivió. Estado → FALLECIDA.
   */
  @IsEnum(EstadoEgreso, {
    message: 'El estado de egreso debe ser RECUPERADA, FALLECIDA o TRASLADADA',
  })
  estado_egreso: EstadoEgreso;
}
