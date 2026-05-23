import { IsArray, IsDateString, IsEnum, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { EstadoCita } from '../entities/cita.entity';

export class CreateCitaDto {
  @IsDateString({}, {
  message: 'La fecha y hora son obligatorias',
})
  fecha_hora: string;

  @IsEnum(EstadoCita, {
  message: 'Estado inválido',
})
  estado: EstadoCita;

  @IsInt()
  @IsOptional()
  precio_total?: number;

  @IsString()
  @IsOptional()
  motivo_cancelacion?: string;

   @IsInt({
    message: 'La mascota es obligatoria',
  })
  @IsPositive()
  mascotaId: number;
  
  @IsInt({
  message: 'El usuario es obligatorio',
})
  @IsPositive()
  usuarioId: number;

  @IsInt()
  @IsPositive()
  veterinarioId: number;
  
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  servicioIds?: number[];
}
