import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EstadoUsuario, Usuario } from '../usuario/entities/usuario.entity';
import { LoginDto } from './dto/login.dto';
import {
  AUDIT_CLIENT,
  IAuditClient,
  RolAuditoria,
  TipoAccion,
} from '../audit/audit.types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
    @Inject(AUDIT_CLIENT)
    private readonly auditClient: IAuditClient,
  ) {}

  /**
   * Autentica un usuario y retorna un JWT firmado.
   * Verifica la contraseña con bcrypt y comprueba que la cuenta esté en estado ACTIVO.
   * El payload del token incluye: sub (id), correo, rol y nombre.
   * Registra en bh-audit tanto los intentos exitosos como los fallidos.
   * @throws {UnauthorizedException} Si el correo no existe o la contraseña es incorrecta.
   * @throws {ForbiddenException} Si la cuenta no está en estado ACTIVO
   *   (puede estar pendiente de verificación, pendiente de aprobación, rechazada o suspendida).
   */
  async login(dto: LoginDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { correo: dto.correo },
    });

    if (!usuario || !(await bcrypt.compare(dto.contrasena, usuario.contrasena))) {
      await this.auditarIntentoFallido(usuario);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (usuario.estado !== EstadoUsuario.ACTIVO) {
      await this.auditarIntentoFallido(usuario);
      throw new ForbiddenException('La cuenta no está activa');
    }

    const token = this.jwtService.sign({
      sub: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol,
      nombre: usuario.nombre,
    });

    await this.auditClient.registrar({
      tipo_accion: TipoAccion.INICIO_SESION_EXITOSO,
      usuarioId: usuario.id,
      nombre_usuario: usuario.nombre,
      rol: usuario.rol as unknown as RolAuditoria,
      fecha_hora: new Date().toISOString(),
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

  /**
   * Registra un intento fallido de inicio de sesión en bh-audit.
   * Si el correo no corresponde a ningún usuario, se registra con id 0
   * y nombre genérico para no perder la trazabilidad del intento.
   */
  private async auditarIntentoFallido(usuario: Usuario | null): Promise<void> {
    await this.auditClient.registrar({
      tipo_accion: TipoAccion.INICIO_SESION_FALLIDO,
      usuarioId: usuario?.id ?? 0,
      nombre_usuario: usuario?.nombre ?? 'desconocido',
      rol: (usuario?.rol as unknown as RolAuditoria) ?? RolAuditoria.CLIENTE,
      fecha_hora: new Date().toISOString(),
    });
  }
}
