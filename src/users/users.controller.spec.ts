import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    const user: User = new User();
    user.email = 'test@test.com';
    user.password = '123456';

    fakeAuthService = {
      signup: (email: string, password: string) => Promise.resolve(user),
      signin: (email: string, password: string) => Promise.resolve(user),
    };

    fakeUsersService = {
      find: (email: string) =>
        Promise.resolve([user].filter((user) => user.email === email)),
      findOneById: (id: number) => Promise.resolve(user),
      remove: (id: number) => Promise.resolve(user),
      update: (id: number, attrs: Partial<User>) => Promise.resolve(user),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it(' ', () => {});
});
