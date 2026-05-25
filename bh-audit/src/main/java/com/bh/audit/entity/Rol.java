package com.bh.audit.entity;

/**
 * Roles posibles que puede tener el usuario que originó un evento de auditoría.
 *
 * <p>Estos roles son una réplica de los definidos en bh-core y permiten filtrar
 * el historial por el tipo de actor que realizó la acción.</p>
 */
public enum Rol {
    CLIENTE,
    VETERINARIO,
    RECEPCIONISTA,
    ADMINISTRADOR
}
