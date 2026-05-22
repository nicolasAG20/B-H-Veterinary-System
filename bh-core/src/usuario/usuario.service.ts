import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EstadoUsuario, RolUsuario, Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto, RegistroUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { VerificarCorreoDto } from './dto/verificar-correo.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly mailService: MailService,
  ) {}

  /**
   * Registra un nuevo usuario en el sistema.
   * Hashea la contraseña, genera un código de verificación de 6 dígitos con
   * expiración de 15 minutos, y envía el código al correo indicado.
   * El estado inicial siempre es PENDIENTE_VERIFICACION sin importar el rol.
   * @throws {ConflictException} Si el correo ya está registrado.
   */
  async registro(dto: RegistroUsuarioDto) {
    const existe = await this.usuarioRepository.findOne({
      where: { correo: dto.correo },
    });
    if (existe) {
      throw new ConflictException('El correo ya está registrado');
    }

    const contrasenaHasheada = await bcrypt.hash(dto.contrasena, 10);

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expiracion = new Date();
    expiracion.setMinutes(expiracion.getMinutes() + 15);

    const usuario = this.usuarioRepository.create({
      nombre: dto.nombre,
      correo: dto.correo,
      contrasena: contrasenaHasheada,
      rol: dto.rol,
      estado: EstadoUsuario.PENDIENTE_VERIFICACION,
      codigo_verificacion: codigo,
      tiempo_expiracion: expiracion,
    });

    await this.usuarioRepository.save(usuario);
    await this.mailService.enviarCodigoVerificacion(dto.correo, codigo);

    return {
      mensaje: 'Usuario registrado exitosamente. Se ha enviado un código de verificación al correo.',
    };
  }

  /**
   * Verifica el código enviado al correo del usuario.
   * Si el código es válido y no ha expirado, actualiza el estado según el rol:
   * - CLIENTE → ACTIVO
   * - VETERINARIO / RECEPCIONISTA → PENDIENTE_APROBACION (requiere aprobación del administrador)
   * Limpia código y tiempo de expiración tras una verificación exitosa.
   * @throws {NotFoundException} Si el correo no corresponde a ningún usuario.
   * @throws {BadRequestException} Si el código es incorrecto o ha expirado.
   */
  async verificarCorreo(dto: VerificarCorreoDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { correo: dto.correo },
    });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    if (
      !usuario.codigo_verificacion ||
      usuario.codigo_verificacion !== dto.codigo_verificacion
    ) {
      throw new BadRequestException('Código de verificación inválido');
    }
    if (new Date() > usuario.tiempo_expiracion) {
      throw new BadRequestException('El código de verificación ha expirado');
    }

    const nuevoEstado =
      usuario.rol === RolUsuario.RECEPCIONISTA ||
      usuario.rol === RolUsuario.VETERINARIO
        ? EstadoUsuario.PENDIENTE_APROBACION
        : EstadoUsuario.ACTIVO;

    await this.usuarioRepository.update(usuario.id, {
      estado: nuevoEstado,
      codigo_verificacion: null,
      tiempo_expiracion: null,
    });

    return { mensaje: 'Operación realizada exitosamente.' };
  }

  /**
   * Aprueba la cuenta de un VETERINARIO o RECEPCIONISTA que ya verificó su correo.
   * Solo es posible si el usuario está en estado PENDIENTE_APROBACION.
   * @throws {NotFoundException} Si el usuario no existe.
   * @throws {ConflictException} Si la cuenta no está en estado PENDIENTE_APROBACION.
   */
  async aprobar(id: number) {
    const usuario = await this.findOne(id);
    if (usuario.estado !== EstadoUsuario.PENDIENTE_APROBACION) {
      throw new ConflictException('La cuenta no está en estado PENDIENTE_APROBACION');
    }
    await this.usuarioRepository.update(id, { estado: EstadoUsuario.ACTIVO });
    return { mensaje: 'Operación realizada exitosamente.' };
  }

  /**
   * Rechaza la cuenta de un usuario, impidiendo su acceso al sistema.
   * @throws {NotFoundException} Si el usuario no existe.
   */
  async rechazar(id: number) {
    await this.findOne(id);
    await this.usuarioRepository.update(id, { estado: EstadoUsuario.RECHAZADO });
    return { mensaje: 'Operación realizada exitosamente.' };
  }

  /**
   * Suspende la cuenta de un usuario activo, bloqueando su acceso temporalmente.
   * @throws {NotFoundException} Si el usuario no existe.
   */
  async suspender(id: number) {
    await this.findOne(id);
    await this.usuarioRepository.update(id, { estado: EstadoUsuario.SUSPENDIDO });
    return { mensaje: 'Operación realizada exitosamente.' };
  }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const usuario = this.usuarioRepository.create(createUsuarioDto);
    await this.usuarioRepository.save(usuario);
    return { message: 'Usuario creado correctamente', usuario };
  }

  async findAll() {
    return this.usuarioRepository.find();
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario #${id} no encontrado`);
    }
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    await this.findOne(id);
    const updateData = Object.fromEntries(
      Object.entries(updateUsuarioDto).filter(([, v]) => v !== undefined),
    );
    await this.usuarioRepository.update(id, updateData);
    return { message: 'Usuario actualizado', usuario: await this.findOne(id) };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.usuarioRepository.delete(id);
    return { message: 'Usuario eliminado correctamente' };
  }
}
