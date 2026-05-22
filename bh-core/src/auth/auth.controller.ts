import { Controller, Post, Body } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { RegistroUsuarioDto } from '../usuario/dto/create-usuario.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('register')
  register(@Body() registroUsuarioDto: RegistroUsuarioDto) {
    return this.usuarioService.registro(registroUsuarioDto);
  }
}
