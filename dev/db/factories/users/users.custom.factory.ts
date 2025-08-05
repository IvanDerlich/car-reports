import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../../../src/users/user.entity';
import { hash } from 'argon2';

// Type for custom user data
export type CustomUserData = {
  email: string;
  password: string;
  admin?: boolean;
};

// Custom factory function that can accept custom data
export const createCustomUser = async (
  customData: CustomUserData,
): Promise<User> => {
  const hashedPassword = await hash(customData.password);
  const user = new User();
  user.email = customData.email;
  user.password = hashedPassword;
  user.admin = customData.admin ?? false;
  return user;
};

// Standard factory for typeorm-extension (uses faker)
export const UsersCustomFactory = setSeederFactory(User, async () => {
  // This factory can be used with typeorm-extension's standard pattern
  // For custom data, use createCustomUser function directly
  const user = new User();
  user.email = 'custom@example.com';
  user.password = await hash('password123');
  user.admin = false;
  return user;
});
