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

import { CitaService } from './cita.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * Controlador para la gestión de citas veterinarias.
 *
 * Expone los endpoints bajo el prefijo `/api/v1/appointments`.
 * Todos los endpoints requieren autenticación mediante JWT.
 */
@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class CitaController {
  constructor(private readonly citaService: CitaService) {}

  /**
   * Agenda una nueva cita veterinaria con verificación de pago obligatoria.
   *
   * El sistema calcula el total a partir de los servicios seleccionados
   * y verifica que el monto pagado sea suficiente antes de confirmar el
   * agendamiento. Si el pago es aprobado, la cita queda en estado `AGENDADA`
   * y se envía un correo de confirmación al cliente.
   *
   * @param createCitaDto - Datos de la cita incluyendo servicios y pago.
   * @returns Mensaje de confirmación y la cita creada.
   */
  @Post()
  create(@Body() createCitaDto: CreateCitaDto) {
    return this.citaService.create(createCitaDto);
  }

  /**
   * Retorna todas las citas registradas en el sistema.
   *
   * @returns Listado de citas con sus relaciones.
   */
  @Get()
  findAll() {
    return this.citaService.findAll();
  }

  /**
   * Retorna una cita específica por su ID.
   *
   * @param id - Identificador de la cita.
   * @returns Cita encontrada con sus relaciones.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citaService.findOne(+id);
  }

  /**
   * Actualiza los datos de una cita existente.
   *
   * @param id - Identificador de la cita a actualizar.
   * @param updateCitaDto - Campos a modificar.
   * @returns Cita actualizada.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCitaDto: UpdateCitaDto) {
    return this.citaService.update(+id, updateCitaDto);
  }

  /**
   * Elimina una cita del sistema.
   *
   * @param id - Identificador de la cita a eliminar.
   * @returns Mensaje de confirmación.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.citaService.remove(+id);
  }
}
