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

export enum EstadoCita {
  PENDIENTE_PAGO = 'Pendiente_pago',
  AGENDADA = 'Agendada',
  FINALIZADA = 'Finalizada',
  CANCELADA = 'Cancelada',
}

@Entity('Cita')
export class Cita {
  @PrimaryGeneratedColumn()
  idCita: number;

  @Column({ type: 'datetime' })
  fecha_hora: Date;

  @Column({ type: 'enum', enum: EstadoCita })
  estado: EstadoCita;

  @Column({ nullable: true })
  precio_total: number;

  @Column({ type: 'longtext', nullable: true })
  motivo_cancelacion: string;

  @ManyToOne(() => Mascota, (mascota) => mascota.citas)
  @JoinColumn({ name: 'Mascota_id' })
  mascota: Mascota;

  @ManyToOne(() => Usuario, (usuario) => usuario.citas)
  @JoinColumn({ name: 'Usuario_id' })
  usuario: Usuario;

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

  @OneToMany(() => HistorialMedico, (h) => h.cita)
  historiales: HistorialMedico[];

  @OneToMany(() => Factura, (f) => f.cita)
  facturas: Factura[];
}