import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Cita, EstadoCita } from './entities/cita.entity';
import { Servicio } from '../servicio/entities/servicio.entity';
import { Factura, EstadoFactura } from '../factura/entities/factura.entity';

import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';

import { IResultadoVerificacionPago } from './interfaces/pago.interface';

/**
 * Servicio de gestión de citas veterinarias.
 *
 * Contiene toda la lógica de negocio relacionada con el ciclo de vida
 * de una cita: verificación de pago, creación, consulta, actualización
 * y eliminación. También centraliza la validación de servicios activos.
 */
@Injectable()
export class CitaService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,

    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,

    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,
  ) {}

  /**
   * Registra una nueva cita en el sistema y confirma el agendamiento
   * únicamente si el pago recibido cubre el total de los servicios seleccionados.
   *
   * Flujo:
   * 1. Verifica que el veterinario no tenga conflicto de horario.
   * 2. Obtiene y valida los servicios seleccionados.
   * 3. Calcula el total y verifica que el monto pagado sea suficiente.
   * 4. Persiste la cita con estado `AGENDADA` y crea la factura con estado `PAGADA`.
   *
   * @param createCitaDto - Datos de la cita incluyendo servicios y pago.
   * @returns Mensaje de confirmación y la cita creada.
   * @throws ConflictException si el veterinario ya tiene una cita en ese horario.
   * @throws BadRequestException si algún servicio no existe o el pago es insuficiente.
   * @throws ConflictException si algún servicio está inactivo.
   */
  async create(createCitaDto: CreateCitaDto) {
    const {
      mascotaId,
      usuarioId,
      veterinarioId,
      servicioIds,
      fecha_hora,
      pago,
      ...rest
    } = createCitaDto;

    await this.validarDisponibilidadVeterinario(veterinarioId, fecha_hora);

    const servicios = await this.findServiciosActivosOrFail(servicioIds);

    const total = servicios.reduce((acc, s) => acc + s.precio, 0);

    this.verificarPagoOrFail({
      aprobado: pago.monto >= total,
      totalRequerido: total,
      montoRecibido: pago.monto,
    });

    const cita = this.citaRepository.create({
      ...rest,
      fecha_hora,
      estado: EstadoCita.AGENDADA,
      precio_total: total,
      mascota: { idMascota: mascotaId } as any,
      usuario: { id: veterinarioId || usuarioId } as any,
      servicios,
    });

    await this.citaRepository.save(cita);

    await this.facturaRepository.save(
      this.facturaRepository.create({
        total,
        subtotal: total,
        descuento: 0,
        monto_pagado: pago.monto,
        estado: EstadoFactura.PAGADA,
        cita: { idCita: cita.idCita } as any,
      }),
    );

    return {
      message: 'Cita agendada y pago confirmado exitosamente',
      cita,
    };
  }

  /**
   * Retorna todas las citas registradas en el sistema,
   * incluyendo sus relaciones con mascota, usuario y servicios.
   *
   * @returns Listado completo de citas.
   */
  async findAll() {
    return this.citaRepository.find({
      relations: ['mascota', 'usuario', 'servicios'],
    });
  }

  /**
   * Busca y retorna una cita por su identificador.
   *
   * @param id - Identificador único de la cita.
   * @returns Cita encontrada con sus relaciones.
   * @throws NotFoundException si la cita no existe.
   */
  async findOne(id: number) {
    const cita = await this.citaRepository.findOne({
      where: { idCita: id },
      relations: ['mascota', 'usuario', 'servicios'],
    });

    if (!cita) {
      throw new NotFoundException(`Cita #${id} no encontrada`);
    }

    return cita;
  }

  /**
   * Actualiza parcialmente los datos de una cita existente.
   *
   * @param id - Identificador de la cita a actualizar.
   * @param updateCitaDto - Campos a modificar.
   * @returns Mensaje de confirmación y la cita actualizada.
   * @throws NotFoundException si la cita no existe.
   * @throws BadRequestException si algún servicio no existe.
   * @throws ConflictException si algún servicio está inactivo.
   */
  async update(id: number, updateCitaDto: UpdateCitaDto) {
    const cita = await this.findOne(id);

    const {
      mascotaId,
      usuarioId,
      veterinarioId,
      servicioIds,
      ...rest
    } = updateCitaDto as any;

    const updateData: any = Object.fromEntries(
      Object.entries(rest).filter(([, value]) => value !== undefined),
    );

    if (mascotaId !== undefined) updateData.mascota = { idMascota: mascotaId };
    if (veterinarioId !== undefined) updateData.usuario = { id: veterinarioId };
    else if (usuarioId !== undefined) updateData.usuario = { id: usuarioId };

    if (servicioIds !== undefined) {
      cita.servicios = await this.findServiciosActivosOrFail(servicioIds);
    }

    Object.assign(cita, updateData);
    await this.citaRepository.save(cita);

    return { message: 'Cita actualizada', cita };
  }

  /**
   * Elimina una cita del sistema por su identificador.
   *
   * @param id - Identificador de la cita a eliminar.
   * @returns Mensaje de confirmación.
   * @throws NotFoundException si la cita no existe.
   */
  async remove(id: number) {
    await this.findOne(id);
    await this.citaRepository.delete(id);
    return { message: 'Cita eliminada correctamente' };
  }

  // ─────────────────────────────────────────────
  // Métodos privados
  // ─────────────────────────────────────────────

  /**
   * Verifica que el veterinario no tenga otra cita en el mismo horario.
   *
   * @param veterinarioId - Identificador del veterinario.
   * @param fecha_hora - Fecha y hora de la nueva cita.
   * @throws ConflictException si ya existe una cita en ese horario.
   */
  private async validarDisponibilidadVeterinario(
    veterinarioId: number,
    fecha_hora: string,
  ): Promise<void> {
    const citaExistente = await this.citaRepository.findOne({
      where: {
        fecha_hora: new Date(fecha_hora),
        usuario: { id: veterinarioId },
      },
      relations: ['usuario'],
    });

    if (citaExistente) {
      throw new ConflictException(
        'El veterinario ya tiene una cita agendada en este horario',
      );
    }
  }

  /**
   * Verifica que el monto recibido cubra el total requerido.
   * Si el pago es insuficiente, lanza una excepción con el detalle del faltante.
   *
   * @param resultado - Resultado de la comparación entre monto recibido y total requerido.
   * @throws BadRequestException si el monto recibido es menor al total requerido.
   */
  private verificarPagoOrFail(resultado: IResultadoVerificacionPago): void {
    if (!resultado.aprobado) {
      const faltante = resultado.totalRequerido - resultado.montoRecibido;
      throw new BadRequestException(
        `Pago insuficiente. Total requerido: $${resultado.totalRequerido.toLocaleString('es-CO')}. ` +
        `Monto recibido: $${resultado.montoRecibido.toLocaleString('es-CO')}. ` +
        `Faltante: $${faltante.toLocaleString('es-CO')}.`,
      );
    }
  }

  /**
   * Valida y retorna los servicios correspondientes a los IDs proporcionados.
   *
   * @param servicioIds - Lista de IDs de servicios a validar.
   * @returns Arreglo de entidades `Servicio` válidas y activas.
   * @throws BadRequestException si algún ID no corresponde a un servicio existente.
   * @throws ConflictException si algún servicio está inactivo.
   */
  private async findServiciosActivosOrFail(
    servicioIds?: number[],
  ): Promise<Servicio[]> {
    if (!servicioIds?.length) return [];

    const uniqueServicioIds = [...new Set(servicioIds)];

    const servicios = await this.servicioRepository.findBy({
      idServicio: In(uniqueServicioIds),
    });

    const foundIds = new Set(servicios.map((s) => s.idServicio));
    const missingIds = uniqueServicioIds.filter((id) => !foundIds.has(id));

    if (missingIds.length > 0) {
      throw new BadRequestException(
        `Servicios no encontrados: ${missingIds.join(', ')}`,
      );
    }

    const inactivos = servicios.filter((s) => !s.activo);
    if (inactivos.length > 0) {
      throw new ConflictException(
        `Servicios desactivados: ${inactivos.map((s) => s.idServicio).join(', ')}`,
      );
    }

    return servicios;
  }
}
