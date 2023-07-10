import { OperationRepository } from '@/modules/operations/application/repositories/operation.repository';
import { Operation } from '@/modules/operations/domain/operation';
import { OperationType } from '@/modules/operations/shared/operation-type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operation as OperationTable } from '../entities/operation.entity';

export class OperationTypeormRepository implements OperationRepository {
  constructor(
    @InjectRepository(OperationTable)
    private readonly operationRepository: Repository<OperationTable>,
  ) {}

  async findByOperationType(operationType: OperationType): Promise<Operation> {
    const record = await this.operationRepository
      .createQueryBuilder('operation')
      .andWhere('operation.operationType = :operationType', { operationType })
      .getOne();

    return record ? tableToDomain(record) : undefined;
  }
}

function tableToDomain(operation: OperationTable): Operation {
  return new Operation(
    operation.operationId,
    operation.operationType,
    operation.cost,
  );
}
