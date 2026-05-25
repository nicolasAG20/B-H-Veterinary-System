import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Medicamento } from '../../medicamento/entities/medicamento.entity';
import { Vacunacion } from '../../vacunacion/entities/vacunacion.entity';

@Entity('Producto')
export class Producto {
  @PrimaryGeneratedColumn()
  idProducto: number;

  @Column()
  stock: number;

  @Column()
  stock_minimo: number;

  @Column({ type: 'bigint' })
  precio: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'datetime' })
  fecha_vencimiento: Date;

  @OneToMany(() => Medicamento, (m) => m.producto)
  medicamentos: Medicamento[];

  @OneToMany(() => Vacunacion, (v) => v.producto)
  vacunaciones: Vacunacion[];
}