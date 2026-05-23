import { IsNotEmpty, IsString } from 'class-validator';

export class CancelarCitaDto {

  // Valida que el motivo sea texto
  @IsString()

  // Valida que NO este vacío
  @IsNotEmpty({
    message: 'El motivo de cancelación es obligatorio',
  })
  motivo_cancelacion: string;
}