import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  EventoAuditoriaConsulta,
  FiltrosConsultaEventos,
  IAuditClient,
  IEventoAuditoria,
} from './audit.types';

/**
 * Implementación HTTP del cliente de auditoría.
 *
 * Encapsula la comunicación con el microservicio bh-audit a través de un
 * único endpoint (`POST /audit/events`). Toda excepción se captura y se
 * registra en el log para garantizar que un fallo del servicio de
 * trazabilidad no impacte la operación de negocio en bh-core.
 */
@Injectable()
export class HttpAuditClient implements IAuditClient {
  private readonly logger = new Logger(HttpAuditClient.name);
  private readonly endpoint: string;

  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService,
  ) {
    const baseUrl = configService.get<string>(
      'AUDIT_SERVICE_URL',
      'http://localhost:8080/api/v1',
    );
    this.endpoint = `${baseUrl.replace(/\/$/, '')}/audit/events`;
  }

  /**
   * Envía el evento a bh-audit. Cualquier excepción se traga deliberadamente
   * tras registrarla, para no impactar la operación de negocio que originó
   * el evento.
   */
  async registrar(evento: IEventoAuditoria): Promise<void> {
    try {
      await firstValueFrom(this.httpService.post(this.endpoint, evento));
    } catch (error) {
      const detalle = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `No se pudo registrar el evento ${evento.tipo_accion} en bh-audit: ${detalle}`,
      );
    }
  }

  /**
   * Consulta a bh-audit los eventos que cumplen los filtros indicados.
   * Construye los query params únicamente con los filtros presentes y
   * deja propagar cualquier error de red o HTTP al consumidor.
   */
  async consultarEventos(
    filtros: FiltrosConsultaEventos,
  ): Promise<EventoAuditoriaConsulta[]> {
    const params = this.construirParams(filtros);
    const response = await firstValueFrom(
      this.httpService.get<EventoAuditoriaConsulta[]>(this.endpoint, { params }),
    );
    return response.data ?? [];
  }

  /**
   * Convierte los filtros de consulta en un objeto de query params plano,
   * descartando los campos cuyo valor sea `undefined`.
   */
  private construirParams(
    filtros: FiltrosConsultaEventos,
  ): Record<string, string> {
    const params: Record<string, string> = {};
    if (filtros.tipo_accion) params.tipo_accion = filtros.tipo_accion;
    if (filtros.usuarioId !== undefined) {
      params.usuarioId = String(filtros.usuarioId);
    }
    if (filtros.rol) params.rol = filtros.rol;
    if (filtros.fechaInicio) params.fechaInicio = filtros.fechaInicio;
    if (filtros.fechaFin) params.fechaFin = filtros.fechaFin;
    return params;
  }
}
