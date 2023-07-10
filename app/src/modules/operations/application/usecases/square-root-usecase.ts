import { Injectable } from '@nestjs/common';
import { OperationType } from '../../shared/operation-type';
import { OperationsService } from '../services/operations.service';

@Injectable()
export class SqrtUsecase {
  constructor(private readonly operationService: OperationsService) {}
  async execute(userId: string, x: number): Promise<number> {
    const result = Math.sqrt(x);

    await this.operationService.performOperation(
      userId,
      OperationType.square_root,
      () => Promise.resolve(result.toString()),
    );

    return result;
  }
}
