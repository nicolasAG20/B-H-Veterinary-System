import { IsInt, IsPositive } from 'class-validator';

/**
 * DTO para aprobar un reembolso.
 *
 * El administrador indica el monto a devolver al cliente, que puede ser
 * igual o menor al monto originalmente pagado en la factura.
 */
export class AprobarReembolsoDto {
  /** Monto a reembolsar al cliente. Debe ser un entero positivo. */
  @IsInt()
  @IsPositive()
  monto_aprobado: number;
}
