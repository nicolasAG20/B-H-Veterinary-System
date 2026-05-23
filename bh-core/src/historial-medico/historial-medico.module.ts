import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HistorialMedicoService } from './historial-medico.service';
import { HistorialMedicoController } from './historial-medico.controller';

import { HistorialMedico } from './entities/historial-medico.entity';
import { Cita } from '../cita/entities/cita.entity';
import { Medicamento } from '../medicamento/entities/medicamento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HistorialMedico,
      Cita,
      Medicamento,
    ]),
  ],
  controllers: [HistorialMedicoController],
  providers: [HistorialMedicoService],
  exports: [HistorialMedicoService],
})
export class HistorialMedicoModule {}