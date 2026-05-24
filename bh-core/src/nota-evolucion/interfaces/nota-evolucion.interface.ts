import { NotaEvolucion } from '../entities/nota-evolucion.entity';

/**
 * Respuesta retornada al registrar exitosamente una nota de evolución.
 */
export interface IResultadoNotaEvolucion {
  /** Mensaje de confirmación de la operación. */
  message: string;

  /** Nota de evolución creada. */
  nota: NotaEvolucion;
}
