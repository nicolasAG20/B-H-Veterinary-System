import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EstadoUsuario, Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto, RegistroUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async registro(dto: RegistroUsuarioDto) {
    const existe = await this.usuarioRepository.findOne({
      where: { correo: dto.correo },
    });
    if (existe) {
      throw new ConflictException('El correo ya está registrado');
    }

    const contrasenaHasheada = await bcrypt.hash(dto.contrasena, 10);

    const usuario = this.usuarioRepository.create({
      nombre: dto.nombre,
      correo: dto.correo,
      contrasena: contrasenaHasheada,
      rol: dto.rol,
      estado: EstadoUsuario.PENDIENTE_VERIFICACION,
    });

    await this.usuarioRepository.save(usuario);

    return {
      mensaje: 'Usuario registrado exitosamente. Se ha enviado un código de verificación al correo.',
    };
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
