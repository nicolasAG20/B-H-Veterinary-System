import { PartialType } from '@nestjs/mapped-types';
import { CreateHistorialMedicoDto } from './create-historial-medico.dto';

/**
 * DTO para corregir un historial médico.
 * Todos los campos son opcionales porque la corrección puede ser parcial.
 * Endpoint Swagger:
 * PUT /medical-records/{recordId}
 */
export class UpdateHistorialMedicoDto extends PartialType(
  CreateHistorialMedicoDto,
) {}
