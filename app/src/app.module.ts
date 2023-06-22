import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import path = require('path');
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OperationsModule } from './operations/operations.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      migrationsTableName: 'migrations',
      migrations: ['src/migration/*.ts'],
      entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
    }),
    UsersModule,
    AuthModule,
    OperationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
