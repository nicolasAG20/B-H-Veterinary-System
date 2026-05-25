package com.bh.audit.repository;

import com.bh.audit.entity.EventoAuditoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * Repositorio JPA para la entidad {@link EventoAuditoria}.
 *
 * <p>Extiende {@link JpaSpecificationExecutor} para permitir construir
 * consultas dinámicas según los filtros recibidos por el endpoint de
 * historial sin tener que multiplicar métodos derivados.</p>
 */
@Repository
public interface EventoAuditoriaRepository
        extends JpaRepository<EventoAuditoria, Long>,
                JpaSpecificationExecutor<EventoAuditoria> {
}
