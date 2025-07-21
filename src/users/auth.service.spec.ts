import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';


describe('AuthService', () => {

  let service: AuthService;

  beforeAll(async () => {
    // Create a fake copy of the users service
    const fakeUsersService: Partial<UsersService> = {
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

})