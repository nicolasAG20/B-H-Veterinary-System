import { Hospitalizacion } from '../entities/hospitalizacion.entity';

/**
 * Respuesta retornada al internar exitosamente una mascota.
 */
export interface IResultadoInternacion {
  /** Mensaje de confirmación de la operación. */
  message: string;

  /** Registro de hospitalización creado. */
  hospitalizacion: Hospitalizacion;
}
