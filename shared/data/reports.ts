// shared/seeds/data/reports.ts
import { DataSource } from 'typeorm';
import { Report } from '../../src/reports/reports.entity';
import { User } from '../../src/users/user.entity';
import { faker } from '@faker-js/faker';

export const createReports = async (
  dataSource: DataSource,
  users: User[],
  reportsPerUser = 3,
): Promise<number> => {
  const reportRepository = dataSource.getRepository(Report);

  // Create test reports for each user
  let reportsCount = 0;
  for (const user of users) {
    for (let i = 1; i <= reportsPerUser; i++) {
      const report = reportRepository.create({
        user: user,
        make: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        year: faker.date.past().getFullYear(),
        lng: faker.location.longitude(),
        lat: faker.location.latitude(),
        mileage: faker.number.int({ min: 10000, max: 100000 }),
        approved: faker.datatype.boolean(),
        price: faker.number.int({ min: 10000, max: 100000 }),
      });
      await reportRepository.save(report);
      reportsCount++;
    }
  }

  return reportsCount;
};
