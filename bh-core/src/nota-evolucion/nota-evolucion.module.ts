import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotaEvolucion } from './entities/nota-evolucion.entity';
import { Hospitalizacion } from '../hospitalizacion/entities/hospitalizacion.entity';

import { NotaEvolucionService } from './nota-evolucion.service';
import { NotaEvolucionController } from './nota-evolucion.controller';

/**
 * Módulo de gestión de notas de evolución.
 *
 * Encapsula la lógica relacionada con el registro y consulta de notas
 * de evolución diarias de mascotas hospitalizadas.
 *
 * Importa la entidad `Hospitalizacion` para validar su existencia y
 * estado activo antes de registrar cada nota.
 */
@Module({
  imports: [TypeOrmModule.forFeature([NotaEvolucion, Hospitalizacion])],
  controllers: [NotaEvolucionController],
  providers: [NotaEvolucionService],
  exports: [NotaEvolucionService, TypeOrmModule],
})
export class NotaEvolucionModule {}
