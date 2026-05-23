import { IsEmail, IsString, Length } from 'class-validator';

export class VerificarCorreoDto {
  @IsEmail()
  correo: string;

  @IsString()
  @Length(6, 6)
  codigo_verificacion: string;
}
