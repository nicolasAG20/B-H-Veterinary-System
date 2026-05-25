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

import { NotaEvolucionService } from './nota-evolucion.service';
import { CreateNotaEvolucionDto } from './dto/create-nota-evolucion.dto';
import { UpdateNotaEvolucionDto } from './dto/update-nota-evolucion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * Controlador para la gestión de notas de evolución de hospitalizaciones.
 *
 * Expone los endpoints bajo el prefijo `/api/v1/hospitalizations/:hospitalizacionId/evolution-notes`.
 * Todos los endpoints requieren autenticación mediante JWT.
 */
@UseGuards(JwtAuthGuard)
@Controller('hospitalizations/:hospitalizacionId/evolution-notes')
export class NotaEvolucionController {
  constructor(private readonly notaEvolucionService: NotaEvolucionService) {}

  /**
   * Registra una nota de evolución diaria para una mascota hospitalizada.
   *
   * El sistema valida que la hospitalización exista y que esté activa
   * (sin fecha de salida). Solo se permite registrar notas mientras la
   * mascota permanezca internada.
   *
   * @param hospitalizacionId - Identificador de la hospitalización activa.
   * @param dto - Datos de la nota: texto descriptivo y fecha.
   * @returns Mensaje de confirmación y la nota de evolución creada.
   */
  @Post()
  create(
    @Param('hospitalizacionId') hospitalizacionId: string,
    @Body() dto: CreateNotaEvolucionDto,
  ) {
    return this.notaEvolucionService.create(+hospitalizacionId, dto);
  }

  /**
   * Retorna todas las notas de evolución de una hospitalización específica,
   * ordenadas por fecha ascendente.
   *
   * @param hospitalizacionId - Identificador de la hospitalización.
   * @returns Listado de notas de evolución.
   */
  @Get()
  findByHospitalizacion(
    @Param('hospitalizacionId') hospitalizacionId: string,
  ) {
    return this.notaEvolucionService.findByHospitalizacion(+hospitalizacionId);
  }

  /**
   * Retorna una nota de evolución específica por su ID.
   *
   * @param id - Identificador de la nota.
   * @returns Nota encontrada con sus relaciones.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notaEvolucionService.findOne(+id);
  }

  /**
   * Actualiza el contenido o fecha de una nota de evolución existente.
   *
   * @param id - Identificador de la nota a actualizar.
   * @param dto - Campos a modificar.
   * @returns Nota actualizada.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateNotaEvolucionDto) {
    return this.notaEvolucionService.update(+id, dto);
  }

  /**
   * Elimina una nota de evolución del sistema.
   *
   * @param id - Identificador de la nota a eliminar.
   * @returns Mensaje de confirmación.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notaEvolucionService.remove(+id);
  }
}
