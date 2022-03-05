import { MigrationInterface, QueryRunner } from 'typeorm';

export class createdAt1645752856460 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      ALTER TABLE swap
        ADD COLUMN createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
