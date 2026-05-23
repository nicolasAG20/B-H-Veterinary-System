import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class ListNearExpirationProductsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Los días deben ser un número entero' })
  @Min(1, { message: 'Los días deben ser mayor o igual a 1' })
  dias?: number = 30;
}