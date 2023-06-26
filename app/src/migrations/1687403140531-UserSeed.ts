import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserSeed1687403140531 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `insert into "user" ("userId", "userName", "userStatus", "balance", "password") values ('960ca815-dc12-4e14-b2fc-e870c35a83e1', 'demo1@tn.com', 'active', 300, '$2b$10$7/yg4B8ju3ro/mGZ/0wpauwj04kKGh7w8pSrB3rlADiRrbBJ.s2ZK')`,
      null,
    );

    await queryRunner.query(
      `insert into "user" ("userId", "userName", "userStatus", "balance", "password") values ('a85deb8d-7db6-4f12-b828-3bb65128e037', 'demo2@tn.com', 'active', 300, '$2b$10$7/yg4B8ju3ro/mGZ/0wpauwj04kKGh7w8pSrB3rlADiRrbBJ.s2ZK')`,
      null,
    );

    await queryRunner.query(
      `insert into "user" ("userId", "userName", "userStatus", "balance", "password") values ('c4b185b3-00e6-47ea-ba18-27ad7ea3bb2d', 'demo3@tn.com', 'active', 300, '$2b$10$7/yg4B8ju3ro/mGZ/0wpauwj04kKGh7w8pSrB3rlADiRrbBJ.s2ZK')`,
      null,
    );

    await queryRunner.query(
      `insert into "user" ("userId", "userName", "userStatus", "balance", "password") values ('892e1e58-94ec-4814-969b-6d40486b1366', 'demo4@tn.com', 'active', 300, '$2b$10$7/yg4B8ju3ro/mGZ/0wpauwj04kKGh7w8pSrB3rlADiRrbBJ.s2ZK')`,
      null,
    );

    await queryRunner.query(
      `insert into "user" ("userId", "userName", "userStatus", "balance", "password") values ('e77ef322-0058-47fd-b6b7-186badd43218', 'demo5@tn.com', 'active', 300, '$2b$10$7/yg4B8ju3ro/mGZ/0wpauwj04kKGh7w8pSrB3rlADiRrbBJ.s2ZK')`,
      null,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
