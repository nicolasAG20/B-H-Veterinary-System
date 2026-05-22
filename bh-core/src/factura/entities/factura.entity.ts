import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cita } from '../../cita/entities/cita.entity';

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

  @ManyToOne(() => Cita, (cita) => cita.facturas)
  @JoinColumn({ name: 'Cita_id' })
  cita: Cita;
}
