import { DataSource } from 'typeorm';
import { getDatabaseConfig } from '../../db.config';

const config = getDatabaseConfig();

export const dataSource = new DataSource({
    ...config,
    migrations: [`dev/db/migrations/*.ts`],
});