import { DataSource } from 'typeorm';
import { User } from '../../src/users/user.entity';
import { Report } from '../../src/reports/reports.entity';
import {
  RandomReportFactory,
  RandomUserFactory,
  CustomUserFactory,
  CustomReportFactory,
} from './factories';
import { usersFixtures } from './fixtures/users';
import { reportsFixtures } from './fixtures/reports';

// Seeder function that requires a DataSource
export const seedDatabase = async (dataSource: DataSource) => {
  // Create 10 random users with random user factory
  const randomUsers = await RandomUserFactory.makeMany(10);

  // Create 10 custom users
  const customUsers = await CustomUserFactory.makeMany(usersFixtures);

  const users = [...randomUsers, ...customUsers];

  // Save users to database
  await dataSource.getRepository(User).save(users);
  console.log(`Created ${users.length} users`);

  // Create 10 reports with random data
  const randomReports: Report[] = await RandomReportFactory.makeMany(10, users);

  // Create 10 reports with custom data
  const customReports: Report[] = await CustomReportFactory.makeMany(
    reportsFixtures,
    users,
  );

  const reports: Report[] = [...randomReports, ...customReports];

  // Save reports to database
  await dataSource.getRepository(Report).save(reports);
  console.log(`Created ${reports.length} reports`);
};
