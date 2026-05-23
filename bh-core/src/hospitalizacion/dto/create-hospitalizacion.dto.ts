import { IsDateString, IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { EstadoEgreso } from '../entities/hospitalizacion.entity';

export class CreateHospitalizacionDto {
  @IsDateString()
  fecha_ingreso: string;

  @IsDateString()
  fecha_salida: string;

  @IsEnum(EstadoEgreso)
  @IsOptional()
  estado_egreso?: EstadoEgreso;

  @IsInt()
  @IsPositive()
  usuarioId: number;

  @IsInt()
  @IsPositive()
  mascotaId: number;
}
