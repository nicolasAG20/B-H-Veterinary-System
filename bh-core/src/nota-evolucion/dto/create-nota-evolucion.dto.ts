import { IsDateString, IsInt, IsPositive, IsString } from 'class-validator';

export class CreateNotaEvolucionDto {
  @IsString()
  nota: string;

  @IsDateString()
  fecha: string;

  @IsInt()
  @IsPositive()
  hospitalizacionId: number;
}
