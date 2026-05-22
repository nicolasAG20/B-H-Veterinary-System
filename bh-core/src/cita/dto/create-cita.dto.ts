import { IsArray, IsDateString, IsEnum, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { EstadoCita } from '../entities/cita.entity';

export class CreateCitaDto {
  @IsDateString()
  fecha_hora: string;

  @IsEnum(EstadoCita)
  estado: EstadoCita;

  @IsInt()
  @IsOptional()
  precio_total?: number;

  @IsString()
  @IsOptional()
  motivo_cancelacion?: string;

  @IsInt()
  @IsPositive()
  mascotaId: number;

  @IsInt()
  @IsPositive()
  usuarioId: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  servicioIds?: number[];
}
