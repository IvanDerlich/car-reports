import { setSeederFactory } from 'typeorm-extension';
import { Report } from '../../../../src/reports/reports.entity';

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
export const createCustomReport = (customData: CustomReportData): Report => {
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

// Standard factory for typeorm-extension (uses faker)
export const ReportsCustomFactory = setSeederFactory(Report, () => {
  // This factory can be used with typeorm-extension's standard pattern
  // For custom data, use createCustomReport function directly
  const report = new Report();
  report.make = 'Toyota';
  report.model = 'Camry';
  report.year = 2020;
  report.lng = -122.4194;
  report.lat = 37.7749;
  report.mileage = 50000;
  report.approved = false;
  report.price = 25000;
  return report;
});
