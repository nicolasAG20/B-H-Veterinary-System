import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO para rechazar un reembolso.
 *
 * El administrador debe indicar el motivo por el cual no aplica el reembolso.
 * Este motivo queda registrado en el sistema junto con la fecha de resolución.
 */
export class RechazarReembolsoDto {
  /** Explicación del motivo por el cual se rechaza el reembolso. */
  @IsString()
  @IsNotEmpty()
  motivo_rechazo: string;
}
