import { Column, Entity, ManyToOne, OneToMany, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { Cita } from '../../cita/entities/cita.entity';
import { Hospitalizacion } from '../../hospitalizacion/entities/hospitalizacion.entity';

export enum EstadoMascota {
  ACTIVA = 'ACTIVA',
  HOSPITALIZADA = 'HOSPITALIZADA',
  FALLECIDA = 'FALLECIDA',
}

@Entity('Mascota')
export class Mascota {
  @PrimaryGeneratedColumn()
  idMascota: number;

  @Column({ length: 45 })
  nombre: string;

  @Column({ length: 45 })
  especie: string;

  @Column({ length: 45 })
  raza: string;

  @Column({ length: 45 })
  color: string;

  @Column({ type: 'date' })
  fecha_nacimiento: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  peso: number;

  @Column({ type: 'enum', enum: EstadoMascota })
  estado: EstadoMascota;

  @ManyToOne(() => Cliente, (cliente) => cliente.mascotas)
  @JoinColumn({ name: 'Cliente_id' })
  cliente: Cliente;

  @OneToMany(() => Cita, (cita) => cita.mascota)
  citas: Cita[];

  @OneToMany(() => Hospitalizacion, (h) => h.mascota)
  hospitalizaciones: Hospitalizacion[];
}
