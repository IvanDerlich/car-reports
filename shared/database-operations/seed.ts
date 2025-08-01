import { DataSource } from 'typeorm';
import { User } from '../../src/users/user.entity';
import { Report } from '../../src/reports/reports.entity';
import { createUsers } from '../data/users';
import { createReports } from '../data/reports';

interface SeedDatabaseOptions {
  options: {
    maxUsers: number;
    reportsPerUser: number;
  };
  dataSource?: DataSource;
}

export const seedDatabase = async ({
  options,
  dataSource,
}: SeedDatabaseOptions) => {
  const { maxUsers, reportsPerUser } = options;
  let ds: DataSource;
  let shouldDestroy = false;

  if (dataSource) {
    ds = dataSource;
  } else {
    // Create new DataSource if none provided
    ds = new DataSource({
      type: 'sqlite',
      database: process.env.DB_NAME || 'db.sqlite',
      entities: [User, Report],
      synchronize: true,
    });
    await ds.initialize();
    shouldDestroy = true; // Mark for destruction since we created it
  }

  try {
    // Create users first
    const users = await createUsers(ds, maxUsers);

    // Create reports for those users
    const reportsCount = await createReports(ds, users, reportsPerUser);

    if (!dataSource) {
      console.log(`Seeded ${users.length} users and ${reportsCount} reports`);
    }
  } finally {
    if (shouldDestroy) {
      await ds.destroy();
    }
  }
};
