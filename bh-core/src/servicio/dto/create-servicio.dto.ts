import { IsBoolean, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateServicioDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsInt()
  @IsPositive()
  precio: number;

  @IsBoolean()
  activo: boolean;
}
