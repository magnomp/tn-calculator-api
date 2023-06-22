import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecordDto } from './dto/record.dto';
import { RecordsRequestDto } from './dto/records-request.dto';
import { Record } from './record.entity';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  async deleteRecord(userId: string, recordId: string): Promise<boolean> {
    const result = await this.recordRepository
      .createQueryBuilder('record')
      .delete()
      .from(Record)
      .where(
        'record."recordId" = :recordId and record."userId" = :userId and record."isDeleted" = false',
        { recordId, userId },
      )
      .execute();
    return result.affected > 0;
  }

  async listRecords(
    userId: string,
    request: RecordsRequestDto,
  ): Promise<RecordDto[]> {
    console.log(request);
    const qb = this.recordRepository
      .createQueryBuilder('record')
      .andWhere('record.isDeleted = false')
      .andWhere('record.userId = :userId', { userId })
      .leftJoinAndSelect('record.operation', 'operation')
      .skip(request.skip)
      .take(request.take)
      .orderBy('record.date');

    if (request.operationType) {
      qb.andWhere('operation.operationType = :operationType', {
        operationType: request.operationType,
      });
    }

    const records = await qb.getMany();
    return records.map((r) => ({
      recordId: r.recordId,
      operationId: r.operationId,
      operationType: r.operation.operationType,
      userBalance: r.userBalance,
      amount: r.amount,
      response: r.operationResponse,
      date: r.date.toISOString(),
    }));
  }
}
