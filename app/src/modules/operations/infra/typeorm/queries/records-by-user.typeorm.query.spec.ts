import { createNewDatabase, dropDatabase } from '@/integration/connection';
import { DataSource, Repository } from 'typeorm';
import { Operation } from '../entities/operation.entity';
import { Record } from '../entities/record.entity';
import { RecordsByUserQueryTypeOrm } from './records-by-user.typeorm.query';
import crypto from 'crypto';
import { OrderDirection } from '@/shared/orderby';
import { OperationType } from '@/modules/operations/shared/operation-type';

describe('RecordsByUserQueryTypeOrm', () => {
  let datasource: DataSource;
  let typeOrmRepo: Repository<Record>;
  let query: RecordsByUserQueryTypeOrm;

  beforeAll(async () => {
    datasource = await createNewDatabase();
  });

  afterAll(async () => {
    await dropDatabase(datasource);
  });

  beforeEach(() => {
    typeOrmRepo = datasource.getRepository(Record);
    query = new RecordsByUserQueryTypeOrm(typeOrmRepo);
  });

  it('Count should return the number of records regardless of pagination', async () => {
    const userId = 'cd99308e-f18f-497d-9937-dc5d37583bf5';
    const operation = new Operation();
    operation.operationId = '3a8e4217-f5fb-4770-98cf-6bd82ebffb83';
    operation.operationType = OperationType.addition;
    operation.cost = 10;
    await datasource.getRepository(Operation).save(operation);

    for (let i = 0; i < 11; i++) {
      const record = new Record();
      record.recordId = crypto.randomUUID();
      record.userId = userId;
      record.userBalance = 10;
      record.amount = i == 10 ? 100 : 10;
      record.date = new Date();
      record.isDeleted = false;
      record.operationId = '3a8e4217-f5fb-4770-98cf-6bd82ebffb83';
      record.operationResponse = '100';
      await typeOrmRepo.save(record);
    }

    const result = await query.execute(userId, 0, 2, { amount: 10 }, []);
    expect(result.total).toBe(10);
  });

  it('Deleted records should not be counted nor returned', async () => {
    const userId = crypto.randomUUID();
    const operation = new Operation();
    operation.operationId = '3a8e4217-f5fb-4770-98cf-6bd82ebffb83';
    operation.operationType = OperationType.addition;
    operation.cost = 10;
    await datasource.getRepository(Operation).save(operation);

    for (let i = 0; i < 10; i++) {
      const record = new Record();
      record.recordId = crypto.randomUUID();
      record.userId = userId;
      record.userBalance = 10;
      record.amount = 10;
      record.date = new Date();
      record.isDeleted = i % 2 == 0;
      record.operationId = '3a8e4217-f5fb-4770-98cf-6bd82ebffb83';
      record.operationResponse = i.toString();
      await typeOrmRepo.save(record);
    }

    const result = await query.execute(userId, 0, 2, { amount: 10 }, [
      { field: 'operationResult', direction: OrderDirection.ASC },
    ]);
    expect(result.total).toBe(5);
    expect(result.items[0].operationResult).toBe('1');
    expect(result.items[1].operationResult).toBe('3');
  });
});
