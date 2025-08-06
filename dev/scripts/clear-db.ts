import { clearDatabase } from '../db/clear';
import { DataSource } from 'typeorm';
import { getDatabaseConfig } from '../db/config';

const clearDatabaseScript = async () => {
  let dataSource: DataSource | undefined;
  try {
    dataSource = new DataSource(getDatabaseConfig());
    await dataSource.initialize();
    await clearDatabase(dataSource);
  } catch (error) {
    console.error('Failed to clear database:', error);
    throw error;
  } finally {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
};

clearDatabaseScript()
  .then(() => {
    console.log('Database cleared successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to clear database:', error);
    process.exit(1);
  });
