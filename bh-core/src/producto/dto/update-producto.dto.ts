import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProductoDto } from './create-producto.dto';

export class UpdateProductoDto extends PartialType(OmitType(CreateProductoDto, ['stock'] as const), ) {}
