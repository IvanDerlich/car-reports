import { DataSource } from 'typeorm';
import { clearDatabase } from '../db/clear';
import { seedDatabase } from '../db/seed';
import { getDatabaseConfig } from '../db/config';

const resetDatabaseScript = async () => {
  let dataSource: DataSource | undefined;
  try {
    dataSource = new DataSource(getDatabaseConfig());
    await dataSource.initialize();
    await clearDatabase(dataSource);
    await seedDatabase(dataSource);
    } catch (error) {
    console.error('Failed to reset database:', error);
    throw error;
  } finally {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
};

resetDatabaseScript()
  .then(() => {
    console.log('Database reset successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to reset database:', error);
    process.exit(1);
  });