import { IsDateString, IsEnum, IsInt, IsNumber, IsPositive, IsString } from 'class-validator';
import { EstadoMascota } from '../entities/mascota.entity';

export class CreateMascotaDto {
  @IsString()
  nombre: string;

  @IsString()
  especie: string;

  @IsString()
  raza: string;

  @IsString()
  color: string;

  @IsDateString()
  fecha_nacimiento: string;

  @IsNumber()
  @IsPositive()
  peso: number;

  @IsEnum(EstadoMascota)
  estado: EstadoMascota;

  @IsInt()
  @IsPositive()
  clienteId: number;
}
