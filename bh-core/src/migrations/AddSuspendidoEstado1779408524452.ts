import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSuspendidoEstado1779408524452 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `Usuario` MODIFY `estado` ENUM('PENDIENTE_VERIFICACION','PENDIENTE_APROBACION','ACTIVO','RECHAZADO','SUSPENDIDO') NOT NULL",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `Usuario` MODIFY `estado` ENUM('PENDIENTE_VERIFICACION','PENDIENTE_APROBACION','ACTIVO','RECHAZADO') NOT NULL",
    );
  }
}
