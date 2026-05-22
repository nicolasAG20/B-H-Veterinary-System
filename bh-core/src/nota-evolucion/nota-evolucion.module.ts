import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotaEvolucion } from './entities/nota-evolucion.entity';
import { NotaEvolucionService } from './nota-evolucion.service';
import { NotaEvolucionController } from './nota-evolucion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NotaEvolucion])],
  controllers: [NotaEvolucionController],
  providers: [NotaEvolucionService],
  exports: [NotaEvolucionService, TypeOrmModule],
})
export class NotaEvolucionModule {}
