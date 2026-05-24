import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { ReembolsoService } from './reembolso.service';
import { AprobarReembolsoDto } from './dto/aprobar-reembolso.dto';
import { RechazarReembolsoDto } from './dto/rechazar-reembolso.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../usuario/entities/usuario.entity';

/**
 * Controlador para la gestión de reembolsos.
 *
 * Expone los endpoints bajo el prefijo `/api/v1/reembolsos`.
 * Todos los endpoints requieren autenticación JWT y rol `ADMINISTRADOR`.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMINISTRADOR)
@Controller('reembolsos')
export class ReembolsoController {
  constructor(private readonly reembolsoService: ReembolsoService) {}

  /**
   * Retorna todos los reembolsos registrados en el sistema.
   *
   * @returns Listado de reembolsos con su factura y cita asociadas.
   */
  @Get()
  findAll() {
    return this.reembolsoService.findAll();
  }

  /**
   * Retorna un reembolso específico por su ID.
   *
   * @param id - Identificador del reembolso.
   * @returns Reembolso encontrado con su factura y cita asociadas.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reembolsoService.findOne(+id);
  }

  /**
   * Aprueba un reembolso pendiente.
   *
   * El administrador indica el monto a devolver al cliente. Solo puede
   * ejecutarse si el reembolso está en estado `PENDIENTE`.
   *
   * @param id - Identificador del reembolso a aprobar.
   * @param dto - Monto aprobado para el reembolso.
   * @returns Mensaje de confirmación y el reembolso actualizado.
   */
  @Patch(':id/aprobar')
  aprobar(@Param('id') id: string, @Body() dto: AprobarReembolsoDto) {
    return this.reembolsoService.aprobar(+id, dto);
  }

  /**
   * Rechaza un reembolso pendiente.
   *
   * El administrador registra el motivo del rechazo. Solo puede ejecutarse
   * si el reembolso está en estado `PENDIENTE`.
   *
   * @param id - Identificador del reembolso a rechazar.
   * @param dto - Motivo del rechazo.
   * @returns Mensaje de confirmación y el reembolso actualizado.
   */
  @Patch(':id/rechazar')
  rechazar(@Param('id') id: string, @Body() dto: RechazarReembolsoDto) {
    return this.reembolsoService.rechazar(+id, dto);
  }
}
