import { MigrationInterface, QueryRunner } from 'typeorm';

export class status1634782849534 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`
        ALTER TABLE swap
          CHANGE COLUMN completed status INT NOT NULL DEFAULT '0' ;
      `);
    } catch (err) {
      await this.down(queryRunner);
      throw err;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS=0;`);
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS=1;`);
  }
}
