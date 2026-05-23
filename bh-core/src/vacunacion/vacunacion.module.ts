import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacunacion } from './entities/vacunacion.entity';
import { VacunacionService } from './vacunacion.service';
import { VacunacionController } from './vacunacion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vacunacion])],
  controllers: [VacunacionController],
  providers: [VacunacionService],
  exports: [VacunacionService, TypeOrmModule],
})
export class VacunacionModule {}
