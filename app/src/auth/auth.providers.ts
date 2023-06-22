import { DataSource } from 'typeorm';
import { Session } from './session.entity';

export const authProviders = [
  {
    provide: 'SESSION_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Session),
    inject: ['DATA_SOURCE'],
  },
];
