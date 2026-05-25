package com.bh.audit.service;

import com.bh.audit.dto.EventoAuditoriaResponse;
import com.bh.audit.dto.RegistrarEventoAuditoriaRequest;
import com.bh.audit.entity.Rol;
import com.bh.audit.entity.TipoAccion;

import java.time.LocalDate;
import java.util.List;

/**
 * Contrato del servicio encargado de la trazabilidad de acciones del sistema.
 *
 * <p>Define las operaciones expuestas hacia el controlador, permitiendo
 * desacoplar la lógica de negocio de su implementación concreta y
 * facilitando el reemplazo o mockeo del servicio en pruebas.</p>
 */
public interface EventoAuditoriaService {

    /**
     * Persiste un nuevo evento de auditoría notificado por bh-core.
     *
     * @param request datos del evento a registrar.
     * @return el evento ya persistido, listo para ser devuelto al cliente.
     */
    EventoAuditoriaResponse registrar(RegistrarEventoAuditoriaRequest request);

    /**
     * Consulta el historial de eventos aplicando filtros opcionales.
     *
     * <p>Cualquiera de los parámetros puede ser {@code null}; los valores nulos
     * se ignoran y no restringen la consulta.</p>
     *
     * @param tipoAccion  tipo de acción a filtrar.
     * @param usuarioId   identificador del usuario.
     * @param rol         rol del usuario.
     * @param fechaInicio fecha inicial del rango (inclusive).
     * @param fechaFin    fecha final del rango (inclusive).
     * @return listado de eventos que cumplen los filtros, ordenado por fecha descendente.
     */
    List<EventoAuditoriaResponse> consultar(TipoAccion tipoAccion,
                                            Long usuarioId,
                                            Rol rol,
                                            LocalDate fechaInicio,
                                            LocalDate fechaFin);
}
