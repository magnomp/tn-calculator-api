import { DataSource } from 'typeorm';

export const connectionSource = new DataSource({
  migrationsTableName: 'migrations',
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  logging: false,
  synchronize: false,
  name: 'default',
  entities: ['./src/**/**.entity{.ts,.js}'],
  migrations: ['./src/migrations/**/*{.ts,.js}'],
  subscribers: ['./src/subscriber/**/*{.ts,.js}'],
});
