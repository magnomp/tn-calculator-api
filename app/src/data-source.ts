import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  logging: false,
  entities: ['./**/*.entity.ts'],
  migrations: ['./migration/*.ts'],
  subscribers: [],
});
