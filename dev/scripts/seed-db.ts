import { DataSource } from 'typeorm';
import { seedDatabase } from '../db/seed';
import { getDatabaseConfig } from '../../db.config';

const seedDatabaseScript = async () => {
  let dataSource: DataSource | undefined;

  try {
    // Create DataSource
    dataSource = new DataSource(getDatabaseConfig());
    await dataSource.initialize();

    // Seed database
    await seedDatabase(dataSource);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Failed to seed database:', error);
    throw error;
  } finally {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
};

seedDatabaseScript()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed database:', error);
    process.exit(1);
  });
