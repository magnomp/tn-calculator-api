import { MigrationInterface, QueryRunner } from "typeorm";

export class Operation1687408596729 implements MigrationInterface {
    name = 'Operation1687408596729'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."operation_operationtype_enum" AS ENUM('addition', 'subtraction', 'multiplication', 'division', 'square_root', 'random_string')`);
        await queryRunner.query(`CREATE TABLE "operation" ("operationId" uuid NOT NULL, "operationType" "public"."operation_operationtype_enum" NOT NULL, "cost" integer NOT NULL, CONSTRAINT "PK_10583e3e1a51213835fa630e69a" PRIMARY KEY ("operationId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "operation"`);
        await queryRunner.query(`DROP TYPE "public"."operation_operationtype_enum"`);
    }

}
