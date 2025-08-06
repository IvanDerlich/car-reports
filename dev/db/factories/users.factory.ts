import { User } from '../../../src/users/user.entity';
import { hash } from 'argon2';
import { CustomUserData } from '../types';
import { faker } from '@faker-js/faker';

export class CustomUserFactory {
  static async make(customData: CustomUserData): Promise<User> {
    const hashedPassword = await hash(customData.password);
    const user = new User();
    user.email = customData.email;
    user.password = hashedPassword;
    user.admin = customData.admin ?? false;
    return user;
  }

  static async makeMany(customData: CustomUserData[]): Promise<User[]> {
    const users: User[] = [];
    for (const data of customData) {
      users.push(await this.make(data));
    }
    return users;
  }
}



export class RandomUserFactory {
  static async make(): Promise<User> {
    const user = new User();
    user.email = faker.internet.email();
    user.password = await hash(faker.internet.password());
    return user;
  }

  static async makeMany(count: number): Promise<User[]> {
    const users: User[] = [];
    for (let i = 0; i < count; i++) {
      users.push(await this.make());
    }
    return users;
  }
}