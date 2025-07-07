import { 
  Body,
  Controller,
  Post,
  Get,
  Param,
  Query,
  Delete,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from 'src/users/dtos/user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/seralized.interceptor';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body.email, body.password)
  }

  @Serialize(UserDto)
  @Get(':id')
  findUser(@Param('id') id: string ) {
    return this.usersService.findOneById(parseInt(id))
  }

  // Finds all users with an email
  @Get()
  findAllUsersByEmail(@Query('email') email: string) {
    return this.usersService.find(email)
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id))
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body)
  }
}
