import { UserRepository } from '@/modules/user/application/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Record } from '../../domain/record';
import { OperationType } from '../../shared/operation-type';
import { OperationRepository } from '../repositories/operation.repository';
import { RecordRepository } from '../repositories/record-repository';

@Injectable()
export class OperationsService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: UserRepository,
    @Inject('IOperationRepository')
    private readonly operationRepository: OperationRepository,
    @Inject('IRecordRepository')
    private readonly recordRepository: RecordRepository,
  ) {}
  async performOperation(
    userId: string,
    operationType: OperationType,
    perform: () => Promise<string>,
  ): Promise<void> {
    const user = await this.userRepository.findByUserid(userId);
    const operation = await this.operationRepository.findByOperationType(
      operationType,
    );

    const record = await Record.fromOperation(operation, user, perform);
    await this.recordRepository.save(record);
    await this.userRepository.save(user);
  }
}
