import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mascota } from './entities/mascota.entity';
import { MascotaService } from './mascota.service';
import { MascotaController } from './mascota.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Mascota])],
  controllers: [MascotaController],
  providers: [MascotaService],
  exports: [MascotaService, TypeOrmModule],
})
export class MascotaModule {}
