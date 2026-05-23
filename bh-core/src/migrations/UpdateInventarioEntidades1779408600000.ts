import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateInventarioEntidades1779408600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Producto\` ADD \`nombre\` VARCHAR(100) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Medicamento\` DROP COLUMN \`nombre_medicamento\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Vacunacion\` DROP COLUMN \`nombre_vacuna\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Vacunacion\` ADD \`nombre_vacuna\` VARCHAR(60) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Medicamento\` ADD \`nombre_medicamento\` VARCHAR(50) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Producto\` DROP COLUMN \`nombre\``,
    );
  }
}