import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Mascota } from '../../mascota/entities/mascota.entity';

@Entity('Cliente')
export class Cliente {
  @PrimaryGeneratedColumn()
  idCliente: number;

  @Column({ length: 45, nullable: true, unique: true })
  telefono: string;

  @Column({ length: 45, nullable: true })
  direccion: string;

  @Column({ nullable: true })
  saldo: number;

  @OneToOne(() => Usuario, (usuario) => usuario.cliente)
  @JoinColumn({ name: 'Usuario_id' })
  usuario: Usuario;

  @OneToMany(() => Mascota, (mascota) => mascota.cliente)
  mascotas: Mascota[];
}
