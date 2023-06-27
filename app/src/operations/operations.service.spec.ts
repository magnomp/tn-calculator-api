import { Test, TestingModule } from '@nestjs/testing';
import { OperationsService } from './operations.service';
import sinon from 'sinon';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Operation } from './operation.entity';
import { UsersService } from '../users/users.service';
import { HttpService } from '@nestjs/axios';
import { OperationType } from './operation-type.enum';
import { User } from '../users/user.entity';
import { OperationsQuery } from './operations.query';
import { NotEnoughBalanceException } from './not-enough-balance.exception';

interface TestCase {
  operationType: OperationType;
  expectedResult: number | string;
  perform: (
    userId: string,
    service: OperationsService,
  ) => Promise<number | string>;
}

const testCases: TestCase[] = [
  {
    operationType: OperationType.addition,
    expectedResult: 3,
    perform: (userId, service) => service.performAddition(userId, 1, 2),
  },
];

describe('OperationsService', () => {
  let service: OperationsService;
  let operationsRepository: sinon.SinonStubbedInstance<Repository<Operation>>;
  let userService: sinon.SinonStubbedInstance<UsersService>;
  let datasource: sinon.SinonStubbedInstance<DataSource>;
  let httpService: sinon.SinonStubbedInstance<HttpService>;
  let operationsQuery: sinon.SinonStubbedInstance<OperationsQuery>;

  beforeEach(async () => {
    operationsRepository =
      sinon.createStubInstance<Repository<Operation>>(Repository);
    userService = sinon.createStubInstance(UsersService);
    datasource = sinon.createStubInstance(DataSource);
    httpService = sinon.createStubInstance(HttpService);
    operationsQuery = sinon.createStubInstance(OperationsQuery);

    service = new OperationsService(
      operationsRepository,
      userService,
      datasource,
      httpService,
      operationsQuery,
    );
  });

  afterEach(() => {
    sinon.reset();
  });

  testCases.forEach((tc) => {
    describe(tc.operationType, () => {
      it('Must reject if user doesn`t have enough balance', async () => {
        const user = new User();
        user.userId = 'a';
        user.balance = 10;
        userService.findById.withArgs(user.userId).resolves(user);

        const operation = new Operation();
        operation.operationId = 'b';
        operation.cost = 20;
        operation.operationType = tc.operationType;

        operationsQuery.findByType
          .withArgs(tc.operationType)
          .resolves(operation);

        await expect(() => tc.perform(user.userId, service)).rejects.toThrow(
          NotEnoughBalanceException,
        );
      });

      it('Must return calculation result if there`s balance', async () => {
        const user = new User();
        user.userId = 'a';
        user.balance = 30;
        userService.findById.withArgs(user.userId).resolves(user);

        const operation = new Operation();
        operation.operationId = 'b';
        operation.cost = 20;
        operation.operationType = tc.operationType;

        operationsQuery.findByType
          .withArgs(tc.operationType)
          .resolves(operation);

        const result = await tc.perform(user.userId, service);

        expect(result).toBe(tc.expectedResult);
      });
    });
  });
});
