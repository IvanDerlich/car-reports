import { DataSourceOptions } from 'typeorm';

// Simple database configuration
export const getDatabaseConfig = (): DataSourceOptions => {
  const isTest = process.env.NODE_ENV === 'test';

  return {
    type: 'sqlite',
    database: isTest ? 'db.test.sqlite' : 'db.sqlite',
    synchronize: true,
    logging: false,
  };
};
