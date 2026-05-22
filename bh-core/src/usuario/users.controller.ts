import { Controller, Patch, Param, Body } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { MotivoDto } from './dto/motivo.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Patch(':userId/approve')
  aprobar(@Param('userId') userId: string) {
    return this.usuarioService.aprobar(+userId);
  }

  @Patch(':userId/reject')
  rechazar(@Param('userId') userId: string, @Body() _dto: MotivoDto) {
    return this.usuarioService.rechazar(+userId);
  }

  @Patch(':userId/suspend')
  suspender(@Param('userId') userId: string, @Body() _dto: MotivoDto) {
    return this.usuarioService.suspender(+userId);
  }
}
