import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialMedico } from './entities/historial-medico.entity';
import { HistorialMedicoService } from './historial-medico.service';
import { HistorialMedicoController } from './historial-medico.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialMedico])],
  controllers: [HistorialMedicoController],
  providers: [HistorialMedicoService],
  exports: [HistorialMedicoService, TypeOrmModule],
})
export class HistorialMedicoModule {}
