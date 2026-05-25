/**
 * Representa el detalle de un servicio incluido en la estimación de una cita.
 */
export interface DetalleServicio {
  /** Identificador único del servicio. */
  servicioId: number;

  /** Nombre descriptivo del servicio. */
  nombre: string;

  /** Precio unitario del servicio en pesos. */
  precio: number;
}

/**
 * Respuesta del endpoint de estimación de costo de una cita.
 * Contiene el total calculado y el desglose por servicio.
 */
export interface EstimateCitaResponse {
  /** Suma total de los precios de todos los servicios seleccionados. */
  total: number;

  /** Detalle individual de cada servicio incluido en la estimación. */
  detalles: DetalleServicio[];
}
