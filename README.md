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

For ease of use, you can just copy and paste these instructions in your CLI.

In case you find yourself in trouble, don't hesitate to [send me an e-mail](mailto:a@ivanderlich.com) asking for help.

For better understanding of each step, you can run each command one by one.

```bash

# Clone repo
git clone git@github.com:IvanDerlich/car-reports.git

# Move to the repo folder
cd car-reports

# Install Dependencies
npm install

# Create an enviorenment variables file
touch .env

# Add your custom cookie value to the .env file
# Note: You can use other values here
echo "COOKIE_KEY=your-secret-test-cookie-key-here" > .env

# Add your custom database value to the .env file
# Note: You can use other values here
echo "DB_NAME=db.your-local-database-name.sqlite" >> .env

# Run Migrations
npm run migrations:run

# Seed the database
npm run db:seed

# Start in development mode with hot reload
npm run dev
```

After running these commands you should see something like this in your console

<img src="./docs/Successful Setup.png">

## Usage

After setting up the server go to the Swagger for the API documentation

http://localhost:3000/api

This is how to start interacting with the newly created service:

1. **Define the proper tool**
   Once the API server is running you should see something like this

### API Testing with VS Code/Cursor (.http files)

1. Open the .http file in VS Code or Cursor
2. Install the "REST Client" extension if not already installed
3. Open .http files
   /src/users/request.http
   /src/reports/request.http
4. Click the "Send Request" link above each request
5. View responses directly in the editor

This provides a simple way to test the API functionality without needing external tools like Postman or curl.

### API Testing with Postman

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

## Testing

The project includes comprehensive testing with Jest:

## Test Setup

Don't proceed if you haven't set the local environment (Project Setup)

If you want to run tests locally you can copy and paste these instructions in your CLI.

In case you find yourself in trouble, don't hesitate to [send me an e-mail](mailto:a@ivanderlich.com) asking for help.

For better understanding of each step, you can run each command one by one.

```bash

# Create a file .env.test
touch .env.test

# Define a custom cookie key
echo "COOKIE_KEY=your-secret-test-cookie-key-here" > .env

# Define a custom database name
echo "DB_NAME=db.your-test-database-name.sqlite" >> .env

# Run Unit Tests
npm run test

# Run End to End tests
npm run test:e2e
```

Note: You can use other values here

### Other tests features

**Code Coverage**

```bash
npm run test:cov
```

```bash
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
- Get all tests
- Get a single test by id


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

### Peek data in the database

```bash

# Update
sudo apt update 

# Install sqlite
sudo apt install sqlite3

# Access the database console
sqlite3 [your-database-name].sqlite

# See all tables
.tables

# See data inside users
select * from user;

# See data inside reports
select * from report;
```

## Code Quality

```bash
# Lint and fix code (Not implemented)
npm run lint

# Format code
npm run format

# Check code formatting
npm run format:check
```

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
- **Proper linting** So we can add more features with less propensity to errors and rework
- **OpenAPI exports** Add a downloadable link of a json file that can be imported to postman or similar tools

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## Help needed

If you find a bug, an error, or an inconsistence in the documentation send me an email to a@ivanderlich.com 
or even better: create a pull request.
This will help me out a lot to improve on my mistakes.

## License

This project is licensed under the MIT License.

## Author

[Ivan Derlich](ivanderlich.com)
