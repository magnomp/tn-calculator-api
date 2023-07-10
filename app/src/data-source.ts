import 'dotenv/config';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';

export const PostgresConnectionDetails = {
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  maintainanceDb: 'postgres',
};

export function useDatasourceOptions(
  database: string,
  dropSchema: boolean,
): DataSourceOptions {
  return {
    type: 'postgres',
    logging: false,
    host: PostgresConnectionDetails.host,
    port: PostgresConnectionDetails.port,
    username: PostgresConnectionDetails.username,
    password: PostgresConnectionDetails.password,
    database,
    migrationsRun: true,
    dropSchema,
    migrationsTableName: 'migrations',
    migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
    entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
  };
}

export function useDatasource(
  database: string,
  dropSchema: boolean,
): DataSource {
  return new DataSource(useDatasourceOptions(database, dropSchema));
}
