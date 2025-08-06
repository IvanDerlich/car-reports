import { DataSource } from 'typeorm';

// Clear database function that can be used in both scripts and tests
export const clearDatabase = async (dataSource: DataSource) => {
  if (!dataSource) {
    throw new Error('DataSource is required');
  }

  try {
    // Keep the order because of foreign key constraints = report depends on user
    const tables = ['report', 'user'];

    // Clear each table
    for (const table of tables) {
      await dataSource.query(`DELETE FROM ${table}`);
      await dataSource.query(
        `DELETE FROM sqlite_sequence WHERE name='${table}'`,
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
