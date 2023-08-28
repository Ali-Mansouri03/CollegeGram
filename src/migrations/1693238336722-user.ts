import { MigrationInterface, QueryRunner } from "typeorm";

export class User1693238336722 implements MigrationInterface {
    name = 'User1693238336722'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" character varying NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "firsrName" character varying NOT NULL, "lastName" character varying NOT NULL, "bio" character varying NOT NULL, "avatar" character varying NOT NULL, "isPrivate" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
