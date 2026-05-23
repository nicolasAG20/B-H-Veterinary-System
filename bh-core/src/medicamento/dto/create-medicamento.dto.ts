import { IsInt, IsPositive, IsString } from 'class-validator';

export class CreateMedicamentoDto {
  @IsString()
  nombre_medicamento: string;

  @IsString()
  dosis: string;

  @IsString()
  duracion: string;

  @IsInt()
  @IsPositive()
  historialMedicoId: number;

  @IsInt()
  @IsPositive()
  productoId: number;
}
