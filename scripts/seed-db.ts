import { seedDatabase } from '../shared';

seedDatabase({ options: { maxUsers: 10, reportsPerUser: 10 } })
  .then(() => {
    console.log('Database reseted successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to reset database:', error);
    process.exit(1);
  });
