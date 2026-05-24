import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Reembolso, EstadoReembolso } from './entities/reembolso.entity';
import { AprobarReembolsoDto } from './dto/aprobar-reembolso.dto';
import { RechazarReembolsoDto } from './dto/rechazar-reembolso.dto';

/**
 * Servicio de gestión de reembolsos.
 *
 * Un reembolso se crea automáticamente en estado `PENDIENTE` cada vez que
 * se cancela una cita con factura pagada. El administrador es quien decide
 * si aprueba o rechaza el reembolso — el sistema nunca lo procesa de forma
 * automática.
 */
@Injectable()
export class ReembolsoService {
  constructor(
    @InjectRepository(Reembolso)
    private readonly reembolsoRepository: Repository<Reembolso>,
  ) {}

  /**
   * Retorna todos los reembolsos registrados en el sistema,
   * incluyendo la factura y la cita asociada.
   *
   * @returns Listado completo de reembolsos.
   */
  async findAll() {
    return this.reembolsoRepository.find({
      relations: ['factura', 'factura.cita'],
    });
  }

  /**
   * Busca y retorna un reembolso por su identificador.
   *
   * @param id - Identificador único del reembolso.
   * @returns Reembolso encontrado con su factura y cita relacionadas.
   * @throws NotFoundException si el reembolso no existe.
   */
  async findOne(id: number) {
    const reembolso = await this.reembolsoRepository.findOne({
      where: { idReembolso: id },
      relations: ['factura', 'factura.cita'],
    });
    if (!reembolso) {
      throw new NotFoundException(`Reembolso #${id} no encontrado`);
    }
    return reembolso;
  }

  /**
   * Aprueba un reembolso pendiente y registra el monto a devolver al cliente.
   *
   * El monto puede ser igual o menor al total pagado originalmente en la factura,
   * quedando a criterio del administrador.
   *
   * @param id - Identificador del reembolso a aprobar.
   * @param dto - DTO con el monto aprobado para el reembolso.
   * @returns Mensaje de confirmación y el reembolso actualizado.
   * @throws NotFoundException si el reembolso no existe.
   * @throws BadRequestException si el reembolso ya fue procesado previamente.
   */
  async aprobar(id: number, dto: AprobarReembolsoDto) {
    const reembolso = await this.findOne(id);

    if (reembolso.estado !== EstadoReembolso.PENDIENTE) {
      throw new BadRequestException(
        `El reembolso ya fue procesado con estado: ${reembolso.estado}`,
      );
    }

    reembolso.estado = EstadoReembolso.APROBADO;
    reembolso.monto_aprobado = dto.monto_aprobado;
    reembolso.fecha_resolucion = new Date();

    await this.reembolsoRepository.save(reembolso);

    return {
      message: 'Reembolso aprobado correctamente',
      reembolso,
    };
  }

  /**
   * Rechaza un reembolso pendiente y registra el motivo del rechazo.
   *
   * @param id - Identificador del reembolso a rechazar.
   * @param dto - DTO con el motivo del rechazo.
   * @returns Mensaje de confirmación y el reembolso actualizado.
   * @throws NotFoundException si el reembolso no existe.
   * @throws BadRequestException si el reembolso ya fue procesado previamente.
   */
  async rechazar(id: number, dto: RechazarReembolsoDto) {
    const reembolso = await this.findOne(id);

    if (reembolso.estado !== EstadoReembolso.PENDIENTE) {
      throw new BadRequestException(
        `El reembolso ya fue procesado con estado: ${reembolso.estado}`,
      );
    }

    reembolso.estado = EstadoReembolso.RECHAZADO;
    reembolso.motivo_rechazo = dto.motivo_rechazo;
    reembolso.fecha_resolucion = new Date();

    await this.reembolsoRepository.save(reembolso);

    return {
      message: 'Reembolso rechazado correctamente',
      reembolso,
    };
  }
}
