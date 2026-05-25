/**
 * Tipos compartidos por el módulo de auditoría.
 *
 * Define el contrato esperado por el servicio bh-audit y un token de
 * inyección para que los consumidores puedan depender de la abstracción
 * `IAuditClient` en lugar de la implementación concreta.
 */

/**
 * Catálogo de acciones que bh-core puede notificar a bh-audit.
 * Debe mantenerse alineado con `TipoAccion` definido en bh-audit.
 */
export enum TipoAccion {
  REGISTRO_USUARIO = 'REGISTRO_USUARIO',
  VERIFICACION_CORREO = 'VERIFICACION_CORREO',
  APROBACION_CUENTA = 'APROBACION_CUENTA',
  RECHAZO_CUENTA = 'RECHAZO_CUENTA',
  INICIO_SESION_EXITOSO = 'INICIO_SESION_EXITOSO',
  INICIO_SESION_FALLIDO = 'INICIO_SESION_FALLIDO',
  CREACION_CITA = 'CREACION_CITA',
  CAMBIO_ESTADO_CITA = 'CAMBIO_ESTADO_CITA',
  CREACION_HISTORIAL_MEDICO = 'CREACION_HISTORIAL_MEDICO',
  EDICION_HISTORIAL_MEDICO = 'EDICION_HISTORIAL_MEDICO',
  REGISTRO_VACUNA = 'REGISTRO_VACUNA',
  INICIO_HOSPITALIZACION = 'INICIO_HOSPITALIZACION',
  ALTA_HOSPITALIZACION = 'ALTA_HOSPITALIZACION',
  CREACION_FACTURA = 'CREACION_FACTURA',
  ANULACION_FACTURA = 'ANULACION_FACTURA',
  AJUSTE_INVENTARIO = 'AJUSTE_INVENTARIO',
  CREACION_SERVICIO = 'CREACION_SERVICIO',
  EDICION_SERVICIO = 'EDICION_SERVICIO',
  DESACTIVACION_SERVICIO = 'DESACTIVACION_SERVICIO',
  PAGO_CITA = 'PAGO_CITA',
  SUSPENSION_USUARIO = 'SUSPENSION_USUARIO',
}

/**
 * Roles aceptados por bh-audit. Réplica de los roles definidos en bh-core.
 */
export enum RolAuditoria {
  CLIENTE = 'CLIENTE',
  VETERINARIO = 'VETERINARIO',
  RECEPCIONISTA = 'RECEPCIONISTA',
  ADMINISTRADOR = 'ADMINISTRADOR',
}

/**
 * Payload exacto que bh-audit espera recibir en `POST /audit/events`.
 */
export interface IEventoAuditoria {
  tipo_accion: TipoAccion;
  usuarioId: number;
  nombre_usuario: string;
  rol: RolAuditoria;
  fecha_hora: string;
}

/**
 * Filtros opcionales aceptados al consultar el historial de eventos.
 * Cualquier campo ausente o vacío se ignora.
 */
export interface FiltrosConsultaEventos {
  tipo_accion?: TipoAccion;
  usuarioId?: number;
  rol?: RolAuditoria;
  /** Fecha inicial inclusive en formato ISO `YYYY-MM-DD`. */
  fechaInicio?: string;
  /** Fecha final inclusive en formato ISO `YYYY-MM-DD`. */
  fechaFin?: string;
}

/**
 * Forma en que bh-audit retorna cada evento al ser consultado.
 */
export interface EventoAuditoriaConsulta {
  id: number;
  tipo_accion: TipoAccion;
  usuarioId: number;
  nombre_usuario: string;
  rol: RolAuditoria;
  fecha_hora: string;
}

/**
 * Contrato del cliente de auditoría.
 *
 * Permite que los servicios de bh-core dependan de una abstracción y no
 * de la implementación concreta basada en HTTP, facilitando el reemplazo
 * por un mock en pruebas o por un transporte distinto en el futuro.
 */
export interface IAuditClient {
  /**
   * Envía un evento a bh-audit. La promesa nunca rechaza: los errores se
   * registran internamente para no interrumpir la operación de negocio.
   */
  registrar(evento: IEventoAuditoria): Promise<void>;

  /**
   * Consulta el historial de eventos aplicando los filtros indicados.
   * A diferencia de {@link registrar}, esta operación sí propaga las
   * excepciones para que el consumidor (ej. generador de PDF) pueda
   * reaccionar correctamente cuando bh-audit no esté disponible.
   */
  consultarEventos(
    filtros: FiltrosConsultaEventos,
  ): Promise<EventoAuditoriaConsulta[]>;
}

/**
 * Token usado para inyectar la abstracción `IAuditClient` en NestJS,
 * ya que las interfaces de TypeScript no existen en tiempo de ejecución.
 */
export const AUDIT_CLIENT = Symbol('AUDIT_CLIENT');

/**
 * Datos mínimos del usuario autenticado que originó una acción auditable.
 * Se construye en el controller a partir del payload del JWT y se propaga
 * al servicio responsable de la operación.
 */
export interface ActorAuditoria {
  id: number;
  nombre: string;
  rol: RolAuditoria;
}
