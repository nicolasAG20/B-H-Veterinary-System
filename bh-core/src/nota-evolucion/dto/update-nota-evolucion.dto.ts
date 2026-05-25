import { PartialType } from '@nestjs/mapped-types';
import { CreateNotaEvolucionDto } from './create-nota-evolucion.dto';

export class UpdateNotaEvolucionDto extends PartialType(CreateNotaEvolucionDto) {}
