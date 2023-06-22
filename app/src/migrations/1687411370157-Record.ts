import { MigrationInterface, QueryRunner } from 'typeorm';

export class Record1687411370157 implements MigrationInterface {
  name = 'Record1687411370157';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "record" ("recordId" uuid NOT NULL, "userId" uuid NOT NULL, "operationId" uuid NOT NULL, "amount" integer NOT NULL, "userBalance" integer NOT NULL, "operationResponse" text NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "isDeleted" boolean NOT NULL, CONSTRAINT "PK_de44c9ce8c7d8f8fc41d1f3550b" PRIMARY KEY ("recordId"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "record"`);
  }
}
