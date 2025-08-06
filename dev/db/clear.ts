import { DataSource } from 'typeorm';

// Clear database function that can be used in both scripts and tests
export const clearDatabase = async (dataSource: DataSource) => {
  if (!dataSource) {
    throw new Error('DataSource is required');
  }

  try {
    // Get all table names from the database
    const tables = await dataSource.query(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `);

    // Clear each table
    for (const table of tables) {
      await dataSource.query(`DELETE FROM ${table.name}`);
      await dataSource.query(
        `DELETE FROM sqlite_sequence WHERE name='${table.name}'`,
      );
    }

    if (!dataSource) {
      console.log(`Cleared ${tables.length} tables successfully`);
    }
  } catch (error) {
    console.error('Failed to clear database:', error);
    throw error;
  }
};
