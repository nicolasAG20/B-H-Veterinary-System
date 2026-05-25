import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsInt()
  @IsOptional()
  saldo?: number;

  @IsInt()
  @IsPositive()
  usuarioId: number;
}
