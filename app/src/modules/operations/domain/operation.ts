import { OperationType } from '../shared/operation-type';

export class Operation {
  constructor(
    public readonly operationId: string,
    public readonly operationType: OperationType,
    public readonly cost: number,
  ) {}
}
