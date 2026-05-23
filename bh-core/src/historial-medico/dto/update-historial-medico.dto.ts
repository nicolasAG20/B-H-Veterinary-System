import { PartialType } from '@nestjs/mapped-types';
import { CreateHistorialMedicoDto } from './create-historial-medico.dto';

export class UpdateHistorialMedicoDto extends PartialType(CreateHistorialMedicoDto) {}
