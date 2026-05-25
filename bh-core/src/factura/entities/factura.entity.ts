import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import { Cita } from '../../cita/entities/cita.entity';
import { timestamp } from 'rxjs';

export enum EstadoFactura {
  PENDIENTE = 'PENDIENTE',
  PAGADA = 'PAGADA',
  ANULADA = 'ANULADA',
}

@Entity('Factura')
export class Factura {
  @PrimaryGeneratedColumn()
  idFactura: number;

  @Column({ nullable: true })
  total: number;

  @Column({ nullable: true })
  subtotal: number;

  @Column({ nullable: true })
  descuento: number;

  @Column({ nullable: true })
  monto_pagado: number;

  @Column({ type: 'enum', enum: EstadoFactura, nullable: true })
  estado: EstadoFactura;

  @Column({ type: 'longtext', nullable: true })
  motivo_anulacion: string;

  @Column({type: 'timestamp', nullable: false})
  fecha_creacion : Timestamp;

  @ManyToOne(() => Cita, (cita) => cita.facturas)
  @JoinColumn({ name: 'Cita_id' })
  cita: Cita;
}
