package com.bh.audit.controller;

import com.bh.audit.dto.EventoAuditoriaResponse;
import com.bh.audit.dto.RegistrarEventoAuditoriaRequest;
import com.bh.audit.entity.Rol;
import com.bh.audit.entity.TipoAccion;
import com.bh.audit.service.EventoAuditoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/**
 * Controlador REST que expone las operaciones del servicio de trazabilidad.
 *
 * <p>Todas las rutas viven bajo el prefijo {@code /api/v1/audit} (el segmento
 * {@code /api/v1} viene del {@code server.servlet.context-path} configurado).</p>
 */
@RestController
@RequestMapping("/audit")
@RequiredArgsConstructor
public class EventoAuditoriaController {

    private final EventoAuditoriaService eventoAuditoriaService;

    /**
     * Registra un nuevo evento de auditoría notificado por bh-core.
     *
     * @param request datos del evento a registrar.
     * @return el evento persistido con su identificador asignado.
     */
    @PostMapping("/events")
    public ResponseEntity<EventoAuditoriaResponse> registrar(
            @Valid @RequestBody RegistrarEventoAuditoriaRequest request) {
        EventoAuditoriaResponse response = eventoAuditoriaService.registrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Consulta el historial de eventos aplicando filtros opcionales.
     *
     * @param tipoAccion  tipo de acción.
     * @param usuarioId   identificador del usuario.
     * @param rol         rol del usuario.
     * @param fechaInicio fecha inicial del rango.
     * @param fechaFin    fecha final del rango.
     * @return listado de eventos coincidentes ordenados de más reciente a más antiguo.
     */
    @GetMapping("/events")
    public ResponseEntity<List<EventoAuditoriaResponse>> consultar(
            @RequestParam(name = "tipo_accion", required = false) TipoAccion tipoAccion,
            @RequestParam(name = "usuarioId", required = false) Long usuarioId,
            @RequestParam(name = "rol", required = false) Rol rol,
            @RequestParam(name = "fechaInicio", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(name = "fechaFin", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return ResponseEntity.ok(
                eventoAuditoriaService.consultar(tipoAccion, usuarioId, rol, fechaInicio, fechaFin)
        );
    }
}
