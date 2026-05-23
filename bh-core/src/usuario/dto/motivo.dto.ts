import { IsString } from 'class-validator';

export class MotivoDto {
  @IsString()
  motivo: string;
}
