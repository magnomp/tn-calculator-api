import { RecordDto } from './record.dto';

export interface RecordsPaginationResultDto {
  total: number;
  page: RecordDto[];
}
