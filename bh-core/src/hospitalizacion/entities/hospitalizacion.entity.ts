import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Mascota } from '../../mascota/entities/mascota.entity';
import { NotaEvolucion } from '../../nota-evolucion/entities/nota-evolucion.entity';

export enum EstadoEgreso {
  RECUPERADA = 'RECUPERADA',
  FALLECIDA = 'FALLECIDA',
  TRASLADADA = 'TRASLADADA',
}

@Entity('Hospitalizacion')
export class Hospitalizacion {
  @PrimaryGeneratedColumn()
  idHospitalizacion: number;

  @Column({ type: 'datetime' })
  fecha_ingreso: Date;

  @Column({ type: 'datetime' })
  fecha_salida: Date;

  @Column({ type: 'enum', enum: EstadoEgreso, nullable: true })
  estado_egreso: EstadoEgreso;

  @ManyToOne(() => Usuario, (usuario) => usuario.hospitalizaciones)
  @JoinColumn({ name: 'Usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Mascota, (mascota) => mascota.hospitalizaciones)
  @JoinColumn({ name: 'Mascota_id' })
  mascota: Mascota;

  @OneToMany(() => NotaEvolucion, (n) => n.hospitalizacion)
  notasEvolucion: NotaEvolucion[];
}
