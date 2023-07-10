import { useDatasource } from '@/data-source';

export const connectionSource = useDatasource(process.env.POSTGRES_DB, false);
