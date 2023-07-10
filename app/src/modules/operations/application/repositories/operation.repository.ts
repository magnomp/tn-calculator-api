import { Operation } from '../../domain/operation';
import { OperationType } from '../../shared/operation-type';

export interface OperationRepository {
  findByOperationType(operationType: OperationType): Promise<Operation>;
}
