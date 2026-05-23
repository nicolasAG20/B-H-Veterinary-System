import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service';
import { RegistroUsuarioDto } from '../usuario/dto/create-usuario.dto';
import { VerificarCorreoDto } from '../usuario/dto/verificar-correo.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuarioService,
  ) {}

  @Post('register')
  register(@Body() dto: RegistroUsuarioDto) {
    return this.usuarioService.registro(dto);
  }

  @Post('verify-email')
  verifyEmail(@Body() dto: VerificarCorreoDto) {
    return this.usuarioService.verificarCorreo(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
