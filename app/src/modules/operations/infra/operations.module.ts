import { User } from '../../user/infra/typeorm/user.entity';
import { UsersModule } from '../../user/infra/users.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operation } from './typeorm/entities/operation.entity';
import { OperationsController } from './http/operations.controller';
import { AuthModule } from '../../auth/infra/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { AdditionUsecase } from '../application/usecases/addition-usecase';
import { OperationsService } from '../application/services/operations.service';
import { OperationTypeormRepository } from './typeorm/repositories/operation.typeorm.repository';
import { RecordRepositoryTypeorm } from './typeorm/repositories/record.typeorm.repository';
import { SubtractionUsecase } from '../application/usecases/subtraction-usecase';
import { MultiplicationUsecase } from '../application/usecases/multiplication-usecase';
import { DivisionUsecase } from '../application/usecases/division-usecase';
import { SqrtUsecase } from '../application/usecases/square-root-usecase';
import { RandomStringUsecase } from '../application/usecases/random-string-usecase';
import { RecordsController } from './http/records.controller';
import { DeleteRecordUsecase } from '../application/usecases/delete-record.usecase';
import { RecordsByUserQueryTypeOrm } from './typeorm/queries/records-by-user.typeorm.query';
import { Record } from './typeorm/entities/record.entity';

@Module({
  imports: [
    UsersModule,
    HttpModule,
    TypeOrmModule.forFeature([User, Operation, Record]),
    AuthModule,
    JwtModule,
  ],
  providers: [
    OperationsService,
    AdditionUsecase,
    SubtractionUsecase,
    MultiplicationUsecase,
    DivisionUsecase,
    SqrtUsecase,
    RandomStringUsecase,
    DeleteRecordUsecase,
    {
      provide: 'IOperationRepository',
      useClass: OperationTypeormRepository,
    },
    {
      provide: 'IRecordRepository',
      useClass: RecordRepositoryTypeorm,
    },
    {
      provide: 'IRecordsByUserQuery',
      useClass: RecordsByUserQueryTypeOrm,
    },
    {
      provide: 'randomOrgEndpoint',
      useValue: 'https://random.org',
    },
  ],
  controllers: [OperationsController, RecordsController],
})
export class OperationsModule {}
