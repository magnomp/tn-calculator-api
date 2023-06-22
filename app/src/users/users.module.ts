import { AuthModule } from '../auth/auth.module';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { Record } from './record.entity';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Record]),
    forwardRef(() => AuthModule),
    JwtModule,
  ],
  providers: [UsersService, RecordsService],
  exports: [UsersService, RecordsService],
  controllers: [RecordsController],
})
export class UsersModule {}
