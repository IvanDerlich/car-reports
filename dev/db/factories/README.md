# Database Factories

This folder contains factories for creating database entities with both random and custom data.

## Structure

```
dev/db/factories/
├── users/
│   ├── users.random.factory.ts    # Random user data
│   └── users.custom.factory.ts    # Custom user data
├── reports.ts/
│   ├── reports.random.factory.ts  # Random report data
│   └── reports.custom.factory.ts  # Custom report data
└── index.ts                       # Export all factories
```

## Usage

### Random Data (using typeorm-extension factories)

```typescript
import { UsersRandomFactory, ReportsRandomFactory } from '../dev/db/factories';

// Create random users
const randomUsers = await UsersRandomFactory.makeMany(5);

// Create random reports
const randomReports = await ReportsRandomFactory.makeMany(10);
```

### Custom Data (using custom factory functions)

```typescript
import {
  createCustomUser,
  createCustomReport,
  type CustomUserData,
  type CustomReportData,
} from '../dev/db/factories';

// Create custom users
const customUserData: CustomUserData[] = [
  { email: 'admin@test.com', password: 'admin123', admin: true },
  { email: 'user@test.com', password: 'user123', admin: false },
];

const customUsers = await Promise.all(
  customUserData.map((data) => createCustomUser(data)),
);

// Create custom reports
const customReportData: CustomReportData[] = [
  {
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    lng: -122.4194,
    lat: 37.7749,
    mileage: 50000,
    approved: false,
    price: 25000,
    userId: 1,
  },
];

const customReports = customReportData.map((data) => createCustomReport(data));
```

### Mixed Approach

```typescript
import {
  UsersRandomFactory,
  createCustomUser,
  ReportsRandomFactory,
} from '../dev/db/factories';

// Mix random and custom data
const adminUser = await createCustomUser({
  email: 'admin@test.com',
  password: 'admin123',
  admin: true,
});

const randomUsers = await UsersRandomFactory.makeMany(5);
const allUsers = [adminUser, ...randomUsers];

// Create reports for all users
const reports = await ReportsRandomFactory.makeMany(20);
```

## Factory Types

### Random Factories

- Use `setSeederFactory` from typeorm-extension
- Generate random data using faker
- Can be used with typeorm-extension's seeding system

### Custom Factories

- Provide `createCustom*` functions for custom data
- Accept typed parameters for data validation
- Can be used independently or with seeding system

## Integration with Seeders

```typescript
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { UsersRandomFactory, createCustomUser } from '../factories';

export class DatabaseSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    // Use random factory
    const randomUserFactory = await factoryManager.get(UsersRandomFactory);
    const randomUsers = await randomUserFactory.makeMany(5);

    // Use custom factory
    const adminUser = await createCustomUser({
      email: 'admin@test.com',
      password: 'admin123',
      admin: true,
    });

    // Save to database
    await dataSource.getRepository(User).save([...randomUsers, adminUser]);
  }
}
```
