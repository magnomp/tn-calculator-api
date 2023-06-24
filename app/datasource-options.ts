import * as path from 'path';
import { DataSourceOptions } from 'typeorm';
import 'dotenv/config';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  migrationsRun: true,
  migrationsTableName: 'migrations',
  migrations: ['build/src/migrations/*.js'],
  entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
};
