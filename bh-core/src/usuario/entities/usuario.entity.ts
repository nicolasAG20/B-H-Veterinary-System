import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { Cita } from '../../cita/entities/cita.entity';
import { HistorialMedico } from '../../historial-medico/entities/historial-medico.entity';
import { Hospitalizacion } from '../../hospitalizacion/entities/hospitalizacion.entity';

export enum RolUsuario {
  CLIENTE = 'CLIENTE',
  RECEPCIONISTA = 'RECEPCIONISTA',
  VETERINARIO = 'VETERINARIO',
  ADMINISTRADOR = 'ADMINISTRADOR',
}

export enum EstadoUsuario {
  PENDIENTE_VERIFICACION = 'PENDIENTE_VERIFICACION',
  PENDIENTE_APROBACION = 'PENDIENTE_APROBACION',
  ACTIVO = 'ACTIVO',
  RECHAZADO = 'RECHAZADO',
  SUSPENDIDO = 'SUSPENDIDO',
}

@Entity('Usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'enum', enum: RolUsuario })
  rol: RolUsuario;

  @Column({ length: 60, unique: true })
  correo: string;

  @Column({ length: 60 })
  contrasena: string;

  @Column({ length: 6, nullable: true })
  codigo_verificacion: string;

  @Column({ type: 'timestamp', nullable: true, precision: 5 })
  tiempo_expiracion: Date;

  @Column({ type: 'enum', enum: EstadoUsuario })
  estado: EstadoUsuario;

  @OneToOne(() => Cliente, (cliente) => cliente.usuario)
  cliente: Cliente;

  @OneToMany(() => Cita, (cita) => cita.usuario)
  citas: Cita[];

  @OneToMany(() => HistorialMedico, (h) => h.usuario)
  historiales: HistorialMedico[];

  @OneToMany(() => Hospitalizacion, (h) => h.usuario)
  hospitalizaciones: Hospitalizacion[];
}
