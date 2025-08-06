import { DataSource } from 'typeorm';
import { User } from '../../src/users/user.entity';
import { hash } from 'argon2';
import { faker } from '@faker-js/faker';

// Seeder function that requires a DataSource
export const seedDatabase = async (dataSource: DataSource) => {
  // Create 10 random users
  const users: User[] = [];
  for (let i = 0; i < 10; i++) {
    const hashedPassword = await hash(faker.internet.password());
    const user = new User();
    user.email = faker.internet.email();
    user.password = hashedPassword;
    user.admin = faker.datatype.boolean();
    users.push(user);
  }

  // Save users to database
  await dataSource.getRepository(User).save(users);

  console.log(`Created ${users.length} random users`);
};
