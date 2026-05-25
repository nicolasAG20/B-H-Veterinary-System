import { PartialType } from '@nestjs/mapped-types';
import { CreateCitaDto } from './create-cita.dto';

/**
 * DTO para la actualización parcial de una cita veterinaria.
 *
 * Hereda todos los campos de `CreateCitaDto` y los convierte en opcionales,
 * permitiendo actualizar únicamente los campos que se envíen en la petición.
 */
export class UpdateCitaDto extends PartialType(CreateCitaDto) {}
