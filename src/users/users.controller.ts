import { 
  Body,
  Controller,
  Post,
  Get,
  Param,
  Query,
  Delete,
  Patch,
  Session,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from 'src/users/dtos/user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/seralized.interceptor';
import { AuthService } from './auth.service';
import { User } from './user.entity';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @Get('whoami')
  whoAmI(@Session() session: any) : Promise<User | null> {
    return this.usersService.findOneById(session.userId)
  }

  @Post('signout')
  signOut(@Session() session: any) {
    session.userId = null
    return { message: 'Signed out successfully' }
  }

  @Post('signup')
  async createUser(
    @Body() body: CreateUserDto,
    @Session() session: any
  ) : Promise<User> {
    const user = await this.authService.signup(body.email, body.password)
    session.userId = user.id
    return user
  }

  @Post('signin')
  async signin(
    @Body() body: CreateUserDto,
    @Session() session: any
  ) : Promise<User> {
    const user = await this.authService.signin(body.email, body.password)
    session.userId = user.id
    return user
  }

  @Get(':id')
  findUser(@Param('id') id: string ) : Promise<User | null> {
    return this.usersService.findOneById(parseInt(id))
  }

  // Finds all users with an email
  @Get()
  findAllUsersByEmail(
    @Query('email') email: string
  ) : Promise<User[]> {
    return this.usersService.find(email)
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) : Promise<User> {
    return this.usersService.remove(parseInt(id))
  }

  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto
  ) : Promise<User> {
    return this.usersService.update(parseInt(id), body)
  }
}
