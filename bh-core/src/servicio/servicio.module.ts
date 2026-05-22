import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Servicio } from './entities/servicio.entity';
import { ServicioService } from './servicio.service';
import { ServicioController } from './servicio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Servicio])],
  controllers: [ServicioController],
  providers: [ServicioService],
  exports: [ServicioService, TypeOrmModule],
})
export class ServicioModule {}
