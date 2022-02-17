import {MigrationInterface, QueryRunner} from "typeorm";

export class verifiedNft1645057112093 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      ALTER TABLE asset
        ADD COLUMN verifiedNft TINYINT(1) NULL DEFAULT 0 AFTER destroyed,
        ADD COLUMN verifiedNftTime VARCHAR(8) NULL DEFAULT '' AFTER verifiedNft;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
