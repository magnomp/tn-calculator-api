import { OperationType } from '../operations/operation-type.enum';
import { Operation } from '../operations/operation.entity';
import { Record } from '../users/record.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { HttpServer, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { NotEnoughBalanceException } from './not-enough-balance.exception';
import * as crypto from 'crypto';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map } from 'rxjs';

const randomStringUrl =
  'https://www.random.org/strings/?num=1&len=8&digits=on&upperalpha=on&loweralpha=on&unique=off&format=plain&rnd=new';

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Operation)
    private readonly operationRepository: Repository<Operation>,
    private readonly userService: UsersService,
    private readonly datasource: DataSource,
    private readonly httpService: HttpService,
  ) {}

  async findByType(operationType: OperationType): Promise<Operation> {
    return await this.operationRepository
      .createQueryBuilder('operation')
      .andWhere('operation.operationType = :operationType', { operationType })
      .getOne();
  }

  private async perform<Type extends number | string>(
    operationType: OperationType,
    userId: string,
    handler: () => Promise<Type>,
  ): Promise<Type> {
    const operation = await this.findByType(operationType);
    const user = await this.userService.findById(userId);

    if (user.balance <= operation.cost)
      throw new NotEnoughBalanceException(user.balance, operation.cost);

    const result = await handler.apply(this);

    await this.datasource.transaction(async (em) => {
      user.balance -= operation.cost;
      await em.save(user);

      const record = new Record();
      record.recordId = crypto.randomUUID();
      record.userId = user.userId;
      record.operationId = operation.operationId;
      record.amount = operation.cost;
      record.userBalance = user.balance;
      record.operationResponse = result.toString();
      record.date = new Date();
      record.isDeleted = false;
      await em.save(record);
    });

    return result;
  }

  async performAddition(userId: string, a: number, b: number): Promise<number> {
    return this.perform(OperationType.addition, userId, () =>
      Promise.resolve(a + b),
    );
  }

  async performSubtraction(
    userId: string,
    a: number,
    b: number,
  ): Promise<number> {
    return this.perform(OperationType.subtraction, userId, () =>
      Promise.resolve(a - b),
    );
  }

  async performDivision(userId: string, a: number, b: number): Promise<number> {
    return this.perform(OperationType.division, userId, () =>
      Promise.resolve(a / b),
    );
  }

  async performMultiplication(
    userId: string,
    a: number,
    b: number,
  ): Promise<number> {
    return this.perform(OperationType.multiplication, userId, () =>
      Promise.resolve(a * b),
    );
  }

  async performSqrt(userId: string, a: number): Promise<number> {
    return this.perform(OperationType.square_root, userId, () =>
      Promise.resolve(Math.sqrt(a)),
    );
  }

  async performRandomString(userId: string): Promise<string> {
    return this.perform(OperationType.random_string, userId, () =>
      lastValueFrom(
        this.httpService.get(randomStringUrl).pipe(map((value) => value.data)),
      ),
    );
  }
}
