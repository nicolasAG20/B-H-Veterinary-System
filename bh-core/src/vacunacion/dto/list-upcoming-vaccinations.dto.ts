import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

/**
 * DTO para consultar vacunas con proxima dosis cercana.
 *
 * Permite indicar la cantidad de dias hacia el futuro que se deben revisar.
 * Si no se envia el parametro, el sistema consulta los proximos 30 dias.
 */
export class ListUpcomingVaccinationsDto {
  /** Cantidad de dias a futuro para buscar vacunas proximas a vencer. */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Los dias deben ser un numero entero' })
  @Min(1, { message: 'Los dias deben ser mayor o igual a 1' })
  dias?: number = 30;
}