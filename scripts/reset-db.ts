import { seedDatabase, clearDatabase } from '../shared';

clearDatabase()
  .then(() => {
    console.log('Database cleared successfully!');
    seedDatabase({ options: { maxUsers: 10, reportsPerUser: 10 } })
      .then(() => {
        console.log('Database reseted successfully!');
      })
      .catch((error) => {
        console.error('Failed to reset database:', error);
      });
  })
  .catch((error) => {
    console.error('Failed to clear database:', error);
  });
