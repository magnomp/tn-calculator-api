import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/infra/auth.module';
import { OperationsModule } from './modules/operations/infra/operations.module';
import { UsersModule } from './modules/user/infra/users.module';
import { AppController } from './app.controller';
import { useDatasourceOptions } from './data-source';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forRoot(useDatasourceOptions(process.env.POSTGRES_DB, false)),
    UsersModule,
    AuthModule,
    OperationsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
