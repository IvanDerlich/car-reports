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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
  BadRequestErrorDto,
  ConflictErrorDto,
  InternalServerErrorDto,
} from './dtos/error-response.dto';
import { MessageDto } from '@/dtos/message.dto';

@ApiTags('Authentication')
@Serialize(UserDto) // Apply UserDto serialization to all endpoints by default
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  @ApiOperation({
    summary: 'Create a new user account',
    description:
      'Registers a new user with email and password. Creates a session and returns user data.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User registration data',
    examples: {
      regularUser: {
        summary: 'Regular User Signup',
        description: 'Create a new regular user account',
        value: {
          email: 'user@example.com',
          password: 'securepassword123',
        },
      },
      adminUser: {
        summary: 'Admin User Signup',
        description: 'Create a new admin user account',
        value: {
          email: 'admin@example.com',
          password: 'adminpassword123',
          admin: true,
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'User successfully created and logged in',
    type: UserDto,
  })
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

  @Post('signin')
  @ApiOperation({
    summary: 'Sign in an existing user',
    description: 'Logs in a user with email and password. Creates a session.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User login data',
    examples: {
      regularUser: {
        summary: 'Regular User Signin',
        description: 'Login a regular user account',
        value: {
          email: 'user@example.com',
          password: 'securepassword123',
        },
      },
      adminUser: {
        summary: 'Admin User Signin',
        description: 'Login an admin user account',
        value: {
          email: 'admin@example.com',
          password: 'adminpassword123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: UserDto,
  })
  async signin(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @UseGuards(AuthGuard)
  @Get('whoami')
  @ApiOperation({
    summary: 'Get current user information',
    description: 'Returns the details of the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully',
    type: UserDto,
  })
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @UseGuards(AuthGuard)
  @SerializeResponse(MessageDto) // Override for this specific endpoint
  @Post('signout')
  @ApiOperation({
    summary: 'Sign out the current user',
    description: 'Logs out the current user by clearing the session.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully signed out',
    type: MessageDto, // Fixed: now correctly shows MessageDto
  })
  signOut(@Session() session: any) {
    session.userId = null;
    return { message: 'Signed out successfully' };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findUser(@Param('id') id: string): Promise<User | null> {
    const user = await this.usersService.findOneById(parseInt(id));
    // Ideally exceptions should be thrown in the service layer
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  // Finds all users with an email
  @UseGuards(AuthGuard)
  @Get()
  findAllUsersByEmail(@Query('email') email: string): Promise<User[]> {
    return this.usersService.find(email);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  removeUser(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(parseInt(id));
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(parseInt(id), body);
  }
}
