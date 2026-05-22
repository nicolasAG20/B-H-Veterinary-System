import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  imports: [UsuarioModule],
  controllers: [AuthController],
})
export class AuthModule {}
