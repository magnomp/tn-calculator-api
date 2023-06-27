import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OperationType } from './operation-type.enum';
import { Operation } from './operation.entity';

@Injectable()
export class OperationsQuery {
  constructor(
    @InjectRepository(Operation)
    private readonly operationRepository: Repository<Operation>,
  ) {}

  async findByType(operationType: OperationType): Promise<Operation> {
    return await this.operationRepository
      .createQueryBuilder('operation')
      .andWhere('operation.operationType = :operationType', { operationType })
      .getOne();
  }
}
