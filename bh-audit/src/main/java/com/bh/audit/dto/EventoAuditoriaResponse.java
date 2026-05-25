package com.bh.audit.dto;

import com.bh.audit.entity.EventoAuditoria;
import com.bh.audit.entity.Rol;
import com.bh.audit.entity.TipoAccion;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * Representación de salida de un evento de auditoría.
 *
 * <p>Se utiliza tanto en la respuesta del registro de un nuevo evento
 * como en las consultas de historial.</p>
 */
@Getter
@Builder
@AllArgsConstructor
public class EventoAuditoriaResponse {

    private final Long id;

    @JsonProperty("tipo_accion")
    private final TipoAccion tipoAccion;

    @JsonProperty("usuarioId")
    private final Long usuarioId;

    @JsonProperty("nombre_usuario")
    private final String nombreUsuario;

    @JsonProperty("rol")
    private final Rol rol;

    @JsonProperty("fecha_hora")
    private final LocalDateTime fechaHora;

    /**
     * Construye un {@link EventoAuditoriaResponse} a partir de una entidad persistida.
     *
     * @param evento entidad obtenida del repositorio.
     * @return DTO listo para ser serializado como respuesta HTTP.
     */
    public static EventoAuditoriaResponse fromEntity(EventoAuditoria evento) {
        return EventoAuditoriaResponse.builder()
                .id(evento.getId())
                .tipoAccion(evento.getTipoAccion())
                .usuarioId(evento.getUsuarioId())
                .nombreUsuario(evento.getNombreUsuario())
                .rol(evento.getRol())
                .fechaHora(evento.getFechaHora())
                .build();
    }
}
