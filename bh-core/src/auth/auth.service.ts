import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EstadoUsuario, Usuario } from '../usuario/entities/usuario.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Autentica un usuario y retorna un JWT firmado.
   * Verifica la contraseña con bcrypt y comprueba que la cuenta esté en estado ACTIVO.
   * El payload del token incluye: sub (id), correo y rol.
   * @throws {UnauthorizedException} Si el correo no existe o la contraseña es incorrecta.
   * @throws {ForbiddenException} Si la cuenta no está en estado ACTIVO
   *   (puede estar pendiente de verificación, pendiente de aprobación, rechazada o suspendida).
   */
  async login(dto: LoginDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { correo: dto.correo },
    });

    if (!usuario || !(await bcrypt.compare(dto.contrasena, usuario.contrasena))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (usuario.estado !== EstadoUsuario.ACTIVO) {
      throw new ForbiddenException('La cuenta no está activa');
    }

    const token = this.jwtService.sign({
      sub: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol,
    });

    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol,
        correo: usuario.correo,
        estado: usuario.estado,
      },
    };
  }
}
