import { Injectable } from '@nestjs/common';
import { OperationType } from '../../shared/operation-type';
import { OperationsService } from '../services/operations.service';

@Injectable()
export class MultiplicationUsecase {
  constructor(private readonly operationService: OperationsService) {}
  async execute(userId: string, a: number, b: number): Promise<number> {
    const result = a * b;

    await this.operationService.performOperation(
      userId,
      OperationType.multiplication,
      () => Promise.resolve(result.toString()),
    );

    return result;
  }
}
