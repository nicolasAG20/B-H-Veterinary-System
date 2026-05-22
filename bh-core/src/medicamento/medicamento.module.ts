import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medicamento } from './entities/medicamento.entity';
import { MedicamentoService } from './medicamento.service';
import { MedicamentoController } from './medicamento.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Medicamento])],
  controllers: [MedicamentoController],
  providers: [MedicamentoService],
  exports: [MedicamentoService, TypeOrmModule],
})
export class MedicamentoModule {}
