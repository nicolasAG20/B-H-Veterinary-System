import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HistorialMedicoService } from './historial-medico.service';
import { HistorialMedicoController } from './historial-medico.controller';

import { HistorialMedico } from './entities/historial-medico.entity';
import { Cita } from '../cita/entities/cita.entity';
import { Medicamento } from '../medicamento/entities/medicamento.entity';
import { Mascota } from '../mascota/entities/mascota.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HistorialMedico,
      Cita,
      Medicamento,
      Mascota,
    ]),
  ],
  controllers: [HistorialMedicoController],
  providers: [HistorialMedicoService],
})
export class HistorialMedicoModule {}
