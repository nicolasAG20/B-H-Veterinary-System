import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factura } from '../factura/entities/factura.entity';
import { Cita } from '../cita/entities/cita.entity';
import { Producto } from '../producto/entities/producto.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { Servicio } from 'src/servicio/entities/servicio.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Factura, Cita, Producto, Cliente , Servicio])],
  controllers: [PdfController],
  providers: [PdfService],
  exports: [PdfService, TypeOrmModule],
})
export class PdfModule {}
