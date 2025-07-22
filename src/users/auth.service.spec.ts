import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';



describe('AuthService', () => {

  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeAll(async () => {
    // Create a fake copy of the users service
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) => Promise.resolve((()=>{
        const user = new User()
        user.email = email;
        user.password = password;
        return user;
      })())
    }

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();

    service = module.get(AuthService);
  })

  it('can create an instance of auth service', async() => {
    expect(service).toBeDefined();
  })

  it('creates a new user with a salted and hashed password', async() => {
    const user: User = await service.signup('asdf@asdf.com', 'asdf');
    // console.log(user);
    expect(user.password).not.toEqual('asdf');
    const [,,,,salt, hash] = user.password.split('$');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  })

  it('throws an error if user signs up with email that is in use', async() => {
    fakeUsersService.find = () => Promise.resolve([{id: 1, email: 'asdf@asdf.com', password: 'asdf'} as User]);
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(BadRequestException);
  })

})