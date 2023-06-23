import { MigrationInterface, QueryRunner } from 'typeorm';

export class Session1687405010140 implements MigrationInterface {
  name = 'Session1687405010140';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "session" ("sessionId" uuid NOT NULL, "userId" uuid NOT NULL, "refreshToken" text NOT NULL, "isActive" boolean NOT NULL, CONSTRAINT "PK_6f8fc3d2111ccc30d98e173d8dd" PRIMARY KEY ("sessionId"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "session"`);
  }
}
