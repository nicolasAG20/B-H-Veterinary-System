import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Hospitalizacion } from '../../hospitalizacion/entities/hospitalizacion.entity';

@Entity('Nota_evolucion')
export class NotaEvolucion {
  @PrimaryGeneratedColumn()
  idNota_evolucion: number;

  @Column({ type: 'text' })
  nota: string;

  @Column({ type: 'date' })
  fecha: Date;

  @ManyToOne(() => Hospitalizacion, (h) => h.notasEvolucion)
  @JoinColumn({ name: 'Hospitalizacion_id' })
  hospitalizacion: Hospitalizacion;
}
