import * as bcrypt from 'bcrypt';
import { AppDataSource } from './data-source';
import { EstadoUsuario, RolUsuario, Usuario } from './src/usuario/entities/usuario.entity';

async function seed() {
  await AppDataSource.initialize();
  const usuarioRepo = AppDataSource.getRepository(Usuario);

  const adminExiste = await usuarioRepo.findOne({ where: { correo: 'admin@bh.com' } });
  if (!adminExiste) {
    await usuarioRepo.save({
      nombre: 'Administrador B&H',
      correo: 'admin@bh.com',
      contrasena: await bcrypt.hash('Admin123', 10),
      rol: RolUsuario.ADMINISTRADOR,
      estado: EstadoUsuario.ACTIVO,
    });
    console.log('Administrador creado');
  } else {
    console.log('El administrador ya existe');
  }

  await AppDataSource.destroy();
}

seed();
