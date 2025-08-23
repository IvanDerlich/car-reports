import { DataSourceOptions } from 'typeorm';
import { User } from './src/users/user.entity';
import { Report } from './src/reports/reports.entity';

// Simple database configuration
export const getDatabaseConfig = (): DataSourceOptions => {
  const database = process.env.DB_NAME;
  if (!database) {
    throw Error('Database path not present');
  }

  let config: DataSourceOptions = {
    type: 'sqlite',
    database,
    synchronize: false,
    logging: false,
    entities: [User, Report],
    migrations: [`dev/db/migrations/*.${process.env.NODE_ENV === 'test' ? 'ts' : 'js'}`],
    migrationsRun: process.env.NODE_ENV === 'test',
  };

  return config;
};
