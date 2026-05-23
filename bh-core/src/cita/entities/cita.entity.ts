import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Mascota } from '../../mascota/entities/mascota.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Servicio } from '../../servicio/entities/servicio.entity';
import { HistorialMedico } from '../../historial-medico/entities/historial-medico.entity';
import { Factura } from '../../factura/entities/factura.entity';

/**
 * Estados posibles de una cita veterinaria.
 *
 * - `PENDIENTE_PAGO`: La cita fue registrada pero el pago aún no ha sido confirmado.
 * - `AGENDADA`: El pago fue aprobado y la cita queda confirmada.
 * - `FINALIZADA`: La cita fue atendida por el veterinario.
 * - `CANCELADA`: La cita fue cancelada por el cliente o la recepcionista.
 */
export enum EstadoCita {
  PENDIENTE_PAGO = 'Pendiente_pago',
  AGENDADA = 'Agendada',
  FINALIZADA = 'Finalizada',
  CANCELADA = 'Cancelada',
}

/**
 * Entidad que representa una cita veterinaria en el sistema.
 *
 * Una cita vincula una mascota con un veterinario en una fecha y hora
 * específicas, e incluye los servicios a prestar. El estado de la cita
 * evoluciona desde `PENDIENTE_PAGO` hasta `FINALIZADA` o `CANCELADA`.
 */
@Entity('Cita')
export class Cita {
  /** Identificador único autogenerado de la cita. */
  @PrimaryGeneratedColumn()
  idCita: number;

  /** Fecha y hora programadas para la atención. */
  @Column({ type: 'datetime' })
  fecha_hora: Date;

  /** Estado actual de la cita dentro de su ciclo de vida. */
  @Column({ type: 'enum', enum: EstadoCita })
  estado: EstadoCita;

  /** Precio total calculado a partir de los servicios seleccionados. */
  @Column({ nullable: true })
  precio_total: number;

  /** Motivo registrado cuando la cita es cancelada. */
  @Column({ type: 'longtext', nullable: true })
  motivo_cancelacion: string;

  /** Mascota a la que se le prestará el servicio veterinario. */
  @ManyToOne(() => Mascota, (mascota) => mascota.citas)
  @JoinColumn({ name: 'Mascota_id' })
  mascota: Mascota;

  /** Veterinario asignado para atender la cita. */
  @ManyToOne(() => Usuario, (usuario) => usuario.citas)
  @JoinColumn({ name: 'Usuario_id' })
  usuario: Usuario;

  /** Servicios veterinarios incluidos en la cita. */
  @ManyToMany(() => Servicio, (servicio) => servicio.citas)
  @JoinTable({
    name: 'Cita_servicio',
    joinColumn: {
      name: 'Cita_id',
      referencedColumnName: 'idCita',
    },
    inverseJoinColumn: {
      name: 'Servicio_id',
      referencedColumnName: 'idServicio',
    },
  })
  servicios: Servicio[];

  /** Historiales médicos generados a partir de esta cita. */
  @OneToMany(() => HistorialMedico, (h) => h.cita)
  historiales: HistorialMedico[];

  /** Facturas asociadas a esta cita. */
  @OneToMany(() => Factura, (f) => f.cita)
  facturas: Factura[];
}
