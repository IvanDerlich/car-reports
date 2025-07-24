import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let fakeRepo: any;

  beforeEach(async () => {
    const user: User = new User();
    user.id = 1;
    user.email = 'test@test.com';
    user.password = '123456';

    fakeRepo = {
      create: jest.fn().mockReturnValue(user),
      save: jest.fn().mockResolvedValue(user),
      findOneBy: jest.fn().mockResolvedValue(user),
      find: jest.fn().mockResolvedValue([user]),
      remove: jest.fn().mockResolvedValue(user),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: fakeRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
