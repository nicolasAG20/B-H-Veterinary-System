import { IsDateString, IsInt, IsPositive, IsString } from 'class-validator';

export class CreateVacunacionDto {
  @IsString()
  nombre_vacuna: string;

  @IsDateString()
  fecha_proxima_dosis: string;

  @IsDateString()
  fecha_aplicacion: string;

  @IsInt()
  @IsPositive()
  historialMedicoId: number;

  @IsInt()
  @IsPositive()
  productoId: number;
}
