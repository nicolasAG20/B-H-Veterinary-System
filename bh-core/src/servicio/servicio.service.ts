import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Servicio } from './entities/servicio.entity';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import {
  ActorAuditoria,
  AUDIT_CLIENT,
  IAuditClient,
  TipoAccion,
} from '../audit/audit.types';

@Injectable()
export class ServicioService {
  constructor(
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
    @Inject(AUDIT_CLIENT)
    private readonly auditClient: IAuditClient,
  ) {}

  async create(createServicioDto: CreateServicioDto, actor: ActorAuditoria) {
    const servicio = this.servicioRepository.create({
      ...createServicioDto,
      activo: true,
    });
    const guardado = await this.servicioRepository.save(servicio);
    await this.registrarEvento(TipoAccion.CREACION_SERVICIO, actor);
    return guardado;
  }

  async findAll(activo?: boolean) {
    const where: FindOptionsWhere<Servicio> | undefined =
      activo === undefined ? undefined : { activo };

    return this.servicioRepository.find({ where });
  }

  async findOne(id: number) {
    const servicio = await this.servicioRepository.findOneBy({ idServicio: id });
    if (!servicio) {
      throw new NotFoundException(`Servicio #${id} no encontrado`);
    }
    return servicio;
  }

  async update(
    id: number,
    updateServicioDto: UpdateServicioDto,
    actor: ActorAuditoria,
  ) {
    const servicio = await this.findOne(id);
    Object.assign(servicio, updateServicioDto);
    const actualizado = await this.servicioRepository.save(servicio);
    await this.registrarEvento(TipoAccion.EDICION_SERVICIO, actor);
    return actualizado;
  }

  async deactivate(id: number, actor: ActorAuditoria) {
    const servicio = await this.findOne(id);

    if (!servicio.activo) {
      throw new ConflictException('El servicio ya se encuentra desactivado');
    }

    servicio.activo = false;
    await this.servicioRepository.save(servicio);

    await this.registrarEvento(TipoAccion.DESACTIVACION_SERVICIO, actor);

    return { mensaje: 'Servicio desactivado exitosamente' };
  }

  /**
   * Notifica a bh-audit un evento del catálogo de servicios,
   * identificando como actor al administrador que originó la operación.
   */
  private async registrarEvento(
    tipoAccion: TipoAccion,
    actor: ActorAuditoria,
  ): Promise<void> {
    await this.auditClient.registrar({
      tipo_accion: tipoAccion,
      usuarioId: actor.id,
      nombre_usuario: actor.nombre,
      rol: actor.rol,
      fecha_hora: new Date().toISOString(),
    });
  }
}
