import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '@/app.module';
import { setupApp } from '@/setup-app';

describe('Authentication System (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await setupApp(app);
    await app.init();
  });

  it('Handles a signup request', () => {
    const email = 'test12312uaoe3@test.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: '123456' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
    // .expect({
    //   id: 1,
    //   email: 'test123123@test.com',
    // });
  });
});
