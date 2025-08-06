import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../../src/users/user.entity';
import { hash } from 'argon2';
import { faker } from '@faker-js/faker';

// Type for custom user data
export type CustomUserData = {
  email: string;
  password: string;
  admin?: boolean;
};

// Custom factory function that can accept custom data
export const CustomUserFactory = async (
  customData: CustomUserData,
): Promise<User> => {
  const hashedPassword = await hash(customData.password);
  const user = new User();
  user.email = customData.email;
  user.password = hashedPassword;
  user.admin = customData.admin ?? false;
  return user;
};

export const RandomUserFactory = setSeederFactory(User, async () => {
  const hashedPassword = await hash(faker.internet.password());
  const user = new User();
  user.email = faker.internet.email();
  user.password = hashedPassword;
  return user;
});
