# Car Reports API

A NestJS-based API for managing car reports with user authentication and reporting functionality.

## Description

This is a [NestJS](https://github.com/nestjs/nest) application that provides an API for managing car reports. The application includes user authentication, report management, and uses SQLite as the database.

## Features

- User authentication with cookie sessions
- **Price estimation based on similar car reports** - Calculate price estimates using a statistical approach that finds the 3 most similar approved reports based on make, model, location, year, and mileage
- Car reports management
- SQLite database with TypeORM
- Input validation with class-validator
- Comprehensive testing suite (unit and e2e tests)

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Project Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd car-reports-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create environment files for each environment (`.env.development`, `.env.test`, `.env.production`) with the required variables:

   ```env
   COOKIE_KEY=your-secret-cookie-key-here
   DB_NAME=your-database-name.sqlite
   ```

   > **Note**: Use different database names for testing to avoid resetting your development database during test runs.

## Running the Application

### Development Mode

```bash
# Start in development mode with hot reload
npm run start:dev

# Or use the dev alias
npm run dev
```

### Production Mode

```bash
# Build the application
npm run build

# Start in production mode
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

## Testing

The project includes comprehensive testing with Jest:

### Unit Tests

```bash
# Run unit tests
npm run test

# Run unit tests in watch mode
npm run test:watch

# Run unit tests with coverage
npm run test:cov
```

### End-to-End Tests

```bash
# Run e2e tests
npm run test:e2e
```

### Test Coverage

```bash
# Generate coverage report
npm run test:cov

# Generate coverage report in JSON format

## API Testing with VS Code/Cursor

For easy API testing without complex setup, you can use the included .http files in VS Code or Cursor:

### Users API Testing
Use src/users/request.http to test user-related endpoints:
- User registration and authentication
- User management operations
- Session handling

### Reports API Testing
Use src/reports/requests.http to test report-related endpoints:
- Report creation and management
- Price estimation functionality
- Report approval/rejection

### How to Use
1. Open the .http file in VS Code or Cursor
2. Install the "REST Client" extension if not already installed
3. Click the "Send Request" link above each request
4. View responses directly in the editor

This provides a simple way to test the API functionality without needing external tools like Postman or curl.
npm run test:cov:json
```

## Database Management

The project includes several database management scripts:

```bash
# Clear the database
npm run db:clear

# Seed the database with sample data
npm run db:seed

# Reset the database (clear + seed)
npm run db:reset
```

## Code Quality

```bash
# Lint and fix code
npm run lint

# Format code
npm run format

# Check code formatting
npm run format:check
```

## API Endpoints

The API provides endpoints for:

- **Users**: User registration, authentication, and management
- **Reports**: Car report creation, retrieval, and management
- **Price Estimation**: Calculate price estimates based on similar car reports in the database

### Price Estimation Algorithm

The price estimation feature uses a rule-based statistical algorithm that:

1. **Finds Similar Cars**: Searches for the 3 most similar approved reports based on:
   - Same make and model
   - Geographic proximity (±5 degrees longitude/latitude)
   - Similar year (±3 years)
   - Closest mileage

2. **Calculates Average Price**: Returns the average price of the 3 most similar reports

3. **Input Requirements**:
   - Car make and model
   - Year (1930 to current year)
   - Geographic coordinates (longitude/latitude)
   - Mileage (0 to 1,000,000)

This approach provides price estimates by averaging user-submitted reports of similar vehicles in the same geographic area using predefined filtering rules.

## Environment Variables

| Variable     | Description                                 | Required | Default     |
| ------------ | ------------------------------------------- | -------- | ----------- |
| `COOKIE_KEY` | Secret key for cookie session encryption    | Yes      | -           |
| `DB_NAME`    | SQLite database file path                   | Yes      | -           |
| `NODE_ENV`   | Environment (development, test, production) | No       | development |

## Project Structure

```
src/
├── users/           # User management module
├── reports/         # Reports management module
├── app.controller.ts
├── app.service.ts
└── app.module.ts
test/                # End-to-end tests
dev/
├── db/             # Database configuration and scripts
└── scripts/        # Database management scripts
```

## Technologies Used

- **Framework**: NestJS
- **Database**: SQLite with TypeORM
- **Authentication**: Cookie sessions client side
- **Validation**: class-validator
- **Testing**: Jest
- **Language**: TypeScript

## Future improvements

- **Server side sessions:** so we don't rely on client side cooking for de-authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.
