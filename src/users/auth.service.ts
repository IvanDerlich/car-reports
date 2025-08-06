import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { hash, verify } from 'argon2';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(
    email: string,
    password: string,
    admin: boolean = false,
  ): Promise<User> {
    // See if email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    // Hash the users password with argon2 that contains the salt, parameters, and algorithm info
    const hashedPassword = await hash(password);

    const user = await this.usersService.create(email, hashedPassword, admin);

    return user;
  }

  async signin(email: string, password: string): Promise<User> {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('email not found');
    }

    const passwordMatch = await verify(user.password, password);
    if (!passwordMatch) {
      throw new BadRequestException('invalid password');
    }

    return user;
  }
}
