import { targetReportData, reportsData } from './fixtures/reports';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { clearDatabase } from '../dev/db/clear';

describe('Reports', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let adminUserData = {
    email: 'admin@admin.com',
    password: '123456',
    admin: true,
  };
  let userData = {
    email: 'test@test.com',
    password: '123456',
    admin: false,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
    await clearDatabase(dataSource);
  });

  // Try to create a report while being logged in
  it('should create a report while being logged in', async () => {
    // Create a non admin user and save the cookie
    let response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userData)
      .expect(201)
      .expect({
        email: 'test@test.com',
        id: 1,
        admin: false,
      });

    const cookie = response.get('Set-Cookie');

    if (!cookie) {
      throw new Error('Cookie is undefined');
    }

    // Create a report
    response = await request(app.getHttpServer())
      .post('/reports')
      .set('Cookie', cookie)
      .send(targetReportData)
      .expect(201)
      .expect({
        ...targetReportData,
        approved: false,
        userId: 1,
        id: 1,
      });
  });

  // Try to create a report without being logged in and thorw unauthorized error
  it('should throw unauthorized error when creating a report without being logged in', async () => {
    await request(app.getHttpServer())
      .post('/reports')
      .send(targetReportData)
      .expect(401);
  });

  // Approve a report
  it('should approve a report and then reject it', async () => {
    // Create an admin user
    let response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(adminUserData)
      .expect(201)
      .expect({
        email: adminUserData.email,
        id: 1,
        admin: true,
      });

    // Save the cookie
    let cookie = response.get('Set-Cookie');

    if (!cookie) {
      throw new Error('Cookie is undefined');
    }

    // Create a report
    response = await request(app.getHttpServer())
      .post('/reports')
      .set('Cookie', cookie)
      .send(targetReportData)
      .expect(201)
      .expect({
        ...targetReportData,
        approved: false,
        userId: 1,
        id: 1,
      });

    // Approve the report
    response = await request(app.getHttpServer())
      .patch('/reports/1')
      .set('Cookie', cookie)
      .send({ approved: true })
      .expect(200)
      .expect({
        ...targetReportData,
        approved: true,
        userId: 1,
        id: 1,
      });

    // Reject the report
    response = await request(app.getHttpServer())
      .patch('/reports/1')
      .set('Cookie', cookie)
      .send({ approved: false })
      .expect(200)
      .expect({
        ...targetReportData,
        approved: false,
        userId: 1,
        id: 1,
      });

    // Create a new user
    response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userData)
      .expect(201)
      .expect({
        email: 'test@test.com',
        id: 2,
        admin: false,
      });

    cookie = response.get('Set-Cookie');

    if (!cookie) {
      throw new Error('Cookie is undefined');
    }

    // Try to approve a report and expect 401
    response = await request(app.getHttpServer())
      .patch('/reports/1')
      .set('Cookie', cookie)
      .send({ approved: true })
      .expect(403);
  });

  /*
     Get an estimate for a report with the several reports
     - Avarage has to be done with the 3 closest reports
     - Check the average excludes the 4th report in it's calculation
  */
  describe('Get an estimate for a report', () => {
    beforeEach(async () => {
      // Create an admin user
      let response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(adminUserData)
        .expect(201)
        .expect({
          email: adminUserData.email,
          id: 1,
          admin: true,
        });

      // Save the cookie
      let cookie = response.get('Set-Cookie');

      if (!cookie) {
        throw new Error('Cookie is undefined');
      }

      // Create many reports with reportsData
      for (const report of reportsData) {
        // console.log('report: ', report);
        await request(app.getHttpServer())
          .post('/reports')
          .set('Cookie', cookie)
          .send(report)
          .expect(201);
      }
    });

    it.only('should get an estimate for a report', async () => {
      const response = await request(app.getHttpServer()).get(
        `/reports?make=${targetReportData.make}&model=${targetReportData.model}&year=${targetReportData.year}&lng=${targetReportData.lng}&lat=${targetReportData.lat}&mileage=${targetReportData.mileage}`,
      );
      console.log('response: ', response.body);
      //   .expect(200);
    });
  });
});
