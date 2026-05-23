import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Cita } from './entities/cita.entity';
import { Servicio } from '../servicio/entities/servicio.entity';
import { CitaService } from './cita.service';
import { CitaController } from './cita.controller';

/**
 * Módulo de gestión de citas veterinarias.
 *
 * Encapsula toda la lógica relacionada con el agendamiento de citas,
 * incluyendo la estimación de costos, la validación de servicios y
 * la verificación de disponibilidad del veterinario.
 *
 * Exporta `CitaService` y `TypeOrmModule` para que otros módulos
 * puedan acceder a la entidad `Cita` y su servicio si lo requieren.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Cita, Servicio])],
  controllers: [CitaController],
  providers: [CitaService],
  exports: [CitaService, TypeOrmModule],
})
export class CitaModule {}
