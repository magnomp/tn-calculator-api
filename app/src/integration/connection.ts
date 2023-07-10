import { PostgresConnectionDetails, useDatasource } from '@/data-source';
import { DataSource } from 'typeorm';
import { Client } from 'pg';
import crypto from 'crypto';

let client: Client | undefined;

async function pgClient(): Promise<Client> {
  if (!client) {
    client = new Client({
      host: PostgresConnectionDetails.host,
      port: PostgresConnectionDetails.port,
      user: PostgresConnectionDetails.username,
      password: PostgresConnectionDetails.password,
      database: PostgresConnectionDetails.maintainanceDb,
    });
    await client.connect();
  }

  return client;
}

export async function createNewDatabase(): Promise<DataSource> {
  // 16 random bytes are as unique as a UUID v4
  const name = `tncalc_testdb_${crypto.randomBytes(16).toString('hex')}`;

  const client = await pgClient();
  await client.query(`CREATE DATABASE ${name}`);

  const datasource = useDatasource(name, true);
  return await datasource.initialize();
}

export async function dropDatabase(datasource: DataSource): Promise<void> {
  await datasource.dropDatabase();
  await datasource.destroy();
}
