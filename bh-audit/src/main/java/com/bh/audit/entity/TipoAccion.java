package com.bh.audit.entity;

/**
 * Enumera los tipos de acción que pueden ser registrados como eventos
 * de auditoría dentro del sistema veterinario Breaze and Harold.
 *
 * <p>Cada valor corresponde a una operación de negocio relevante que
 * ocurre en el servicio principal {@code bh-core} y que debe quedar
 * registrada de forma persistente en bh-audit.</p>
 */
public enum TipoAccion {
    REGISTRO_USUARIO,
    VERIFICACION_CORREO,
    APROBACION_CUENTA,
    RECHAZO_CUENTA,
    INICIO_SESION_EXITOSO,
    INICIO_SESION_FALLIDO,
    CREACION_CITA,
    CAMBIO_ESTADO_CITA,
    CREACION_HISTORIAL_MEDICO,
    EDICION_HISTORIAL_MEDICO,
    REGISTRO_VACUNA,
    INICIO_HOSPITALIZACION,
    ALTA_HOSPITALIZACION,
    CREACION_FACTURA,
    ANULACION_FACTURA,
    AJUSTE_INVENTARIO,
    CREACION_SERVICIO,
    EDICION_SERVICIO,
    DESACTIVACION_SERVICIO,
    PAGO_CITA,
    SUSPENSION_USUARIO
}
