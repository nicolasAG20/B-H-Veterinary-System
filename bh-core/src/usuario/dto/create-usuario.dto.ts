import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { EstadoUsuario, RolUsuario } from '../entities/usuario.entity';

export class RegistroUsuarioDto {
  @IsString()
  @MinLength(2)
  nombre: string;

  @IsEmail()
  correo: string;

  @IsString()
  @MinLength(6)
  contrasena: string;

  @IsEnum(RolUsuario)
  rol: RolUsuario;
}

export class CreateUsuarioDto {
  @IsString()
  @MinLength(2)
  nombre: string;

  @IsEnum(RolUsuario)
  rol: RolUsuario;

  @IsEmail()
  correo: string;

  @IsString()
  @MinLength(6)
  contrasena: string;

  @IsString()
  @IsOptional()
  codigo_verificacion?: string;

  @IsOptional()
  tiempo_expiracion?: Date;

  @IsEnum(EstadoUsuario)
  @IsOptional()
  estado?: EstadoUsuario;
}
