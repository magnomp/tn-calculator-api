import { RecordRepository } from '@/modules/operations/application/repositories/record-repository';
import { Record } from '@/modules/operations/domain/record';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record as RecordTable } from '../entities/record.entity';

@Injectable()
export class RecordRepositoryTypeorm implements RecordRepository {
  constructor(
    @InjectRepository(RecordTable)
    private readonly typeormRepository: Repository<RecordTable>,
  ) {}
  async save(record: Record): Promise<void> {
    this.typeormRepository.save(record);
  }

  async findByRecordId(userId: string, recordId: string): Promise<Record> {
    const record = await this.typeormRepository
      .createQueryBuilder('record')
      .andWhere('record.recordId = :recordId', { recordId })
      .andWhere('record.isDeleted = false')
      .andWhere('record.userId = :userId', { userId })
      .getOne();

    return record
      ? new Record(
          record.recordId,
          record.userId,
          record.operationId,
          record.amount,
          record.userBalance,
          record.operationResponse,
          record.date,
          record.isDeleted,
        )
      : undefined;
  }
}
