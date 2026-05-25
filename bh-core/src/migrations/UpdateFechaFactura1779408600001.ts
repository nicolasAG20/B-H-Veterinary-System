import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateInventarioEntidades1779408600001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Factura\` ADD \`fecha_creacion\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
   
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Factura\` DROP COLUMN \`fecha_creacion\``,
    );
  }
}