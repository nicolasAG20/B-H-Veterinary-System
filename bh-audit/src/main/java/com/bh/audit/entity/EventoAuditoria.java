package com.bh.audit.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Representa un evento de auditoría persistido en la base de datos {@code bh_audit}.
 *
 * <p>Cada instancia corresponde a una acción relevante notificada por bh-core
 * (por ejemplo, la creación de una cita, el inicio de una sesión o la anulación
 * de una factura). La tabla generada por Hibernate es {@code evento_auditoria}.</p>
 */
@Entity
@Table(name = "evento_auditoria")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventoAuditoria {

    /**
     * Identificador único autogenerado del evento.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Tipo de acción que originó el evento.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_accion", nullable = false, length = 50)
    private TipoAccion tipoAccion;

    /**
     * Identificador del usuario que realizó la acción en bh-core.
     */
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    /**
     * Nombre del usuario al momento en que ocurrió el evento.
     */
    @Column(name = "nombre_usuario", nullable = false, length = 150)
    private String nombreUsuario;

    /**
     * Rol del usuario al momento en que ocurrió el evento.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false, length = 20)
    private Rol rol;

    /**
     * Fecha y hora exacta en que ocurrió la acción en bh-core.
     */
    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;
}
