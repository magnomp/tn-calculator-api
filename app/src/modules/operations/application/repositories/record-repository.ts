import { Record } from '../../domain/record';

export interface RecordRepository {
  save(record: Record): Promise<void>;
  findByRecordId(userId: string, recordId: string): Promise<Record>;
}
