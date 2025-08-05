import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../../../src/users/user.entity';
import { hash } from 'argon2';
import { faker } from '@faker-js/faker';

export const UserFactory = setSeederFactory(User, async () => {
  const hashedPassword = await hash(faker.internet.password());
  const user = new User();
  user.email = faker.internet.email();
  user.password = hashedPassword;
  return user;
});
