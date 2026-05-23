import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HistorialMedico } from '../../historial-medico/entities/historial-medico.entity';
import { Producto } from '../../producto/entities/producto.entity';

@Entity('Medicamento')
export class Medicamento {
  @PrimaryGeneratedColumn()
  idMedicamento: number;

  @Column({ type: 'text' })
  nombre: string;

  @Column({ type: 'text' })
  dosis: string;

  @Column({ type: 'time' })
  duracion: string;

  @ManyToOne(() => HistorialMedico, (h) => h.medicamentos)
  @JoinColumn({ name: 'Historial_medico_id' })
  historialMedico: HistorialMedico;

  @ManyToOne(() => Producto, (p) => p.medicamentos)
  @JoinColumn({ name: 'Producto_id' })
  producto: Producto;
}