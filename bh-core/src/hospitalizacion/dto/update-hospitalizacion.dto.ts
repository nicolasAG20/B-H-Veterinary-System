import { PartialType } from '@nestjs/mapped-types';
import { CreateHospitalizacionDto } from './create-hospitalizacion.dto';

export class UpdateHospitalizacionDto extends PartialType(CreateHospitalizacionDto) {}
