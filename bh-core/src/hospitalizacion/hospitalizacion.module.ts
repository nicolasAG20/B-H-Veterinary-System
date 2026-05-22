import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospitalizacion } from './entities/hospitalizacion.entity';
import { HospitalizacionService } from './hospitalizacion.service';
import { HospitalizacionController } from './hospitalizacion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Hospitalizacion])],
  controllers: [HospitalizacionController],
  providers: [HospitalizacionService],
  exports: [HospitalizacionService, TypeOrmModule],
})
export class HospitalizacionModule {}
