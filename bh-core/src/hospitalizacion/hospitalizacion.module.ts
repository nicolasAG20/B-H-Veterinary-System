import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Hospitalizacion } from './entities/hospitalizacion.entity';
import { Mascota } from '../mascota/entities/mascota.entity';

import { HospitalizacionService } from './hospitalizacion.service';
import { HospitalizacionController } from './hospitalizacion.controller';

/**
 * Módulo de gestión de hospitalizaciones veterinarias.
 *
 * Encapsula la lógica relacionada con el ciclo de vida de una hospitalización:
 * internación de mascotas, consulta de registros activos e históricos,
 * actualización de datos y eliminación.
 *
 * Importa la entidad `Mascota` para poder validar su existencia y
 * actualizar su estado durante el proceso de internación.
 *
 * Exporta `HospitalizacionService` y `TypeOrmModule` para que otros módulos
 * puedan acceder a la entidad `Hospitalizacion` y su servicio si lo requieren.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Hospitalizacion, Mascota])],
  controllers: [HospitalizacionController],
  providers: [HospitalizacionService],
  exports: [HospitalizacionService, TypeOrmModule],
})
export class HospitalizacionModule {}
