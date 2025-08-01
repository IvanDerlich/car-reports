// shared/seeds/data/users.ts
import { DataSource } from 'typeorm';
import { User } from '../../src/users/user.entity';
import { hash } from 'argon2';
import { faker } from '@faker-js/faker';

export const createUsers = async (dataSource: DataSource, maxUsers = 5) => {
  const userRepository = dataSource.getRepository(User);
  const users: User[] = [];

  for (let i = 1; i <= maxUsers; i++) {
    const hashedPassword = await hash('password123');

    let user: User;
    let attempts = 0;
    let success = false;
    const maxAttempts = 20;


    while (attempts < maxAttempts && !success) {
      const userData = {
        email: faker.internet.email(),
        password: hashedPassword,
      };

      try {
        user = await userRepository.save(userData);
        users.push(user);
        success = true;
      } catch (error) {
        console.log(`Attempt ${attempts + 1} of ${maxAttempts}`);
        attempts++;
        if (attempts >= maxAttempts) {
          console.log(`Failed to create user after ${maxAttempts} attempts`);
          throw new Error(
            `Failed to create user after ${maxAttempts} attempts`,
          );
        }
        // Continue loop to try with new email
      }
    }
  }

  return users;
};
