import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJoinCodeToTemplate1780738374196 implements MigrationInterface {
    name = 'AddJoinCodeToTemplate1780738374196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "templates" ADD "joinCode" character varying`);
        await queryRunner.query(`ALTER TABLE "templates" ADD CONSTRAINT "UQ_27ec5c5ea62beb42d98db8996ea" UNIQUE ("joinCode")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "templates" DROP CONSTRAINT "UQ_27ec5c5ea62beb42d98db8996ea"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "joinCode"`);
    }

}
