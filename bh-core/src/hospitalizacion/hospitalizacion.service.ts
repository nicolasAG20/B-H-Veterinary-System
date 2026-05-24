import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Hospitalizacion } from './entities/hospitalizacion.entity';
import { Mascota, EstadoMascota } from '../mascota/entities/mascota.entity';

import { CreateHospitalizacionDto } from './dto/create-hospitalizacion.dto';
import { UpdateHospitalizacionDto } from './dto/update-hospitalizacion.dto';

import { IResultadoInternacion } from './interfaces/hospitalizacion.interface';

/**
 * Servicio de gestión de hospitalizaciones veterinarias.
 *
 * Contiene toda la lógica de negocio relacionada con el ciclo de vida
 * de una hospitalización: internación, consulta, actualización y eliminación.
 *
 * Al internar una mascota, el sistema valida que exista y que no esté
 * ya hospitalizada, y actualiza su estado automáticamente.
 */
@Injectable()
export class HospitalizacionService {
  constructor(
    @InjectRepository(Hospitalizacion)
    private readonly hospitalizacionRepository: Repository<Hospitalizacion>,

    @InjectRepository(Mascota)
    private readonly mascotaRepository: Repository<Mascota>,
  ) {}

  /**
   * Registra la internación de una mascota en la clínica.
   *
   * Flujo:
   * 1. Verifica que la mascota exista en el sistema.
   * 2. Verifica que la mascota no esté ya hospitalizada.
   * 3. Crea el registro de hospitalización.
   * 4. Actualiza el estado de la mascota a `HOSPITALIZADA`.
   *
   * @param dto - Datos de la internación: motivo, fecha de ingreso, IDs de mascota y veterinario.
   * @returns Mensaje de confirmación y el registro de hospitalización creado.
   * @throws NotFoundException si la mascota no existe.
   * @throws ConflictException si la mascota ya se encuentra hospitalizada.
   */
  async create(dto: CreateHospitalizacionDto): Promise<IResultadoInternacion> {
    const { mascotaId, veterinarioId, ...rest } = dto;

    const mascota = await this.findMascotaOrFail(mascotaId);

    this.validarMascotaNoHospitalizada(mascota);

    const hospitalizacion = this.hospitalizacionRepository.create({
      ...rest,
      mascota: { idMascota: mascotaId } as any,
      usuario: { id: veterinarioId } as any,
    });

    await this.hospitalizacionRepository.save(hospitalizacion);
    await this.actualizarEstadoMascota(mascotaId, EstadoMascota.HOSPITALIZADA);

    return {
      message: 'Mascota internada exitosamente',
      hospitalizacion,
    };
  }

  /**
   * Retorna todas las hospitalizaciones registradas en el sistema,
   * incluyendo sus relaciones con mascota, veterinario y notas de evolución.
   *
   * @returns Listado completo de hospitalizaciones.
   */
  async findAll(): Promise<Hospitalizacion[]> {
    return this.hospitalizacionRepository.find({
      relations: ['usuario', 'mascota', 'notasEvolucion'],
    });
  }

  /**
   * Busca y retorna una hospitalización por su identificador.
   *
   * @param id - Identificador único de la hospitalización.
   * @returns Hospitalización encontrada con sus relaciones.
   * @throws NotFoundException si la hospitalización no existe.
   */
  async findOne(id: number): Promise<Hospitalizacion> {
    const hospitalizacion = await this.hospitalizacionRepository.findOne({
      where: { idHospitalizacion: id },
      relations: ['usuario', 'mascota', 'notasEvolucion'],
    });

    if (!hospitalizacion) {
      throw new NotFoundException(`Hospitalización #${id} no encontrada`);
    }

    return hospitalizacion;
  }

  /**
   * Actualiza parcialmente los datos de una hospitalización existente.
   *
   * @param id - Identificador de la hospitalización a actualizar.
   * @param dto - Campos a modificar.
   * @returns Mensaje de confirmación y la hospitalización actualizada.
   * @throws NotFoundException si la hospitalización no existe.
   */
  async update(id: number, dto: UpdateHospitalizacionDto) {
    await this.findOne(id);

    const { mascotaId, veterinarioId, ...rest } = dto as any;

    const updateData: any = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== undefined),
    );

    if (mascotaId !== undefined) updateData.mascota = { idMascota: mascotaId };
    if (veterinarioId !== undefined) updateData.usuario = { id: veterinarioId };

    await this.hospitalizacionRepository.update(id, updateData);

    return {
      message: 'Hospitalización actualizada',
      hospitalizacion: await this.findOne(id),
    };
  }

  /**
   * Elimina una hospitalización del sistema por su identificador.
   *
   * @param id - Identificador de la hospitalización a eliminar.
   * @returns Mensaje de confirmación.
   * @throws NotFoundException si la hospitalización no existe.
   */
  async remove(id: number) {
    await this.findOne(id);
    await this.hospitalizacionRepository.delete(id);
    return { message: 'Hospitalización eliminada correctamente' };
  }

  // ─────────────────────────────────────────────
  // Métodos privados
  // ─────────────────────────────────────────────

  /**
   * Busca y retorna una mascota por su ID, o lanza una excepción si no existe.
   *
   * @param mascotaId - Identificador de la mascota.
   * @returns Entidad `Mascota` encontrada.
   * @throws NotFoundException si la mascota no está registrada en el sistema.
   */
  private async findMascotaOrFail(mascotaId: number): Promise<Mascota> {
    const mascota = await this.mascotaRepository.findOne({
      where: { idMascota: mascotaId },
    });

    if (!mascota) {
      throw new NotFoundException(
        `La mascota #${mascotaId} no está registrada en el sistema`,
      );
    }

    return mascota;
  }

  /**
   * Verifica que la mascota no esté actualmente hospitalizada.
   *
   * @param mascota - Entidad `Mascota` a validar.
   * @throws ConflictException si la mascota ya se encuentra hospitalizada.
   */
  private validarMascotaNoHospitalizada(mascota: Mascota): void {
    if (mascota.estado === EstadoMascota.HOSPITALIZADA) {
      throw new ConflictException(
        `La mascota "${mascota.nombre}" ya se encuentra hospitalizada`,
      );
    }
  }

  /**
   * Actualiza el estado de una mascota en la base de datos.
   *
   * @param mascotaId - Identificador de la mascota.
   * @param estado - Nuevo estado a asignar.
   */
  private async actualizarEstadoMascota(
    mascotaId: number,
    estado: EstadoMascota,
  ): Promise<void> {
    await this.mascotaRepository.update(mascotaId, { estado });
  }
}
