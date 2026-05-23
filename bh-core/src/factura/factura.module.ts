import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factura } from './entities/factura.entity';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Factura])],
  controllers: [FacturaController],
  providers: [FacturaService],
  exports: [FacturaService, TypeOrmModule],
})
export class FacturaModule {}
