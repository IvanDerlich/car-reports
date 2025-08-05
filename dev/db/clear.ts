import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './config';

// Clear database function that can be used in both scripts and tests
export const clearDatabase = async (dataSource?: DataSource) => {
  let ds: DataSource;
  let shouldDestroy = false;

  if (dataSource) {
    ds = dataSource;
  } else {
    // Create new DataSource if none provided
    ds = new DataSource(getDatabaseConfig());
    await ds.initialize();
    shouldDestroy = true;
  }

  try {
    // Get all table names from the database
    const tables = await ds.query(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `);

    // Clear each table
    for (const table of tables) {
      await ds.query(`DELETE FROM ${table.name}`);
      await ds.query(`DELETE FROM sqlite_sequence WHERE name='${table.name}'`);
    }

    if (!dataSource) {
      console.log(`Cleared ${tables.length} tables successfully`);
    }
  } finally {
    if (shouldDestroy) {
      await ds.destroy();
    }
  }
};
