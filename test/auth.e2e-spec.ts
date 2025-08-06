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
    await clearDatabase();
  });

  it('Handles a signup request', () => {
    const email = 'test@test.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: '123456' })
      .expect(201)
      .expect({ id: 1, email });
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
      .expect({ id: 1, email });
  });
});
