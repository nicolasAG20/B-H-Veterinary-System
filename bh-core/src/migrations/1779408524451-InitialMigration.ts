import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1779408524451 implements MigrationInterface {
    name = 'InitialMigration1779408524451'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Servicio\` (\`idServicio\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(45) NOT NULL, \`descripcion\` varchar(45) NULL, \`precio\` int NOT NULL, \`activo\` tinyint(1) NOT NULL, PRIMARY KEY (\`idServicio\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Vacunacion\` (\`idVacunacion\` int NOT NULL AUTO_INCREMENT, \`nombre_vacuna\` varchar(60) NOT NULL, \`fecha_proxima_dosis\` datetime NOT NULL, \`fecha_aplicacion\` datetime NOT NULL, \`Historial_medico_id\` int NULL, \`Producto_id\` int NULL, PRIMARY KEY (\`idVacunacion\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Producto\` (\`idProducto\` int NOT NULL AUTO_INCREMENT, \`stock\` int NOT NULL, \`stock_minimo\` int NOT NULL, \`precio\` bigint NOT NULL, \`fecha_vencimiento\` datetime NOT NULL, PRIMARY KEY (\`idProducto\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Medicamento\` (\`idMedicamento\` int NOT NULL AUTO_INCREMENT, \`nombre_medicamento\` varchar(50) NOT NULL, \`dosis\` text NOT NULL, \`duracion\` time NOT NULL, \`Historial_medico_id\` int NULL, \`Producto_id\` int NULL, PRIMARY KEY (\`idMedicamento\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Historial_medico\` (\`idHistorial_medico\` int NOT NULL AUTO_INCREMENT, \`motivo_visita\` varchar(45) NOT NULL, \`diagnostico\` longtext NOT NULL, \`tratamiento\` longtext NULL, \`peso_mascota\` decimal(5,2) NOT NULL, \`proxima_visita\` datetime NULL, \`fecha_creacion\` timestamp NULL, \`Cita_id\` int NULL, \`Usuario_id\` int NULL, PRIMARY KEY (\`idHistorial_medico\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Factura\` (\`idFactura\` int NOT NULL AUTO_INCREMENT, \`total\` int NULL, \`subtotal\` int NULL, \`descuento\` int NULL, \`monto_pagado\` int NULL, \`estado\` enum ('PENDIENTE', 'PAGADA', 'ANULADA') NULL, \`motivo_anulacion\` longtext NULL, \`Cita_id\` int NULL, PRIMARY KEY (\`idFactura\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Cita\` (\`idCita\` int NOT NULL AUTO_INCREMENT, \`fecha_hora\` datetime NOT NULL, \`estado\` enum ('Pendiente_pago', 'Agendada', 'Finalizada', 'Cancelada') NOT NULL, \`precio_total\` int NULL, \`motivo_cancelacion\` longtext NULL, \`Mascota_id\` int NULL, \`Usuario_id\` int NULL, PRIMARY KEY (\`idCita\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Nota_evolucion\` (\`idNota_evolucion\` int NOT NULL AUTO_INCREMENT, \`nota\` text NOT NULL, \`fecha\` date NOT NULL, \`Hospitalizacion_id\` int NULL, PRIMARY KEY (\`idNota_evolucion\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Hospitalizacion\` (\`idHospitalizacion\` int NOT NULL AUTO_INCREMENT, \`fecha_ingreso\` datetime NOT NULL, \`fecha_salida\` datetime NOT NULL, \`estado_egreso\` enum ('RECUPERADA', 'FALLECIDA', 'TRASLADADA') NULL, \`Usuario_id\` int NULL, \`Mascota_id\` int NULL, PRIMARY KEY (\`idHospitalizacion\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Mascota\` (\`idMascota\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(45) NOT NULL, \`especie\` varchar(45) NOT NULL, \`raza\` varchar(45) NOT NULL, \`color\` varchar(45) NOT NULL, \`fecha_nacimiento\` date NOT NULL, \`peso\` decimal(5,2) NOT NULL, \`estado\` enum ('ACTIVA', 'HOSPITALIZADA', 'FALLECIDA') NOT NULL, \`Cliente_id\` int NULL, PRIMARY KEY (\`idMascota\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Cliente\` (\`idCliente\` int NOT NULL AUTO_INCREMENT, \`telefono\` varchar(45) NULL, \`direccion\` varchar(45) NULL, \`saldo\` int NULL, \`Usuario_id\` int NULL, UNIQUE INDEX \`IDX_5d9f0a9651e6681a40c6f973f6\` (\`telefono\`), UNIQUE INDEX \`REL_b98bec1404c3a39d2f1cb7a936\` (\`Usuario_id\`), PRIMARY KEY (\`idCliente\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Usuario\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(100) NOT NULL, \`rol\` enum ('CLIENTE', 'RECEPCIONISTA', 'VETERINARIO', 'ADMINISTRADOR') NOT NULL, \`correo\` varchar(60) NOT NULL, \`contrasena\` varchar(60) NOT NULL, \`codigo_verificacion\` varchar(6) NULL, \`tiempo_expiracion\` timestamp(5) NULL, \`estado\` enum ('PENDIENTE_VERIFICACION', 'PENDIENTE_APROBACION', 'ACTIVO', 'RECHAZADO') NOT NULL, UNIQUE INDEX \`IDX_631bf87f4acdcb87c6ff8648c3\` (\`correo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Cita_servicio\` (\`Cita_id\` int NOT NULL, \`Servicio_id\` int NOT NULL, INDEX \`IDX_48b20c81820340d1ab8b4ee6a1\` (\`Cita_id\`), INDEX \`IDX_5f1d41be119d07c8bc0373e572\` (\`Servicio_id\`), PRIMARY KEY (\`Cita_id\`, \`Servicio_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Vacunacion\` ADD CONSTRAINT \`FK_89160453e9029e9c2002964c1d0\` FOREIGN KEY (\`Historial_medico_id\`) REFERENCES \`Historial_medico\`(\`idHistorial_medico\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Vacunacion\` ADD CONSTRAINT \`FK_cb28d73ef03db16d4c99a319788\` FOREIGN KEY (\`Producto_id\`) REFERENCES \`Producto\`(\`idProducto\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Medicamento\` ADD CONSTRAINT \`FK_f48cd42f90a9511554b22bdb7fb\` FOREIGN KEY (\`Historial_medico_id\`) REFERENCES \`Historial_medico\`(\`idHistorial_medico\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Medicamento\` ADD CONSTRAINT \`FK_ea0dfffd8db0ba74bb221e4dfac\` FOREIGN KEY (\`Producto_id\`) REFERENCES \`Producto\`(\`idProducto\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Historial_medico\` ADD CONSTRAINT \`FK_e27511f91148e0feb393e5f9333\` FOREIGN KEY (\`Cita_id\`) REFERENCES \`Cita\`(\`idCita\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Historial_medico\` ADD CONSTRAINT \`FK_627b06819616dec3808fb32feb7\` FOREIGN KEY (\`Usuario_id\`) REFERENCES \`Usuario\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Factura\` ADD CONSTRAINT \`FK_fd6a4c90ffd0204282e7d4021ed\` FOREIGN KEY (\`Cita_id\`) REFERENCES \`Cita\`(\`idCita\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Cita\` ADD CONSTRAINT \`FK_a357044e5be3c7426ea7213f849\` FOREIGN KEY (\`Mascota_id\`) REFERENCES \`Mascota\`(\`idMascota\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Cita\` ADD CONSTRAINT \`FK_a5090c0eb8a546ff0869dabac13\` FOREIGN KEY (\`Usuario_id\`) REFERENCES \`Usuario\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Nota_evolucion\` ADD CONSTRAINT \`FK_df59ff1963f1d54aa86231b5c36\` FOREIGN KEY (\`Hospitalizacion_id\`) REFERENCES \`Hospitalizacion\`(\`idHospitalizacion\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Hospitalizacion\` ADD CONSTRAINT \`FK_1cf0b98a148c9aa4bf1c05ed191\` FOREIGN KEY (\`Usuario_id\`) REFERENCES \`Usuario\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Hospitalizacion\` ADD CONSTRAINT \`FK_5fdb5b6b7af97568200e4dc93e2\` FOREIGN KEY (\`Mascota_id\`) REFERENCES \`Mascota\`(\`idMascota\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Mascota\` ADD CONSTRAINT \`FK_66bbbd5838bc26f8dc3f051262e\` FOREIGN KEY (\`Cliente_id\`) REFERENCES \`Cliente\`(\`idCliente\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Cliente\` ADD CONSTRAINT \`FK_b98bec1404c3a39d2f1cb7a9363\` FOREIGN KEY (\`Usuario_id\`) REFERENCES \`Usuario\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Cita_servicio\` ADD CONSTRAINT \`FK_48b20c81820340d1ab8b4ee6a1c\` FOREIGN KEY (\`Cita_id\`) REFERENCES \`Cita\`(\`idCita\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`Cita_servicio\` ADD CONSTRAINT \`FK_5f1d41be119d07c8bc0373e572d\` FOREIGN KEY (\`Servicio_id\`) REFERENCES \`Servicio\`(\`idServicio\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Cita_servicio\` DROP FOREIGN KEY \`FK_5f1d41be119d07c8bc0373e572d\``);
        await queryRunner.query(`ALTER TABLE \`Cita_servicio\` DROP FOREIGN KEY \`FK_48b20c81820340d1ab8b4ee6a1c\``);
        await queryRunner.query(`ALTER TABLE \`Cliente\` DROP FOREIGN KEY \`FK_b98bec1404c3a39d2f1cb7a9363\``);
        await queryRunner.query(`ALTER TABLE \`Mascota\` DROP FOREIGN KEY \`FK_66bbbd5838bc26f8dc3f051262e\``);
        await queryRunner.query(`ALTER TABLE \`Hospitalizacion\` DROP FOREIGN KEY \`FK_5fdb5b6b7af97568200e4dc93e2\``);
        await queryRunner.query(`ALTER TABLE \`Hospitalizacion\` DROP FOREIGN KEY \`FK_1cf0b98a148c9aa4bf1c05ed191\``);
        await queryRunner.query(`ALTER TABLE \`Nota_evolucion\` DROP FOREIGN KEY \`FK_df59ff1963f1d54aa86231b5c36\``);
        await queryRunner.query(`ALTER TABLE \`Cita\` DROP FOREIGN KEY \`FK_a5090c0eb8a546ff0869dabac13\``);
        await queryRunner.query(`ALTER TABLE \`Cita\` DROP FOREIGN KEY \`FK_a357044e5be3c7426ea7213f849\``);
        await queryRunner.query(`ALTER TABLE \`Factura\` DROP FOREIGN KEY \`FK_fd6a4c90ffd0204282e7d4021ed\``);
        await queryRunner.query(`ALTER TABLE \`Historial_medico\` DROP FOREIGN KEY \`FK_627b06819616dec3808fb32feb7\``);
        await queryRunner.query(`ALTER TABLE \`Historial_medico\` DROP FOREIGN KEY \`FK_e27511f91148e0feb393e5f9333\``);
        await queryRunner.query(`ALTER TABLE \`Medicamento\` DROP FOREIGN KEY \`FK_ea0dfffd8db0ba74bb221e4dfac\``);
        await queryRunner.query(`ALTER TABLE \`Medicamento\` DROP FOREIGN KEY \`FK_f48cd42f90a9511554b22bdb7fb\``);
        await queryRunner.query(`ALTER TABLE \`Vacunacion\` DROP FOREIGN KEY \`FK_cb28d73ef03db16d4c99a319788\``);
        await queryRunner.query(`ALTER TABLE \`Vacunacion\` DROP FOREIGN KEY \`FK_89160453e9029e9c2002964c1d0\``);
        await queryRunner.query(`DROP INDEX \`IDX_5f1d41be119d07c8bc0373e572\` ON \`Cita_servicio\``);
        await queryRunner.query(`DROP INDEX \`IDX_48b20c81820340d1ab8b4ee6a1\` ON \`Cita_servicio\``);
        await queryRunner.query(`DROP TABLE \`Cita_servicio\``);
        await queryRunner.query(`DROP INDEX \`IDX_631bf87f4acdcb87c6ff8648c3\` ON \`Usuario\``);
        await queryRunner.query(`DROP TABLE \`Usuario\``);
        await queryRunner.query(`DROP INDEX \`REL_b98bec1404c3a39d2f1cb7a936\` ON \`Cliente\``);
        await queryRunner.query(`DROP INDEX \`IDX_5d9f0a9651e6681a40c6f973f6\` ON \`Cliente\``);
        await queryRunner.query(`DROP TABLE \`Cliente\``);
        await queryRunner.query(`DROP TABLE \`Mascota\``);
        await queryRunner.query(`DROP TABLE \`Hospitalizacion\``);
        await queryRunner.query(`DROP TABLE \`Nota_evolucion\``);
        await queryRunner.query(`DROP TABLE \`Cita\``);
        await queryRunner.query(`DROP TABLE \`Factura\``);
        await queryRunner.query(`DROP TABLE \`Historial_medico\``);
        await queryRunner.query(`DROP TABLE \`Medicamento\``);
        await queryRunner.query(`DROP TABLE \`Producto\``);
        await queryRunner.query(`DROP TABLE \`Vacunacion\``);
        await queryRunner.query(`DROP TABLE \`Servicio\``);
    }

}
