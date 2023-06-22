import { MigrationInterface, QueryRunner } from 'typeorm';

export class OperationSeed1687408655007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `insert into "operation" ("operationId", "operationType", "cost") values ('2b5f6d0b-6871-4345-869e-29f30f119491', 'addition', 5)`,
    );
    queryRunner.query(
      `insert into "operation" ("operationId", "operationType", "cost") values ('1595c10f-5407-4b39-af65-3ef11cbef05c', 'subtraction', 10)`,
    );
    queryRunner.query(
      `insert into "operation" ("operationId", "operationType", "cost") values ('48917235-edc0-417e-b1dc-712b366e1fdc', 'multiplication', 15)`,
    );
    queryRunner.query(
      `insert into "operation" ("operationId", "operationType", "cost") values ('99225d68-5dcd-4889-b45d-132b97fab17f', 'division', 20)`,
    );
    queryRunner.query(
      `insert into "operation" ("operationId", "operationType", "cost") values ('aefd7d11-1e00-4837-8c90-e54019ae34af', 'square_root', 25)`,
    );
    queryRunner.query(
      `insert into "operation" ("operationId", "operationType", "cost") values ('44fa99e6-bfa9-4ad9-a3b2-9b2ed14eb285', 'random_string', 30)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
