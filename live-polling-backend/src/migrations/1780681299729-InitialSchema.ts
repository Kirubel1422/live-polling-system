import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1780681299729 implements MigrationInterface {
    name = 'InitialSchema1780681299729'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying, "provider" character varying NOT NULL DEFAULT 'local', "providerId" character varying, "displayName" character varying, "avatarUrl" character varying, "role" character varying NOT NULL DEFAULT 'presenter', "isEmailVerified" boolean NOT NULL DEFAULT false, "emailNotifications" boolean NOT NULL DEFAULT true, "resetPasswordToken" character varying, "resetPasswordExpires" TIMESTAMP, "emailVerificationToken" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "participants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "score" integer NOT NULL DEFAULT '0', "session_id" uuid NOT NULL, "joinedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1cda06c31eec1c95b3365a0283f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "live_sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "joinCode" character varying NOT NULL, "currentSlideIndex" integer NOT NULL DEFAULT '0', "isLive" boolean NOT NULL DEFAULT false, "startedAt" TIMESTAMP WITH TIME ZONE, "endedAt" TIMESTAMP WITH TIME ZONE, "presentation_id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_22730467aa5398da891c9d911d2" UNIQUE ("joinCode"), CONSTRAINT "PK_cc3225418b55b1e022dbfb6dca5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "participant_responses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" jsonb NOT NULL, "slide_id" uuid NOT NULL, "session_id" uuid NOT NULL, "participant_id" uuid, "participantName" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5d29ac44da7645885ea3dd5cd10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "slide_options" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying NOT NULL, "isCorrect" boolean, "color" character varying, "imageUrl" character varying, "votes" integer NOT NULL DEFAULT '0', "order" integer NOT NULL DEFAULT '0', "slide_id" uuid NOT NULL, CONSTRAINT "PK_309b6307aa5b26465fbd9a5a7ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "slides" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "title" character varying NOT NULL, "subtitle" text, "order" integer NOT NULL DEFAULT '0', "theme" jsonb NOT NULL, "settings" jsonb NOT NULL DEFAULT '{}', "meta" jsonb NOT NULL DEFAULT '{}', "presentation_id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7907bb06ab78980c123912f7a7a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "templates" ("id" character varying NOT NULL, "title" character varying NOT NULL, "description" text, "thumbnail" character varying, "category" character varying, "slides" jsonb NOT NULL DEFAULT '[]', "theme" jsonb, "isPublic" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_515948649ce0bbbe391de702ae5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "presentations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text, "thumbnail" character varying, "status" character varying NOT NULL DEFAULT 'draft', "theme" jsonb NOT NULL, "joinCode" character varying, "isAIGenerated" boolean NOT NULL DEFAULT false, "ownerId" character varying, "templateId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner_id" uuid, "template_id" character varying, CONSTRAINT "UQ_8990530c15e6deb4bd67e4a952c" UNIQUE ("joinCode"), CONSTRAINT "PK_3f481051bbd7ae196d0ffa5a644" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ai_generation_jobs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "prompt" text NOT NULL, "slideCount" integer NOT NULL DEFAULT '5', "status" character varying NOT NULL DEFAULT 'pending', "generatedSlides" jsonb, "errorMessage" text, "presentationId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "presentation_id" uuid, CONSTRAINT "PK_280287c3e32c8d933c285eecce7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "participants" ADD CONSTRAINT "FK_0874e4c10e89b190f5c9b07e95b" FOREIGN KEY ("session_id") REFERENCES "live_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "live_sessions" ADD CONSTRAINT "FK_df6c91835636733a52f465d4d09" FOREIGN KEY ("presentation_id") REFERENCES "presentations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "participant_responses" ADD CONSTRAINT "FK_523c9b4edf0b1c54dc20e675c5e" FOREIGN KEY ("slide_id") REFERENCES "slides"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "participant_responses" ADD CONSTRAINT "FK_cd678a4712eb15ff29953cf3325" FOREIGN KEY ("session_id") REFERENCES "live_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "participant_responses" ADD CONSTRAINT "FK_4e12838c8a2009cb25e51c72ab8" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "slide_options" ADD CONSTRAINT "FK_0cd59c6ab9e35b9753e4648143e" FOREIGN KEY ("slide_id") REFERENCES "slides"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "slides" ADD CONSTRAINT "FK_bc42f2082d8a3718a6b12b240ef" FOREIGN KEY ("presentation_id") REFERENCES "presentations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "presentations" ADD CONSTRAINT "FK_0eff4c617cb0d1699541c90c102" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "presentations" ADD CONSTRAINT "FK_d023599d4180047254c8a2b7a72" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ai_generation_jobs" ADD CONSTRAINT "FK_bef97e8f04224a231f9b01b2515" FOREIGN KEY ("presentation_id") REFERENCES "presentations"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ai_generation_jobs" DROP CONSTRAINT "FK_bef97e8f04224a231f9b01b2515"`);
        await queryRunner.query(`ALTER TABLE "presentations" DROP CONSTRAINT "FK_d023599d4180047254c8a2b7a72"`);
        await queryRunner.query(`ALTER TABLE "presentations" DROP CONSTRAINT "FK_0eff4c617cb0d1699541c90c102"`);
        await queryRunner.query(`ALTER TABLE "slides" DROP CONSTRAINT "FK_bc42f2082d8a3718a6b12b240ef"`);
        await queryRunner.query(`ALTER TABLE "slide_options" DROP CONSTRAINT "FK_0cd59c6ab9e35b9753e4648143e"`);
        await queryRunner.query(`ALTER TABLE "participant_responses" DROP CONSTRAINT "FK_4e12838c8a2009cb25e51c72ab8"`);
        await queryRunner.query(`ALTER TABLE "participant_responses" DROP CONSTRAINT "FK_cd678a4712eb15ff29953cf3325"`);
        await queryRunner.query(`ALTER TABLE "participant_responses" DROP CONSTRAINT "FK_523c9b4edf0b1c54dc20e675c5e"`);
        await queryRunner.query(`ALTER TABLE "live_sessions" DROP CONSTRAINT "FK_df6c91835636733a52f465d4d09"`);
        await queryRunner.query(`ALTER TABLE "participants" DROP CONSTRAINT "FK_0874e4c10e89b190f5c9b07e95b"`);
        await queryRunner.query(`DROP TABLE "ai_generation_jobs"`);
        await queryRunner.query(`DROP TABLE "presentations"`);
        await queryRunner.query(`DROP TABLE "templates"`);
        await queryRunner.query(`DROP TABLE "slides"`);
        await queryRunner.query(`DROP TABLE "slide_options"`);
        await queryRunner.query(`DROP TABLE "participant_responses"`);
        await queryRunner.query(`DROP TABLE "live_sessions"`);
        await queryRunner.query(`DROP TABLE "participants"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
