import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Reembolso } from './entities/reembolso.entity';
import { Factura } from '../factura/entities/factura.entity';
import { ReembolsoService } from './reembolso.service';
import { ReembolsoController } from './reembolso.controller';

/**
 * Módulo de gestión de reembolsos.
 *
 * Encapsula la lógica para que el administrador revise y resuelva las
 * solicitudes de reembolso generadas al cancelar citas con factura pagada.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Reembolso, Factura])],
  controllers: [ReembolsoController],
  providers: [ReembolsoService],
  exports: [TypeOrmModule],
})
export class ReembolsoModule {}
