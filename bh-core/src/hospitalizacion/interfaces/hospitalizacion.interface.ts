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

/**
 * Respuesta retornada al dar de alta exitosamente a una mascota hospitalizada.
 */
export interface IResultadoAlta {
  /** Mensaje de confirmación de la operación. */
  message: string;

  /** Registro de hospitalización actualizado con fecha de salida y estado de egreso. */
  hospitalizacion: Hospitalizacion;
}
