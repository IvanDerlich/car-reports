import { DataSourceOptions } from 'typeorm';
import { User } from './src/users/user.entity';
import { Report } from './src/reports/reports.entity';

// Simple database configuration
export const getDatabaseConfig = (): DataSourceOptions => {
  const database = process.env.DB_NAME;

  if (!database) {
    throw Error('Database path not present');
  }

  return {
    type: 'sqlite',
    database,
    // synchronize: true,
    logging: false,
    entities: [User, Report],
  };
};
