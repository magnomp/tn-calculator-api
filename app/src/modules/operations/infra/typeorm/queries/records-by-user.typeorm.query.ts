import { Repository } from 'typeorm';
import { OrderBy } from '@/shared/orderby';
import { Where } from '@/shared/where';
import { PaginatedResult } from '@/shared/paginated-list';
import {
  Record,
  RecordsByUserQuery,
} from '@/modules/operations/application/queries/records-by-user.query';
import { Record as RecordEntity } from '../entities/record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RecordsByUserQueryTypeOrm implements RecordsByUserQuery {
  public constructor(
    @InjectRepository(RecordEntity)
    private readonly repository: Repository<RecordEntity>,
  ) {}

  async execute(
    userId: string,
    skip: number,
    take: number,
    where: Where<Record>,
    orderBy: OrderBy<Record>,
  ): Promise<PaginatedResult<Record>> {
    const qb = this.repository
      .createQueryBuilder('record')
      .innerJoinAndSelect('record.operation', 'operation')
      .andWhere('record.userId = :userId', { userId })
      .andWhere('record.isDeleted = false');
    if (where.amount) {
      qb.andWhere('record.amount = :amount', { amount: where.amount });
    }
    if (where.operation) {
      qb.andWhere('operation.operationType = :operation', {
        operation: where.operation,
      });
    }
    if (where.operationResult) {
      qb.andWhere('record.operationResponse = :operationResponse', {
        operationResponse: where.operationResult,
      });
    }
    if (where.date) {
      qb.andWhere('record.date = :date', { date: where.date });
    }
    if (where.userBalance) {
      qb.andWhere('record.userBalance = :userBalance', {
        userBalance: where.userBalance,
      });
    }
    for (const { field, direction } of orderBy) {
      switch (field) {
        case 'amount': {
          qb.addOrderBy('record.amount', direction);
          break;
        }
        case 'date': {
          qb.addOrderBy('record.date', direction);
          break;
        }
        case 'operation': {
          qb.addOrderBy('operation.operationType', direction);
          break;
        }
        case 'operationResult': {
          qb.addOrderBy('record.operationResponse', direction);
          break;
        }
      }
    }

    qb.select([
      `"record"."recordId" as "recordId"`,
      `"operation"."operationType" as "operation"`,
      `"record"."amount" as "amount"`,
      `"record"."userBalance" as "userBalance"`,
      `"record"."operationResponse" as "operationResult"`,
      `"record"."date" as "date"`,
    ]);
    const total = await qb.getCount();
    qb.skip(skip).take(take);

    return {
      total,
      items: await qb.getRawMany<Record>(),
    };
  }
}
