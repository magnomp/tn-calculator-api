import { MigrationInterface, QueryRunner } from 'typeorm';

export class Session1687370894359 implements MigrationInterface {
  name = 'Session1687370894359';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("userId" uuid NOT NULL, "userName" text NOT NULL, "userStatus" "public"."user_userstatus_enum" NOT NULL, "balance" integer NOT NULL, "password" text NOT NULL, CONSTRAINT "PK_d72ea127f30e21753c9e229891e" PRIMARY KEY ("userId"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
