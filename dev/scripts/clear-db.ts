import { clearDatabase } from '../db/clear';

clearDatabase()
  .then(() => {
    console.log('Database cleared successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to clear database:', error);
    process.exit(1);
  });
