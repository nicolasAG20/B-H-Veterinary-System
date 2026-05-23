import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Cita } from './entities/cita.entity';
import { Servicio } from '../servicio/entities/servicio.entity';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { EstimateCitaDto } from './dto/estimate-cita.dto';
import {
  DetalleServicio,
  EstimateCitaResponse,
} from './interfaces/estimate-cita.interface';

/**
 * Servicio de gestión de citas veterinarias.
 *
 * Contiene toda la lógica de negocio relacionada con el ciclo de vida
 * de una cita: estimación de costos, creación, consulta, actualización
 * y eliminación. También centraliza la validación de servicios activos.
 */
@Injectable()
export class CitaService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,

    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
  ) {}

  /**
   * Calcula el costo estimado de una cita a partir de los servicios seleccionados,
   * sin confirmar ni persistir ningún dato. Permite al cliente o recepcionista
   * conocer el valor total antes de proceder con el agendamiento.
   *
   * @param dto - DTO con los IDs de los servicios a estimar.
   * @returns Total calculado y detalle de precios por servicio.
   * @throws BadRequestException si algún servicio no existe.
   * @throws ConflictException si algún servicio está inactivo.
   */
  async estimateCost(
    dto: EstimateCitaDto,
  ): Promise<EstimateCitaResponse> {
    const servicios = await this.findServiciosActivosOrFail(dto.servicios);

    const detalles: DetalleServicio[] = servicios.map((servicio) => ({
      servicioId: servicio.idServicio,
      nombre: servicio.nombre,
      precio: servicio.precio,
    }));

    const total = detalles.reduce(
      (acumulado, detalle) => acumulado + detalle.precio,
      0,
    );

    return { total, detalles };
  }

  /**
   * Registra una nueva cita en el sistema.
   *
   * Valida que el veterinario no tenga una cita en el mismo horario,
   * verifica que todos los servicios existan y estén activos, y persiste
   * la cita con sus relaciones.
   *
   * @param createCitaDto - Datos necesarios para crear la cita.
   * @returns Mensaje de confirmación y la cita creada.
   * @throws NotFoundException si el veterinario ya tiene una cita en ese horario.
   * @throws BadRequestException si algún servicio no existe.
   * @throws ConflictException si algún servicio está inactivo.
   */
  async create(createCitaDto: CreateCitaDto) {
    const {
      mascotaId,
      usuarioId,
      veterinarioId,
      servicioIds,
      fecha_hora,
      ...rest
    } = createCitaDto;

    const citaExistente = await this.citaRepository.findOne({
      where: {
        fecha_hora: new Date(fecha_hora),
        usuario: { id: veterinarioId },
      },
      relations: ['usuario'],
    });

    if (citaExistente) {
      throw new NotFoundException(
        'El veterinario ya tiene una cita agendada en este horario',
      );
    }

    const servicios = await this.findServiciosActivosOrFail(servicioIds);

    const cita = this.citaRepository.create({
      ...rest,
      fecha_hora,
      mascota: { idMascota: mascotaId } as any,
      usuario: { id: veterinarioId || usuarioId } as any,
      servicios,
    });

    await this.citaRepository.save(cita);

    return {
      message: 'Cita creada correctamente',
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
   * Solo se modifican los campos enviados en el DTO. Si se incluyen
   * nuevos servicios, se valida que existan y estén activos.
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

    if (mascotaId !== undefined) {
      updateData.mascota = { idMascota: mascotaId };
    }

    if (veterinarioId !== undefined) {
      updateData.usuario = { id: veterinarioId };
    } else if (usuarioId !== undefined) {
      updateData.usuario = { id: usuarioId };
    }

    if (servicioIds !== undefined) {
      cita.servicios = await this.findServiciosActivosOrFail(servicioIds);
    }

    Object.assign(cita, updateData);

    await this.citaRepository.save(cita);

    return {
      message: 'Cita actualizada',
      cita,
    };
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

  /**
   * Valida y retorna los servicios correspondientes a los IDs proporcionados.
   *
   * Verifica que todos los servicios existan en la base de datos y que
   * estén activos. Si alguno no existe o está inactivo, lanza una excepción.
   *
   * @param servicioIds - Lista de IDs de servicios a validar.
   * @returns Arreglo de entidades `Servicio` válidas y activas.
   * @throws BadRequestException si algún ID no corresponde a un servicio existente.
   * @throws ConflictException si algún servicio existe pero está inactivo.
   */
  private async findServiciosActivosOrFail(
    servicioIds?: number[],
  ): Promise<Servicio[]> {
    if (!servicioIds?.length) {
      return [];
    }

    const uniqueServicioIds = [...new Set(servicioIds)];

    const servicios = await this.servicioRepository.findBy({
      idServicio: In(uniqueServicioIds),
    });

    const foundServicioIds = new Set(
      servicios.map((servicio) => servicio.idServicio),
    );

    const missingServicioIds = uniqueServicioIds.filter(
      (id) => !foundServicioIds.has(id),
    );

    if (missingServicioIds.length > 0) {
      throw new BadRequestException(
        `Servicios no encontrados: ${missingServicioIds.join(', ')}`,
      );
    }

    const inactiveServicios = servicios.filter(
      (servicio) => !servicio.activo,
    );

    if (inactiveServicios.length > 0) {
      const inactiveIds = inactiveServicios.map(
        (servicio) => servicio.idServicio,
      );

      throw new ConflictException(
        `Servicios desactivados: ${inactiveIds.join(', ')}`,
      );
    }

    return servicios;
  }
}
