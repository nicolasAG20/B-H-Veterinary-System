import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HistorialMedico } from '../../historial-medico/entities/historial-medico.entity';
import { Producto } from '../../producto/entities/producto.entity';

@Entity('Vacunacion')
export class Vacunacion {
  @PrimaryGeneratedColumn()
  idVacunacion: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'datetime' })
  fecha_proxima_dosis: Date;

  @Column({ type: 'datetime' })
  fecha_aplicacion: Date;

  @ManyToOne(() => HistorialMedico, (h) => h.vacunaciones)
  @JoinColumn({ name: 'Historial_medico_id' })
  historialMedico: HistorialMedico;

  @ManyToOne(() => Producto, (p) => p.vacunaciones)
  @JoinColumn({ name: 'Producto_id' })
  producto: Producto;
}