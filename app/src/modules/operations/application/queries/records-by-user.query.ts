import { OrderBy } from '@/shared/orderby';
import { PaginatedResult } from '@/shared/paginated-list';
import { Where } from '@/shared/where';
import { OperationType } from '../../shared/operation-type';

export class Record {
  constructor(
    public recordId: string,
    public operation: OperationType,
    public amount: number,
    public userBalance: number,
    public operationResult: string,
    public date: Date,
  ) {}
}

export interface RecordsByUserQuery {
  execute(
    userId: string,
    skip: number,
    take: number,
    where: Where<Record>,
    orderBy: OrderBy<Record>,
  ): Promise<PaginatedResult<Record>>;
}
