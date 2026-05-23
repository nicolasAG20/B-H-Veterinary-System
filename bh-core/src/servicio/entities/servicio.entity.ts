import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cita } from '../../cita/entities/cita.entity';

@Entity('Servicio')
export class Servicio {
  @PrimaryGeneratedColumn()
  idServicio: number;

  @Column({ length: 45 })
  nombre: string;

  @Column({ length: 45, nullable: true })
  descripcion: string;

  @Column()
  precio: number;

  @Column({ type: 'tinyint', width: 1 })
  activo: boolean;

  @ManyToMany(() => Cita, (cita) => cita.servicios)
  citas: Cita[];
}
