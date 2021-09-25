import { MigrationInterface, QueryRunner } from 'typeorm';

export class swapEntity1632595982063 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`
        CREATE TABLE swap (
          txId VARCHAR(60) NOT NULL,
          completed TINYINT NOT NULL DEFAULT 0,
          PRIMARY KEY (txId)
        ) ENGINE=InnoDB;
      `);
    } catch (err) {
      await this.down(queryRunner);
      throw err;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS=0;`);
    await queryRunner.query(`DROP TABLE IF EXISTS swap;`);
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS=1;`);
  }
}
