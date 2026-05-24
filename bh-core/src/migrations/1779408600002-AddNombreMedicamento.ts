import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNombreMedicamento1779408600002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('Medicamento');
    const column = table?.findColumnByName('nombre');
    if (!column) {
      await queryRunner.query(
        `ALTER TABLE \`Medicamento\` ADD \`nombre\` VARCHAR(100) NOT NULL DEFAULT ''`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Medicamento\` DROP COLUMN \`nombre\``,
    );
  }
}