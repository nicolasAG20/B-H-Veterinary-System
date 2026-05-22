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
