import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Mascota } from '../../mascota/entities/mascota.entity';
import { NotaEvolucion } from '../../nota-evolucion/entities/nota-evolucion.entity';

/**
 * Enum que representa los posibles estados en que puede egresar
 * una mascota al recibir el alta de su hospitalización.
 */
export enum EstadoEgreso {
  RECUPERADA = 'RECUPERADA',
  FALLECIDA  = 'FALLECIDA',
  TRASLADADA = 'TRASLADADA',
}

/**
 * Entidad que representa una hospitalización de una mascota en la clínica.
 *
 * Una hospitalización se crea cuando el veterinario interna a una mascota,
 * y se cierra cuando se registra el alta con fecha de salida y estado de egreso.
 * Durante el período activo, se pueden registrar notas de evolución diarias.
 */
@Entity('Hospitalizacion')
export class Hospitalizacion {
  /** Identificador único de la hospitalización. */
  @PrimaryGeneratedColumn()
  idHospitalizacion: number;

  /** Motivo clínico por el cual la mascota fue internada. */
  @Column({ type: 'text' })
  motivo: string;

  /** Fecha y hora en que la mascota ingresó a hospitalización. */
  @Column({ type: 'datetime' })
  fecha_ingreso: Date;

  /**
   * Fecha y hora en que la mascota recibió el alta.
   * Es `null` mientras la hospitalización esté activa.
   */
  @Column({ type: 'datetime', nullable: true })
  fecha_salida: Date | null;

  /**
   * Estado en que egresó la mascota al recibir el alta.
   * Es `null` mientras la hospitalización esté activa.
   */
  @Column({ type: 'enum', enum: EstadoEgreso, nullable: true })
  estado_egreso: EstadoEgreso | null;

  /** Veterinario responsable de la hospitalización. */
  @ManyToOne(() => Usuario, (usuario) => usuario.hospitalizaciones)
  @JoinColumn({ name: 'Usuario_id' })
  usuario: Usuario;

  /** Mascota que se encuentra hospitalizada. */
  @ManyToOne(() => Mascota, (mascota) => mascota.hospitalizaciones)
  @JoinColumn({ name: 'Mascota_id' })
  mascota: Mascota;

  /** Notas de evolución registradas durante la hospitalización. */
  @OneToMany(() => NotaEvolucion, (n) => n.hospitalizacion)
  notasEvolucion: NotaEvolucion[];
}
