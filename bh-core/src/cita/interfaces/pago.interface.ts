/**
 * Representa los datos de pago recibidos al momento de agendar una cita.
 */
export interface IPago {
  /** Método utilizado para realizar el pago. */
  metodo: string;

  /** Monto en pesos entregado por el cliente. */
  monto: number;
}

/**
 * Resultado de la verificación de pago realizada por el sistema.
 * Se genera al comparar el monto recibido con el total calculado
 * a partir de los servicios seleccionados.
 */
export interface IResultadoVerificacionPago {
  /** Indica si el pago cubre el total requerido. */
  aprobado: boolean;

  /** Total en pesos requerido según los servicios seleccionados. */
  totalRequerido: number;

  /** Monto en pesos entregado por el cliente. */
  montoRecibido: number;
}

