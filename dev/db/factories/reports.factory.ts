import { setSeederFactory } from 'typeorm-extension';
import { Report } from '../../../src/reports/reports.entity';
import { faker } from '@faker-js/faker';

// Type for custom report data
export type CustomReportData = {
  make: string;
  model: string;
  year: number;
  lng: number;
  lat: number;
  mileage: number;
  approved?: boolean;
  price: number;
  userId: number;
};

// Custom factory function that can accept custom data
export const CustomReportFactory = (customData: CustomReportData): Report => {
  const report = new Report();
  report.make = customData.make;
  report.model = customData.model;
  report.year = customData.year;
  report.lng = customData.lng;
  report.lat = customData.lat;
  report.mileage = customData.mileage;
  report.approved = customData.approved ?? false;
  report.price = customData.price;
  // Note: userId will be set when saving to database
  return report;
};

export const RandomReportFactory = setSeederFactory(Report, () => {
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
