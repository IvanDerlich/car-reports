import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '@/app.module';
import { DataSource } from 'typeorm';
import { clearDatabase } from '../dev/db/clear';

describe('Authentication System (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);

    // Clear database before each test (same as npm script)
    await clearDatabase(dataSource);
  });

  it('Handles a signup request', () => {
    const email = 'test@test.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: '123456' })
      .expect(201)
      .expect({ id: 1, email, admin: false });
  });

  it('Signs up a new admin user, then get the current signed in user', async () => {
    const userData = {
      email: 'admin@admin.com',
      password: '123456',
      admin: true,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userData)
      .expect(201)
      .expect({
        id: 1,
        email: 'admin@admin.com',
        admin: true,
      });

    console.log('create user response: ', response.body);

    // let response = await createUser(userData);
    // console.log('create user response: ', response.body);
  });

  it('Signs up a new user, then get the current signed in user', async () => {
    const email = 'test@test.com';

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: '123456' });

    expect(response.status).toBe(201);
    // console.log('response: ', response);
    const cookie = response.get('Set-Cookie');

    if (!cookie) {
      throw new Error('Cookie is undefined');
    }

    await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)
      .expect({ id: 1, email, admin: false });
  });

  it('Signs in a user, the signs out, then signs in again', async () => {
    const userData = {
      email: 'test@test.com',
      password: '123456',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userData)
      .expect(201)
      .expect({ id: 1, email: 'test@test.com', admin: false });

    const cookie = response.get('Set-Cookie');

    if (!cookie) {
      throw new Error('Cookie is undefined');
    }

    await request(app.getHttpServer())
      .post('/auth/signout')
      .set('Cookie', cookie)
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/signin')
      .send(userData)
      .expect(201)
      .expect({ id: 1, email: 'test@test.com', admin: false });
  });
});
