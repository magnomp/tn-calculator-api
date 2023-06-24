import { dataSourceOptions } from './datasource-options';
import { DataSource } from 'typeorm';

export const connectionSource = new DataSource(dataSourceOptions);
