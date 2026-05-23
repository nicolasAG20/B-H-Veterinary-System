import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuarioModule } from './usuario/usuario.module';
import { ClienteModule } from './cliente/cliente.module';
import { MascotaModule } from './mascota/mascota.module';
import { CitaModule } from './cita/cita.module';
import { ServicioModule } from './servicio/servicio.module';
import { HistorialMedicoModule } from './historial-medico/historial-medico.module';
import { ProductoModule } from './producto/producto.module';
import { MedicamentoModule } from './medicamento/medicamento.module';
import { VacunacionModule } from './vacunacion/vacunacion.module';
import { FacturaModule } from './factura/factura.module';
import { HospitalizacionModule } from './hospitalizacion/hospitalizacion.module';
import { NotaEvolucionModule } from './nota-evolucion/nota-evolucion.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsuarioModule,
    ClienteModule,
    MascotaModule,
    CitaModule,
    ServicioModule,
    HistorialMedicoModule,
    ProductoModule,
    MedicamentoModule,
    VacunacionModule,
    FacturaModule,
    HospitalizacionModule,
    NotaEvolucionModule,
    AuthModule,
  ],
})
export class AppModule {}
