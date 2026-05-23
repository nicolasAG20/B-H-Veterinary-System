import { IsEnum, IsInt, IsPositive } from 'class-validator';

/**
 * Métodos de pago aceptados por el sistema al momento de agendar una cita.
 */
export enum MetodoPago {
  TARJETA = 'TARJETA',
  EFECTIVO = 'EFECTIVO',
  TRANSFERENCIA = 'TRANSFERENCIA',
}

/**
 * DTO que representa la información de pago proporcionada por el cliente
 * o la recepcionista al momento de agendar una cita.
 *
 * El monto recibido debe ser mayor o igual al total calculado a partir
 * de los servicios seleccionados para que el agendamiento sea confirmado.
 */
export class PagoDto {
  /**
   * Método mediante el cual se realiza el pago.
   * Valores aceptados: TARJETA, EFECTIVO, TRANSFERENCIA.
   */
  @IsEnum(MetodoPago, { message: 'Método de pago inválido' })
  metodo: MetodoPago;

  /**
   * Monto en pesos entregado por el cliente.
   * Debe ser un entero positivo mayor o igual al total de los servicios.
   */
  @IsInt({ message: 'El monto debe ser un número entero' })
  @IsPositive({ message: 'El monto debe ser mayor a cero' })
  monto: number;
}
