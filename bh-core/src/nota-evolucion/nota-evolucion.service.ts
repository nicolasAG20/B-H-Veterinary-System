import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotaEvolucion } from './entities/nota-evolucion.entity';
import { Hospitalizacion } from '../hospitalizacion/entities/hospitalizacion.entity';

import { CreateNotaEvolucionDto } from './dto/create-nota-evolucion.dto';
import { UpdateNotaEvolucionDto } from './dto/update-nota-evolucion.dto';

import { IResultadoNotaEvolucion } from './interfaces/nota-evolucion.interface';

/**
 * Servicio de gestión de notas de evolución.
 *
 * Contiene la lógica de negocio relacionada con el registro y consulta
 * de notas de evolución diarias de mascotas hospitalizadas.
 *
 * Al registrar una nota, el sistema valida que la hospitalización exista
 * y que se encuentre activa (sin fecha de salida registrada).
 */
@Injectable()
export class NotaEvolucionService {
  constructor(
    @InjectRepository(NotaEvolucion)
    private readonly notaEvolucionRepository: Repository<NotaEvolucion>,

    @InjectRepository(Hospitalizacion)
    private readonly hospitalizacionRepository: Repository<Hospitalizacion>,
  ) {}

  /**
   * Registra una nota de evolución diaria para una mascota hospitalizada.
   *
   * Flujo:
   * 1. Verifica que la hospitalización exista.
   * 2. Verifica que la hospitalización esté activa (sin fecha de salida).
   * 3. Crea y persiste la nota de evolución.
   *
   * @param hospitalizacionId - Identificador de la hospitalización activa.
   * @param dto - Datos de la nota: texto y fecha.
   * @returns Mensaje de confirmación y la nota creada.
   * @throws NotFoundException si la hospitalización no existe.
   * @throws BadRequestException si la hospitalización ya fue dada de alta.
   */
  async create(
    hospitalizacionId: number,
    dto: CreateNotaEvolucionDto,
  ): Promise<IResultadoNotaEvolucion> {
    const hospitalizacion = await this.findHospitalizacionOrFail(hospitalizacionId);

    this.validarHospitalizacionActiva(hospitalizacion);

    const nota = this.notaEvolucionRepository.create({
      ...dto,
      hospitalizacion: { idHospitalizacion: hospitalizacionId } as any,
    });

    await this.notaEvolucionRepository.save(nota);

    return {
      message: 'Nota de evolución registrada exitosamente',
      nota,
    };
  }

  /**
   * Retorna todas las notas de evolución registradas
   * para una hospitalización específica.
   *
   * @param hospitalizacionId - Identificador de la hospitalización.
   * @returns Listado de notas de evolución.
   * @throws NotFoundException si la hospitalización no existe.
   */
  async findByHospitalizacion(hospitalizacionId: number): Promise<NotaEvolucion[]> {
    await this.findHospitalizacionOrFail(hospitalizacionId);

    return this.notaEvolucionRepository.find({
      where: { hospitalizacion: { idHospitalizacion: hospitalizacionId } },
      relations: ['hospitalizacion'],
      order: { fecha: 'ASC' },
    });
  }

  /**
   * Busca y retorna una nota de evolución por su identificador.
   *
   * @param id - Identificador único de la nota.
   * @returns Nota encontrada con sus relaciones.
   * @throws NotFoundException si la nota no existe.
   */
  async findOne(id: number): Promise<NotaEvolucion> {
    const nota = await this.notaEvolucionRepository.findOne({
      where: { idNota_evolucion: id },
      relations: ['hospitalizacion'],
    });

    if (!nota) {
      throw new NotFoundException(`Nota de evolución #${id} no encontrada`);
    }

    return nota;
  }

  /**
   * Actualiza parcialmente una nota de evolución existente.
   *
   * @param id - Identificador de la nota a actualizar.
   * @param dto - Campos a modificar.
   * @returns Mensaje de confirmación y la nota actualizada.
   * @throws NotFoundException si la nota no existe.
   */
  async update(id: number, dto: UpdateNotaEvolucionDto) {
    await this.findOne(id);

    const updateData: any = Object.fromEntries(
      Object.entries(dto).filter(([, v]) => v !== undefined),
    );

    await this.notaEvolucionRepository.update(id, updateData);

    return {
      message: 'Nota de evolución actualizada',
      nota: await this.findOne(id),
    };
  }

  /**
   * Elimina una nota de evolución por su identificador.
   *
   * @param id - Identificador de la nota a eliminar.
   * @returns Mensaje de confirmación.
   * @throws NotFoundException si la nota no existe.
   */
  async remove(id: number) {
    await this.findOne(id);
    await this.notaEvolucionRepository.delete(id);
    return { message: 'Nota de evolución eliminada correctamente' };
  }

  // ─────────────────────────────────────────────
  // Métodos privados
  // ─────────────────────────────────────────────

  /**
   * Busca y retorna una hospitalización por su ID, o lanza una excepción si no existe.
   *
   * @param hospitalizacionId - Identificador de la hospitalización.
   * @returns Entidad `Hospitalizacion` encontrada.
   * @throws NotFoundException si la hospitalización no existe.
   */
  private async findHospitalizacionOrFail(
    hospitalizacionId: number,
  ): Promise<Hospitalizacion> {
    const hospitalizacion = await this.hospitalizacionRepository.findOne({
      where: { idHospitalizacion: hospitalizacionId },
    });

    if (!hospitalizacion) {
      throw new NotFoundException(
        `Hospitalización #${hospitalizacionId} no encontrada`,
      );
    }

    return hospitalizacion;
  }

  /**
   * Verifica que la hospitalización esté activa, es decir, que no tenga
   * fecha de salida registrada.
   *
   * @param hospitalizacion - Entidad `Hospitalizacion` a validar.
   * @throws BadRequestException si la mascota ya fue dada de alta.
   */
  private validarHospitalizacionActiva(hospitalizacion: Hospitalizacion): void {
    if (hospitalizacion.fecha_salida !== null) {
      throw new BadRequestException(
        'No se puede registrar una nota de evolución: la mascota ya fue dada de alta',
      );
    }
  }
}
