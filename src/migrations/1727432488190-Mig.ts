import { MigrationInterface, QueryRunner } from "typeorm";

export class Mig1727432488190 implements MigrationInterface {
    name = 'Mig1727432488190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "specifications" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "specifications" DROP COLUMN "option"`);
        await queryRunner.query(`ALTER TABLE "specifications" ADD "name" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "specifications" ADD "value" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "specifications" ADD "itemId" integer`);
        await queryRunner.query(`ALTER TABLE "specifications" ADD CONSTRAINT "FK_2461d1c159f3262582a18330295" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "specifications" DROP CONSTRAINT "FK_2461d1c159f3262582a18330295"`);
        await queryRunner.query(`ALTER TABLE "specifications" DROP COLUMN "itemId"`);
        await queryRunner.query(`ALTER TABLE "specifications" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "specifications" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "specifications" ADD "option" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "specifications" ADD "type" text NOT NULL`);
    }

}
