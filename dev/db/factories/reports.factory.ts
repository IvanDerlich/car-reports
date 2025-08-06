import { Report } from '../../../src/reports/reports.entity';
import { User } from '../../../src/users/user.entity';
import { CustomReportData } from '../types';
import { faker } from '@faker-js/faker';

// Custom factory function that can accept custom data
export class CustomReportFactory {
  static async make(customData: CustomReportData, user: User): Promise<Report> {
    const report = new Report();
    report.make = customData.make;
    report.model = customData.model;
    report.year = customData.year;
    report.lng = customData.lng;
    report.lat = customData.lat;
    report.mileage = customData.mileage;
    report.approved = customData.approved ?? false;
    report.price = customData.price;
    report.user = user;
    return report;
  }

  static async makeMany(customData: CustomReportData[], users: User[]): Promise<Report[]> {
    const reports: Report[] = [];
    for (const data of customData) {
      reports.push(await this.make(data, faker.helpers.arrayElement(users)));
    }
    return reports;
  }
}

export class RandomReportFactory {
  static async make(user: User): Promise<Report> {
    const report = new Report();
    report.make = faker.vehicle.manufacturer();
    report.model = faker.vehicle.model();
    report.year = faker.date.past().getFullYear();
    report.lng = faker.location.longitude();
    report.lat = faker.location.latitude();
    report.mileage = faker.number.int({ min: 10000, max: 100000 });
    report.approved = faker.datatype.boolean();
    report.price = faker.number.int({ min: 10000, max: 100000 });
    report.user = user;
    return report;
  }

  static async makeMany(count: number, users: User[]): Promise<Report[]> {
    const reports: Report[] = [];
    for (let i = 0; i < count; i++) {
      reports.push(await this.make(faker.helpers.arrayElement(users)));
    }
    return reports;
  }
}