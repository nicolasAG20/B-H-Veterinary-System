import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cita } from '../../cita/entities/cita.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Medicamento } from '../../medicamento/entities/medicamento.entity';
import { Vacunacion } from '../../vacunacion/entities/vacunacion.entity';

@Entity('Historial_medico')
export class HistorialMedico {
  @PrimaryGeneratedColumn()
  idHistorial_medico: number;

  @Column({ length: 45 })
  motivo_visita: string;

  @Column({ type: 'longtext' })
  diagnostico: string;

  @Column({ type: 'longtext', nullable: true })
  tratamiento: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  peso_mascota: number;

  @Column({ type: 'datetime', nullable: true })
  proxima_visita: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_creacion: Date;

  @ManyToOne(() => Cita, (cita) => cita.historiales)
  @JoinColumn({ name: 'Cita_id' })
  cita: Cita;

  @ManyToOne(() => Usuario, (usuario) => usuario.historiales)
  @JoinColumn({ name: 'Usuario_id' })
  usuario: Usuario;

  @OneToMany(() => Medicamento, (m) => m.historialMedico)
  medicamentos: Medicamento[];

  @OneToMany(() => Vacunacion, (v) => v.historialMedico)
  vacunaciones: Vacunacion[];
}
