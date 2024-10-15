import { MigrationInterface, QueryRunner } from "typeorm";

export class Mig1728659445195 implements MigrationInterface {
    name = 'Mig1728659445195'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "location" geography(Point,4326)`);
        await queryRunner.query(`ALTER TABLE "couriers" ADD "location" geography(Point,4326)`);
        await queryRunner.query(`ALTER TABLE "merchants" ADD "location" geography(Point,4326)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchants" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "couriers" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "location"`);
    }

}
