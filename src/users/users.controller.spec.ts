import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;
  const user: User = new User();
  user.id = 1;
  user.email = 'test@test.com';
  user.password = '123456';

  beforeEach(async () => {
    fakeAuthService = {
      signup: () => Promise.resolve(user),
      signin: () => Promise.resolve(user),
    };

    fakeUsersService = {
      // @ts-ignore
      find: (email: string) => Promise.resolve(user),
      findOneById: (id: number) => Promise.resolve(user),
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

  it('findAllUsers returns a list of users with the given email', async () => {
    // @ts-ignore
    fakeUsersService.find = () => Promise.resolve([user]);
    const users = await controller.findAllUsersByEmail('test@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@test.com');
  });

  it('finds no users if email is not found', async () => {
    fakeUsersService.find = () => Promise.resolve([]);
    const users = await controller.findAllUsersByEmail('asdf@asdf.com');
    expect(users.length).toEqual(0);
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user?.id).toEqual(1);
  });

  it('Signs in updates session and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      { email: 'test@test.com', password: '123456' },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
