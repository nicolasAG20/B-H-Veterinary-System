import { Controller, Patch, Get, Param, Body, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { MotivoDto } from './dto/motivo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from './entities/usuario.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMINISTRADOR)
export class UsersController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.usuarioService.findOne(+userId);
  }

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
