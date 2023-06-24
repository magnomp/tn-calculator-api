import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operation } from './operation.entity';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    UsersModule,
    HttpModule,
    TypeOrmModule.forFeature([User, Operation]),
    AuthModule,
    JwtModule,
  ],
  providers: [OperationsService],
  exports: [OperationsService],
  controllers: [OperationsController],
})
export class OperationsModule {}
