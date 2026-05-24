import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReembolsoTable1779582961939 implements MigrationInterface {
    name = 'AddReembolsoTable1779582961939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Reembolso\` (\`idReembolso\` int NOT NULL AUTO_INCREMENT, \`estado\` enum ('PENDIENTE', 'APROBADO', 'RECHAZADO') NOT NULL DEFAULT 'PENDIENTE', \`monto_aprobado\` int NULL, \`motivo_rechazo\` longtext NULL, \`fecha_solicitud\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`fecha_resolucion\` timestamp NULL, \`Factura_id\` int NULL, PRIMARY KEY (\`idReembolso\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Reembolso\` ADD CONSTRAINT \`FK_fce476f03af69b8042140a015c6\` FOREIGN KEY (\`Factura_id\`) REFERENCES \`Factura\`(\`idFactura\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Reembolso\` DROP FOREIGN KEY \`FK_fce476f03af69b8042140a015c6\``);
        await queryRunner.query(`DROP TABLE \`Reembolso\``);
    }

}
