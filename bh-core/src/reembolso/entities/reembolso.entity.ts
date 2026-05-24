import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Factura } from '../../factura/entities/factura.entity';

/**
 * Estados posibles de un reembolso.
 *
 * - `PENDIENTE`: El reembolso fue generado al cancelar la cita y está
 *   esperando revisión del administrador.
 * - `APROBADO`: El administrador aprobó el reembolso e indicó el monto
 *   a devolver al cliente.
 * - `RECHAZADO`: El administrador rechazó el reembolso y registró el
 *   motivo correspondiente.
 */
export enum EstadoReembolso {
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
}

/**
 * Entidad que representa la solicitud de reembolso generada al cancelar
 * una cita con factura pagada.
 *
 * El reembolso no se procesa automáticamente: queda en estado `PENDIENTE`
 * hasta que el administrador decida aprobarlo o rechazarlo. Esta decisión
 * queda registrada junto con la fecha de resolución.
 */
@Entity('Reembolso')
export class Reembolso {
  /** Identificador único autogenerado del reembolso. */
  @PrimaryGeneratedColumn()
  idReembolso: number;

  /** Estado actual del reembolso dentro de su ciclo de vida. */
  @Column({ type: 'enum', enum: EstadoReembolso, default: EstadoReembolso.PENDIENTE })
  estado: EstadoReembolso;

  /** Monto aprobado para reembolso. Solo se establece cuando el administrador aprueba. */
  @Column({ nullable: true })
  monto_aprobado: number;

  /** Motivo registrado cuando el administrador rechaza el reembolso. */
  @Column({ type: 'longtext', nullable: true })
  motivo_rechazo: string;

  /** Fecha y hora en que se generó la solicitud de reembolso. */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_solicitud: Date;

  /** Fecha y hora en que el administrador tomó la decisión (aprobación o rechazo). */
  @Column({ type: 'timestamp', nullable: true })
  fecha_resolucion: Date;

  /** Factura asociada a la cita cancelada que originó este reembolso. */
  @ManyToOne(() => Factura)
  @JoinColumn({ name: 'Factura_id' })
  factura: Factura;
}
