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
  const adminUserData = {
    email: 'admin@admin.com',
    password: '123456',
    admin: true,
  };
  const userData = {
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

  it('Throws unauthorized error if the user is not logged in and tries to get a single report', async () => {
    await request(app.getHttpServer()).get('/reports/1').expect(401);
  });

  it('Throws unauthorized error if the user is not logged in and tries to get all reports', async () => {
    await request(app.getHttpServer()).get('/reports/all').expect(401);
  });

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
  });

  it('should throw forbidden error when non-admin user tries to approve a report', async () => {
    // Create a non-admin user
    let response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userData)
      .expect(201)
      .expect({
        email: 'test@test.com',
        id: 1,
        admin: false,
      });

    let cookie = response.get('Set-Cookie');

    if (!cookie) {
      throw new Error('Cookie is undefined');
    }

    // Create a report with non-admin user
    response = await request(app.getHttpServer())
      .post('/reports')
      .set('Cookie', cookie)
      .send(targetReportData)
      .expect(201);

    // Try to approve a report with non-admin user and expect 403
    response = await request(app.getHttpServer())
      .patch('/reports/1')
      .set('Cookie', cookie)
      .send({ approved: true })
      .expect(403);

    // Try to reject a report with non-admin user and expect 403
    response = await request(app.getHttpServer())
      .patch('/reports/1')
      .set('Cookie', cookie)
      .send({ approved: false })
      .expect(403);
  });

  /*
     Get an estimate for a report with the several reports
     - Avarage has to be done with the 3 closest reports
     - Check the average excludes the 4th report in it's calculation
  */
  describe('Get an estimate for a report', () => {
    let cookie: string[] | undefined;
    beforeEach(async () => {
      // Create an admin user
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(adminUserData)
        .expect(201)
        .expect({
          email: adminUserData.email,
          id: 1,
          admin: true,
        });

      // Save the cookie
      cookie = response.get('Set-Cookie') || [''];

      if (!cookie) {
        throw new Error('Cookie is undefined');
      }

      // Create many reports with reportsData and approve them
      for (const report of reportsData) {
        const response = await request(app.getHttpServer())
          .post('/reports')
          .set('Cookie', cookie)
          .send(report)
          .expect(201);

        await request(app.getHttpServer())
          .patch(`/reports/${response.body.id}`)
          .set('Cookie', cookie)
          .send({ approved: true })
          .expect(200);
      }
    });

    it('should get all reports', async () => {
      let response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(userData)
        .expect(201)
        .expect({
          email: 'test@test.com',
          id: 2,
          admin: false,
        });

      const cookie = response.get('Set-Cookie');

      if (!cookie) {
        throw new Error('Cookie is undefined');
      }

      response = await request(app.getHttpServer())
        .get('/reports/all')
        .set('Cookie', cookie)
        .expect(200);
      expect(response.body).toMatchObject(reportsData);
    });

    it('should get a report by id', async () => {
      let response = await request(app.getHttpServer())
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

      response = await request(app.getHttpServer())
        .get('/reports/1')
        .set('Cookie', cookie)
        .expect(200);
      expect(response.body).toMatchObject(reportsData[0]);

      response = await request(app.getHttpServer())
        .get('/reports/2')
        .set('Cookie', cookie)
        .expect(200);
      expect(response.body).toMatchObject(reportsData[1]);

      response = await request(app.getHttpServer())
        .get('/reports/3')
        .set('Cookie', cookie)
        .expect(200);
      expect(response.body).toMatchObject(reportsData[2]);

      response = await request(app.getHttpServer())
        .get('/reports/4')
        .set('Cookie', cookie)
        .expect(200);
      expect(response.body).toMatchObject(reportsData[3]);
    });

    it('should get an estimate for a report', async () => {
      const adminUserData2 = {
        email: 'testtest32@aoeuao.com',
        password: 'aoeuaoeaoeuao',
        admin: true,
      };

      let response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(adminUserData2)
        .expect(201)
        .expect({
          id: 2,
          email: adminUserData2.email,
          admin: adminUserData2.admin,
        });

      let cookie = response.get('Set-Cookie');

      if (!cookie) {
        throw new Error('Cookie is undefined');
      }
      const URI = `/reports?make=${targetReportData.make}&model=${targetReportData.model}&year=${targetReportData.year}&lng=${targetReportData.lng}&lat=${targetReportData.lat}&mileage=${targetReportData.mileage}`;
      response = await request(app.getHttpServer())
        .get(URI)
        .set('Cookie', cookie)
        .expect(200);
      const targetReportAvgPrice = 10020;

      expect(response.body.avgPrice).toBe(targetReportAvgPrice);

      if (!cookie) {
        throw new Error('Cookie is undefined');
      }

      /*
        Create a report the same as the targetReportData but with a different
        mileage and it will be the 4th report and it will be the farthest from the targetReportData
        and it will be the one that will be excluded from the average calculation
      */
      response = await request(app.getHttpServer())
        .post('/reports')
        .set('Cookie', cookie)
        .send({ ...targetReportData, mileage: 999999 });

      // Approve the report
      await request(app.getHttpServer())
        .patch(`/reports/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ approved: true })
        .expect(200);

      // Get the estimate again and expect the average price to be the same
      // because the 4th report is excluded from the average calculation
      response = await request(app.getHttpServer())
        .get(URI)
        .set('Cookie', cookie)
        .expect(200);
      expect(response.body.avgPrice).toBe(targetReportAvgPrice);

      // Different make
      response = await request(app.getHttpServer())
        .post('/reports')
        .set('Cookie', cookie)
        .send({ ...targetReportData, make: 'Toyota' });

      // console.log(cookie);

      // da a whaami to see if the user is an admin or not

      // response = await request(app.getHttpServer())
      //   .get('/auth/whoami')
      //   .set('Cookie', cookie)
      //   .expect(200);
      // console.log('whaami response: ', response.body);

      await request(app.getHttpServer())
        .patch(`/reports/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ approved: true })
        .expect(200);

      response = await request(app.getHttpServer())
        .get(URI)
        .set('Cookie', cookie)
        .expect(200);
      expect(response.body.avgPrice).toBe(targetReportAvgPrice);

      // Different model
      response = await request(app.getHttpServer())
        .post('/reports')
        .set('Cookie', cookie)
        .send({ ...targetReportData, model: 'Camry' });

      await request(app.getHttpServer())
        .patch(`/reports/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ approved: true })
        .expect(200);
      response = await request(app.getHttpServer())
        .get(URI)
        .set('Cookie', cookie)
        .expect(200);
      expect(response.body.avgPrice).toBe(targetReportAvgPrice);

      // Longitude greater than max
      response = await request(app.getHttpServer())
        .post('/reports')
        .set('Cookie', cookie)
        .send({ ...targetReportData, lng: 16 });

      await request(app.getHttpServer())
        .patch(`/reports/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ approved: true })
        .expect(200);
      response = await request(app.getHttpServer())
        .get(URI)
        .set('Cookie', cookie)
        .expect(200);
      expect(response.body.avgPrice).toBe(targetReportAvgPrice);

      // Longitude less than min
      response = await request(app.getHttpServer())
        .post('/reports')
        .set('Cookie', cookie)
        .send({ ...targetReportData, lng: 4 });

      await request(app.getHttpServer())
        .patch(`/reports/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ approved: true })
        .expect(200);
      response = await request(app.getHttpServer())
        .get(URI)
        .set('Cookie', cookie)
        .expect(200);
      expect(response.body.avgPrice).toBe(targetReportAvgPrice);

      // Latitude greater than max
      response = await request(app.getHttpServer())
        .post('/reports')
        .set('Cookie', cookie)
        .send({ ...targetReportData, lat: 16 });

      await request(app.getHttpServer())
        .patch(`/reports/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ approved: true })
        .expect(200);
      response = await request(app.getHttpServer())
        .get(URI)
        .set('Cookie', cookie)
        .expect(200);
      expect(response.body.avgPrice).toBe(targetReportAvgPrice);

      // Latitude less than min
      response = await request(app.getHttpServer())
        .post('/reports')
        .set('Cookie', cookie)
        .send({ ...targetReportData, lat: 4 });

      await request(app.getHttpServer())
        .patch(`/reports/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ approved: true })
        .expect(200);
      response = await request(app.getHttpServer())
        .get(URI)
        .set('Cookie', cookie)
        .expect(200);
      expect(response.body.avgPrice).toBe(targetReportAvgPrice);

      // Year greater than max
      response = await request(app.getHttpServer())
        .post('/reports')
        .set('Cookie', cookie)
        .send({ ...targetReportData, year: 2024 });

      await request(app.getHttpServer())
        .patch(`/reports/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ approved: true })
        .expect(200);
      response = await request(app.getHttpServer())
        .get(URI)
        .set('Cookie', cookie)
        .expect(200);
      expect(response.body.avgPrice).toBe(targetReportAvgPrice);

      // Year less than min
      response = await request(app.getHttpServer())
        .post('/reports')
        .set('Cookie', cookie)
        .send({ ...targetReportData, year: 2016 });

      await request(app.getHttpServer())
        .patch(`/reports/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ approved: true })
        .expect(200);
      response = await request(app.getHttpServer())
        .get(URI)
        .set('Cookie', cookie)
        .expect(200);
      expect(response.body.avgPrice).toBe(targetReportAvgPrice);

      // Exclude unapproved report
      response = await request(app.getHttpServer())
        .post('/reports')
        .set('Cookie', cookie)
        .send({ ...targetReportData });
      response = await request(app.getHttpServer())
        .get(URI)
        .set('Cookie', cookie)
        .expect(200);
      expect(response.body.avgPrice).toBe(targetReportAvgPrice);
    });

    it("'should get an estimate for a report with a non admin user, even if there's no available report", async () => {
      // A non admin user should get an estimate
      // Log in a non admin user
      // response = await request(app.getHttpServer())
      //   .post('/auth/signup')
      //   .send(userData)
      //   .expect(201)
      //   .expect({
      //     email: 'test@test.com',
      //     id: 2,
      //     admin: false,
      //   });
      // cookie = response.get('Set-Cookie');
      // if (!cookie) {
      //   throw new Error('Cookie is undefined');
      // }
      // response = await request(app.getHttpServer())
      //   .get(URI)
      //   .set('Cookie', cookie)
      //   .expect(200);
      // expect(response.body.avgPrice).toBe(targetReportAvgPrice);
    });
  });
});
