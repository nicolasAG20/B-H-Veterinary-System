import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cita } from './entities/cita.entity';
import { Servicio } from '../servicio/entities/servicio.entity';
import { CitaService } from './cita.service';
import { CitaController } from './cita.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cita, Servicio])],
  controllers: [CitaController],
  providers: [CitaService],
  exports: [CitaService, TypeOrmModule],
})
export class CitaModule {}
