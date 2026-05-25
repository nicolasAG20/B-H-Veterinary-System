package com.bh.audit.dto;

import com.bh.audit.entity.Rol;
import com.bh.audit.entity.TipoAccion;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Datos esperados por el endpoint {@code POST /audit/events} para registrar
 * un nuevo evento de auditoría.
 *
 * <p>Los nombres de los campos se mapean explícitamente a la convención
 * {@code snake_case} usada por bh-core para mantener compatibilidad
 * con el contrato definido en el OpenAPI.</p>
 */
@Getter
@Setter
@NoArgsConstructor
public class RegistrarEventoAuditoriaRequest {

    @NotNull(message = "El tipo de acción es obligatorio")
    @JsonProperty("tipo_accion")
    private TipoAccion tipoAccion;

    @NotNull(message = "El identificador del usuario es obligatorio")
    @JsonProperty("usuarioId")
    private Long usuarioId;

    @NotBlank(message = "El nombre del usuario es obligatorio")
    @JsonProperty("nombre_usuario")
    private String nombreUsuario;

    @NotNull(message = "El rol del usuario es obligatorio")
    @JsonProperty("rol")
    private Rol rol;

    @NotNull(message = "La fecha y hora del evento es obligatoria")
    @JsonProperty("fecha_hora")
    private LocalDateTime fechaHora;
}
