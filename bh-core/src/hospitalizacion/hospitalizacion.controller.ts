import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { HospitalizacionService } from './hospitalizacion.service';
import { CreateHospitalizacionDto } from './dto/create-hospitalizacion.dto';
import { UpdateHospitalizacionDto } from './dto/update-hospitalizacion.dto';
import { DarAltaDto } from './dto/dar-alta.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Actor } from '../audit/actor.decorator';
import { ActorAuditoria } from '../audit/audit.types';

/**
 * Controlador para la gestión de hospitalizaciones veterinarias.
 *
 * Expone los endpoints bajo el prefijo `/api/v1/hospitalizations`.
 * Todos los endpoints requieren autenticación mediante JWT.
 */
@UseGuards(JwtAuthGuard)
@Controller('hospitalizations')
export class HospitalizacionController {
  constructor(private readonly hospitalizacionService: HospitalizacionService) {}

  /**
   * Interna una mascota en la clínica y registra el inicio de su hospitalización.
   *
   * El sistema valida que la mascota exista y que no esté ya hospitalizada.
   * Al confirmar la internación, el estado de la mascota cambia a `HOSPITALIZADA`.
   *
   * @param dto - Datos de la internación: motivo, fecha de ingreso, IDs de mascota y veterinario.
   * @returns Mensaje de confirmación y el registro de hospitalización creado.
   */
  @Post()
  create(@Body() dto: CreateHospitalizacionDto, @Actor() actor: ActorAuditoria) {
    return this.hospitalizacionService.create(dto, actor);
  }

  /**
   * Retorna todas las hospitalizaciones registradas en el sistema.
   *
   * @returns Listado de hospitalizaciones con sus relaciones.
   */
  @Get()
  findAll() {
    return this.hospitalizacionService.findAll();
  }

  /**
   * Retorna una hospitalización específica por su ID,
   * incluyendo sus notas de evolución.
   *
   * @param id - Identificador de la hospitalización.
   * @returns Hospitalización encontrada con sus relaciones.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hospitalizacionService.findOne(+id);
  }

  /**
   * Registra el alta de una mascota hospitalizada.
   *
   * El sistema valida que la hospitalización exista y que no haya sido
   * dada de alta previamente. Al confirmar el alta, actualiza el estado
   * de la mascota según el estado de egreso:
   * - `RECUPERADA` o `TRASLADADA` → estado mascota: `ACTIVA`
   * - `FALLECIDA` → estado mascota: `FALLECIDA`
   *
   * @param id - Identificador de la hospitalización a cerrar.
   * @param dto - Fecha de salida y estado de egreso (ambos obligatorios).
   * @returns Mensaje de confirmación y la hospitalización actualizada.
   */
  @Patch(':id/discharge')
  discharge(
    @Param('id') id: string,
    @Body() dto: DarAltaDto,
    @Actor() actor: ActorAuditoria,
  ) {
    return this.hospitalizacionService.discharge(+id, dto, actor);
  }

  /**
   * Actualiza los datos de una hospitalización existente.
   *
   * @param id - Identificador de la hospitalización a actualizar.
   * @param dto - Campos a modificar.
   * @returns Hospitalización actualizada.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateHospitalizacionDto) {
    return this.hospitalizacionService.update(+id, dto);
  }

  /**
   * Elimina una hospitalización del sistema.
   *
   * @param id - Identificador de la hospitalización a eliminar.
   * @returns Mensaje de confirmación.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hospitalizacionService.remove(+id);
  }
}
