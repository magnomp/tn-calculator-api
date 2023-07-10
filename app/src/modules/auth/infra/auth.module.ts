import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../../user/infra/users.module';
import { AuthController } from './http/auth.controller';
import { Session } from './typeorm/session.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticateUsecase } from '../application/usecases/authenticate.usecase';
import { RefreshTokenUsecase } from '../application/usecases/refresh-token.usecase';
import { LogoutUsecase } from '../application/usecases/logout.usecase';
import { SessionRepositoryTypeOrm } from './typeorm/session.typeorm.repository';
import { User } from '../../user/infra/typeorm/user.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Session, User]),
    JwtModule.register({
      secret: 'my jwt secret',
      signOptions: {
        expiresIn: '1m',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthenticateUsecase,
    RefreshTokenUsecase,
    LogoutUsecase,
    {
      provide: 'ISessionRepository',
      useClass: SessionRepositoryTypeOrm,
    },
  ],
  exports: [],
})
export class AuthModule {}
