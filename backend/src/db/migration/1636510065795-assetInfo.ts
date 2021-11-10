import { MigrationInterface, QueryRunner } from 'typeorm';

export class assetInfo1636510065795 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`
        CREATE TABLE asset (
          id INT NOT NULL AUTO_INCREMENT,
          creator VARCHAR(60),
          owner VARCHAR(60),
          unitname VARCHAR(200),
          assetname VARCHAR(200),
          url VARCHAR(255),
          managerkey VARCHAR(255),
          reserveaddr VARCHAR(60),

          total INT,
          decimals INT,
          circulatingsupply INT,

          defaultfrozen TINYINT(1),
          verified TINYINT(1),
          destroyed TINYINT(1),
          PRIMARY KEY (id)
        ) ENGINE=InnoDB;
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
