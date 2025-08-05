import { setSeederFactory } from 'typeorm-extension';
import { Report } from '../../../../src/reports/reports.entity';
import { faker } from '@faker-js/faker';

export const ReportFactory = setSeederFactory(Report, () => {
  const report = new Report();
  report.make = faker.vehicle.manufacturer();
  report.model = faker.vehicle.model();
  report.year = faker.date.past().getFullYear();
  report.lng = faker.location.longitude();
  report.lat = faker.location.latitude();
  report.mileage = faker.number.int({ min: 10000, max: 100000 });
  report.approved = faker.datatype.boolean();
  report.price = faker.number.int({ min: 10000, max: 100000 });
  return report;
});
