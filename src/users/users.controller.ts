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
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import {
  Serialize,
  SerializeResponse,
} from '../interceptors/seralized.interceptor';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurrentUser } from './decorator/decorator';
import { AuthGuard } from '@/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { MessageDto } from '@/dtos/message.dto';
import {
  CreateUserDocs,
  SigninDocs,
  WhoAmIDocs,
  SignOutDocs,
  FindUserDocs,
  FindAllUsersDocs,
  RemoveUserDocs,
  UpdateUserDocs,
} from './users.controller.docs';

@ApiTags('Authentication')
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Serialize(UserDto)
  @Post('signup')
  @CreateUserDocs()
  async createUser(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.signup(
      body.email,
      body.password,
      body.admin,
    );
    session.userId = user.id;
    return user;
  }

  @Serialize(UserDto)
  @Post('signin')
  @SigninDocs()
  async signin(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  @Get('whoami')
  @WhoAmIDocs()
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @UseGuards(AuthGuard)
  @SerializeResponse(MessageDto)
  @Post('signout')
  @SignOutDocs()
  signOut(@Session() session: any) {
    session.userId = null;
    return { message: 'Signed out successfully' };
  }

  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  @Get(':id')
  @FindUserDocs()
  async findUser(@Param('id') id: string): Promise<User | null> {
    const user = await this.usersService.findOneById(parseInt(id));
    // Ideally exceptions should be thrown in the service layer
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  @Get()
  @FindAllUsersDocs()
  findAllUsersByEmail(@Query('email') email: string): Promise<User[]> {
    return this.usersService.find(email);
  }

  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  @Delete(':id')
  @RemoveUserDocs()
  removeUser(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(parseInt(id));
  }

  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  @Patch(':id')
  @UpdateUserDocs()
  updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(parseInt(id), body);
  }
}
