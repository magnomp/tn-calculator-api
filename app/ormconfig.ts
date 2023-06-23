import 'dotenv/config';
import { DataSource } from 'typeorm';

export const connectionSource = new DataSource({
  migrationsTableName: 'migrations',
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  logging: false,
  synchronize: false,
  name: 'default',
  entities: ['./src/**/**.entity{.ts,.js}'],
  migrations: ['./src/migrations/**/*{.ts,.js}'],
  subscribers: ['./src/subscriber/**/*{.ts,.js}'],
});
