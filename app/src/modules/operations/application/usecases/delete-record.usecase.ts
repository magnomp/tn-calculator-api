import { EntityNotFoundException } from '@/shared/entity-not-found.exception';
import { Inject, Injectable } from '@nestjs/common';
import { RecordRepository } from '../repositories/record-repository';

@Injectable()
export class DeleteRecordUsecase {
  constructor(
    @Inject('IRecordRepository')
    private readonly recordRepository: RecordRepository,
  ) {}

  async execute(userId: string, recordId: string): Promise<void> {
    const record = await this.recordRepository.findByRecordId(userId, recordId);
    if (!record) throw new EntityNotFoundException();
    record.markAsDeleted();
    await this.recordRepository.save(record);
  }
}
