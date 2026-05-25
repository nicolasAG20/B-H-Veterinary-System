import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNombreVacunacion1779408600001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('Vacunacion');
    const column = table?.findColumnByName('nombre');
    if (!column) {
      await queryRunner.query(
        `ALTER TABLE \`Vacunacion\` ADD \`nombre\` VARCHAR(100) NOT NULL DEFAULT ''`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Vacunacion\` DROP COLUMN \`nombre\``,
    );
  }
}