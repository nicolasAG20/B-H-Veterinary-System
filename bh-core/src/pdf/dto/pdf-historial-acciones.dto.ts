import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { RolAuditoria, TipoAccion } from '../../audit/audit.types';

/**
 * Filtros opcionales aceptados al generar el reporte PDF del historial
 * de acciones.
 *
 * Cualquier combinación es válida: si no se envía ningún filtro, se incluyen
 * todos los eventos registrados en bh-audit.
 */
export class PdfHistorialAccionesDto {
  /**
   * Tipo de acción a incluir en el reporte.
   */
  @IsOptional()
  @IsEnum(TipoAccion)
  tipo_accion?: TipoAccion;

  /**
   * Identificador del usuario por el cual filtrar.
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  usuarioId?: number;

  /**
   * Rol del usuario por el cual filtrar.
   */
  @IsOptional()
  @IsEnum(RolAuditoria)
  rol?: RolAuditoria;

  /**
   * Fecha inicial del rango a consultar, en formato ISO `YYYY-MM-DD`.
   */
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  /**
   * Fecha final del rango a consultar, en formato ISO `YYYY-MM-DD`.
   */
  @IsOptional()
  @IsDateString()
  fechaFin?: string;
}
