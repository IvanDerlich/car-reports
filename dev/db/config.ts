import { DataSourceOptions } from 'typeorm';
import { User } from '../../src/users/user.entity';
import { Report } from '../../src/reports/reports.entity';

// Simple database configuration
export const getDatabaseConfig = (): DataSourceOptions => {
  const isTest = process.env.NODE_ENV === 'test';

  return {
    type: 'sqlite',
    database: isTest ? 'db.test.sqlite' : 'db.sqlite',
    synchronize: true,
    logging: false,
    entities: [User, Report],
  };
};
