import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { hash } from 'argon2';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) => {
        const user = new User();
        user.email = email;
        user.password = password;
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user: User = await service.signup('asdf@asdf.com', 'asdf');
    expect(user.password).not.toEqual('asdf');
    const [, , , , salt, hash] = user.password.split('$');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(service.signin('asdf@asdf.com', 'asdf')).rejects.toThrow(
      NotFoundException,
    );
  });

  describe('test against the same user', () => {
    beforeEach(async () => {
      const user = new User();
      user.email = 'asdf@asdf.com';
      user.password = await hash('asdf');
      fakeUsersService.find = () => Promise.resolve([user]);
    });

    it('returns a user if correct password is provided', async () => {
      const result = await service.signin('asdf@asdf.com', 'asdf');
      expect(result).toBeDefined();
    });

    it('throws if an invalid password is provided', async () => {
      await expect(service.signin('asdf@asdf.com', 'asdfe')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws an error if user signs up with email that is in use', async () => {
      await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
