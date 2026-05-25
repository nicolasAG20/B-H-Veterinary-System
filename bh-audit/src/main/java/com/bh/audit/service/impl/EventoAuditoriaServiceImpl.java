package com.bh.audit.service.impl;

import com.bh.audit.dto.EventoAuditoriaResponse;
import com.bh.audit.dto.RegistrarEventoAuditoriaRequest;
import com.bh.audit.entity.EventoAuditoria;
import com.bh.audit.entity.Rol;
import com.bh.audit.entity.TipoAccion;
import com.bh.audit.repository.EventoAuditoriaRepository;
import com.bh.audit.service.EventoAuditoriaService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Implementación de {@link EventoAuditoriaService} basada en JPA.
 *
 * <p>Persiste cada evento recibido sin transformaciones adicionales y
 * construye una especificación dinámica para soportar la combinación
 * arbitraria de filtros expuesta por el endpoint de historial.</p>
 */
@Service
@RequiredArgsConstructor
public class EventoAuditoriaServiceImpl implements EventoAuditoriaService {

    private final EventoAuditoriaRepository eventoAuditoriaRepository;

    /**
     * {@inheritDoc}
     */
    @Override
    public EventoAuditoriaResponse registrar(RegistrarEventoAuditoriaRequest request) {
        EventoAuditoria evento = EventoAuditoria.builder()
                .tipoAccion(request.getTipoAccion())
                .usuarioId(request.getUsuarioId())
                .nombreUsuario(request.getNombreUsuario())
                .rol(request.getRol())
                .fechaHora(request.getFechaHora())
                .build();

        EventoAuditoria guardado = eventoAuditoriaRepository.save(evento);
        return EventoAuditoriaResponse.fromEntity(guardado);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<EventoAuditoriaResponse> consultar(TipoAccion tipoAccion,
                                                   Long usuarioId,
                                                   Rol rol,
                                                   LocalDate fechaInicio,
                                                   LocalDate fechaFin) {
        Specification<EventoAuditoria> spec = construirEspecificacion(
                tipoAccion, usuarioId, rol, fechaInicio, fechaFin
        );
        Sort orden = Sort.by(Sort.Direction.DESC, "fechaHora");
        return eventoAuditoriaRepository.findAll(spec, orden).stream()
                .map(EventoAuditoriaResponse::fromEntity)
                .toList();
    }

    /**
     * Construye una {@link Specification} dinámica añadiendo únicamente las
     * condiciones cuyos parámetros estén presentes.
     *
     * @return especificación lista para ser pasada al repositorio.
     */
    private Specification<EventoAuditoria> construirEspecificacion(TipoAccion tipoAccion,
                                                                   Long usuarioId,
                                                                   Rol rol,
                                                                   LocalDate fechaInicio,
                                                                   LocalDate fechaFin) {
        return (root, query, cb) -> {
            List<Predicate> predicados = new ArrayList<>();

            if (tipoAccion != null) {
                predicados.add(cb.equal(root.get("tipoAccion"), tipoAccion));
            }
            if (usuarioId != null) {
                predicados.add(cb.equal(root.get("usuarioId"), usuarioId));
            }
            if (rol != null) {
                predicados.add(cb.equal(root.get("rol"), rol));
            }
            if (fechaInicio != null) {
                LocalDateTime inicio = fechaInicio.atStartOfDay();
                predicados.add(cb.greaterThanOrEqualTo(root.get("fechaHora"), inicio));
            }
            if (fechaFin != null) {
                LocalDateTime fin = fechaFin.atTime(LocalTime.MAX);
                predicados.add(cb.lessThanOrEqualTo(root.get("fechaHora"), fin));
            }

            return cb.and(predicados.toArray(new Predicate[0]));
        };
    }
}
