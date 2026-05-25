import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migración: AddMotivoToHospitalizacion
 *
 * Cambios aplicados a la tabla `Hospitalizacion`:
 * - Agrega la columna `motivo` (TEXT NOT NULL) para registrar el motivo clínico
 *   de la internación de la mascota.
 * - Modifica la columna `fecha_salida` para permitir valores NULL, ya que al
 *   momento de internar una mascota aún no existe fecha de egreso.
 */
export class AddMotivoToHospitalizacion1779650000000 implements MigrationInterface {
  name = 'AddMotivoToHospitalizacion1779650000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Hospitalizacion\` ADD COLUMN \`motivo\` TEXT NOT NULL AFTER \`idHospitalizacion\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Hospitalizacion\` MODIFY COLUMN \`fecha_salida\` DATETIME NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Hospitalizacion\` MODIFY COLUMN \`fecha_salida\` DATETIME NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Hospitalizacion\` DROP COLUMN \`motivo\``,
    );
  }
}
