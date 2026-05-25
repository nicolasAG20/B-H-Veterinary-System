import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateServicioDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsInt()
  @IsPositive()
  precio: number;
}
