import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicamentoDto } from './create-medicamento.dto';

export class UpdateMedicamentoDto extends PartialType(CreateMedicamentoDto) {}
