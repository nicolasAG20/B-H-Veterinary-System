import { PartialType } from '@nestjs/mapped-types';
import { CreateVacunacionDto } from './create-vacunacion.dto';

export class UpdateVacunacionDto extends PartialType(CreateVacunacionDto) {}
