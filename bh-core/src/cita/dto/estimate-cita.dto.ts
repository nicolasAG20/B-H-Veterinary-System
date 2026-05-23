import { IsArray, ArrayNotEmpty, IsInt, IsPositive } from 'class-validator';

/**
 * DTO para la estimación del costo de una cita veterinaria.
 *
 * Recibe la lista de IDs de servicios seleccionados y permite calcular
 * el monto total antes de confirmar el agendamiento, sin persistir ningún dato.
 */
export class EstimateCitaDto {
  /**
   * Lista de identificadores de los servicios a incluir en la estimación.
   * Debe contener al menos un servicio, y cada ID debe ser un entero positivo.
   */
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  servicios: number[];
}
