import { AuthModule } from '../../auth/infra/auth.module';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/user.entity';
import { UserRepositoryTypeOrm } from './typeorm/user.typeorm.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    //forwardRef(() => AuthModule),
    JwtModule,
  ],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: UserRepositoryTypeOrm,
    },
  ],
  exports: ['IUserRepository'],
  controllers: [],
})
export class UsersModule {}
