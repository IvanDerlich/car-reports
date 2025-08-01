import { DataSource } from 'typeorm';

export const clearDatabase = async (dataSource?: DataSource) => {
  let ds: DataSource;
  let shouldDestroy = false;
  
  if (dataSource) {
    ds = dataSource;
  } else {
    // Create new DataSource if none provided
    ds = new DataSource({
      type: 'sqlite',
      database: process.env.DB_NAME || 'db.sqlite',
      synchronize: true,
    });
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
      console.log(`Deleting table ${table.name}`);
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