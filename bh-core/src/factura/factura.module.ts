import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factura } from './entities/factura.entity';
import { Cita } from '../cita/entities/cita.entity';
import { Producto } from '../producto/entities/producto.entity';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Factura, Cita, Producto])],
  controllers: [FacturaController],
  providers: [FacturaService],
  exports: [FacturaService, TypeOrmModule],
})
export class FacturaModule {}
