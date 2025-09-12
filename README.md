# 🚗 Car Reports API

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](/LICENSE)

> A robust NestJS-based API for managing car reports with intelligent price estimation, user authentication, and comprehensive reporting functionality.

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Price Estimation Algorithm](#-price-estimation-algorithm)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Testing](#-testing)
- [Database Management](#-database-management)
- [Environment Variables](#-environment-variables)
- [Technologies](#-technologies)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & Authorization

- **Session-based authentication** with secure cookie management
- **Role-based access control** (Admin vs Regular users)
- **User management** (CRUD operations with admin privileges)

### 📊 Car Reports Management

- **Create, read, and approve/disapprove** car reports
- **Geographic filtering** with longitude/latitude coordinates
- **Comprehensive validation** with class-validator
- **Report approval workflow** (Admin-only feature)

### 🧠 Intelligent Price Estimation

- **Statistical algorithm** that finds the 3 most similar approved reports
- **Multi-factor matching**: make, model, location, year, and mileage
- **Geographic proximity** filtering (±5 degrees)
- **Year range** matching (±3 years)
- **Mileage-based** similarity scoring

### 📚 Developer Experience

- **Rich Swagger documentation** with interactive API explorer
- **Comprehensive testing suite** (Unit + E2E tests)
- **Code coverage reporting**
- **Database seeding** with sample data
- **VS Code REST Client** support (.http files)

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/IvanDerlich/car-reports.git
cd car-reports

# Install dependencies
npm install

# Create environment variables file
touch .env

# Add your custom cookie value to the .env file
echo "COOKIE_KEY=your-secret-test-cookie-key-here" > .env

# Add your custom database value to the .env file
echo "DB_NAME=db.your-local-database-name.sqlite" >> .env

# Run Migrations
npm run migrations:run

# Seed the database with sample data
npm run db:seed

# Start the development server
npm run dev
```

🎉 **Success!** Your API is now running at `http://localhost:3000`

### What You Should See

After successful setup, you should see something like this:

![Successful Setup](docs/Successful%20Setup.png)

## 📖 API Documentation

### Interactive Documentation and Endpoints

Visit the **Swagger UI** at: http://localhost:3000/api

![Swagger 1 of 2](docs/Swagger%201%20of%202.png)
![Swagger 2 of 2](docs/Swagger%202%20of%202.png)

### 🧪 Testing Scenarios

Here are some recommended workflows to explore the API functionality:

#### User Management & Authentication

- **Create an admin user** and test role-based permissions
- **Login/logout** to verify session management
- **Use the whoAmI endpoint** to check your current authentication status
- **Create regular users** and test different permission levels

#### Report Management

- **Create car reports** with various vehicle data
- **Approve/reject reports** (admin-only functionality)
- **View all reports** and test filtering capabilities
- **Get price estimates** using the preset values in Swagger (database is pre-seeded for testing)

#### Price Estimation Algorithm Testing

- **Test price changes**: Add reports within the algorithm's range and observe how the average price updates
- **Verify filtering**: Add reports outside the geographic/year range or unapproved reports to confirm they don't affect estimates
- **Test mileage limits**: Add reports with excessive mileage differences when 3 matches already exist to verify they're ignored
- **Test closer matches**: Add reports with better mileage proximity to see how they change the average

#### Authorization Testing

Verify that non-admin users **cannot**:

- View all users
- Search for users by ID or email
- Delete any user
- Update user information
- Approve or reject reports

### Testing with REST Client

Use the included `.http` files for easy API testing:

- **User endpoints**: `src/users/request.http`
- **Report endpoints**: `src/reports/requests.http`

## 🧮 Price Estimation Algorithm

The price estimation feature uses a statistical approach:

### Algorithm Steps

1. **🔍 Find Similar Cars**
   - Same make and model
   - Geographic proximity (±5° longitude/latitude)
   - Similar year (±3 years)
   - Closest mileage

2. **📊 Calculate Average**
   - Returns average price of 3 most similar **approved** reports
   - Ignores unapproved reports for accuracy

3. **📝 Input Requirements**
   - Car make and model
   - Year (1930 to current year)
   - Geographic coordinates (longitude/latitude)
   - Mileage (0 to 1,000,000)

## 🏗️ Project Structure

```
src/
├── users/                    # User management module
│   ├── dtos/                # Data Transfer Objects
│   ├── user.entity.ts       # User entity definition
│   ├── users.controller.ts  # User endpoints
│   ├── users.service.ts     # User business logic
│   └── users.controller.docs.ts # API documentation
├── reports/                  # Reports management module
│   ├── dtos/                # Report DTOs
│   ├── report.entity.ts     # Report entity
│   ├── reports.controller.ts # Report endpoints
│   ├── reports.service.ts   # Report business logic
│   └── reports.controller.docs.ts # API documentation
├── guards/                   # Authentication guards
├── interceptors/            # Response serialization
├── validators/              # Custom validation rules
└── main.ts                  # Application entry point
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start with hot reload

# Building
npm run build            # Build for production

# Code Quality
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting

# Database
npm run db:clear         # Clear database
npm run db:seed          # Seed with sample data
npm run db:reset         # Clear + seed database
npm run migrations:run   # Run database migrations
```

## 🧪 Testing

### Environment Setup

Create a `.env.test` file at the root with the following variables:

```env
COOKIE_KEY=your-secret-cookie-key-here
DB_NAME=db.your-database-name.sqlite
NODE_ENV=development
```

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage for both unit and e2e tests
npm run test:cov

# Watch mode
npm run test:watch
```

### Test Structure

- **Unit Tests**: Test individual components and services
- **E2E Tests**: Test complete API workflows
- **Coverage Reports**: Available in `coverage/` directory

## 🗄️ Database Management

### SQLite Database

The application uses SQLite with TypeORM for data persistence.

### Database Scripts

```bash
# Clear all data
npm run db:clear

# Add sample data
npm run db:seed

# Reset database (clear + seed)
npm run db:reset
```

### Database Inspection

```bash
# Install SQLite CLI
sudo apt update && sudo apt install sqlite3

# Access database
sqlite3 your-database-name.sqlite

# View tables
.tables

# Query data
SELECT * FROM user;
SELECT * FROM report;
SELECT * FROM migrations;
```

## ⚙️ Environment Variables

These variables should be present in both the .env file for local usage and the .env.test file for testing

| Variable     | Description                       | Required | Default       |
| ------------ | --------------------------------- | -------- | ------------- |
| `COOKIE_KEY` | Secret key for session encryption | ✅       | -             |
| `DB_NAME`    | SQLite database file path         | ✅       | -             |
| `NODE_ENV`   | Environment mode                  | ❌       | `development` |

## 🛠️ Technologies

### Backend Stack

- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[TypeORM](https://typeorm.io/)** - Object-Relational Mapping
- **[SQLite](https://www.sqlite.org/)** - Lightweight database

### Development Tools

- **[Jest](https://jestjs.io/)** - Testing framework
- **[Swagger](https://swagger.io/)** - API documentation
- **[Prettier](https://prettier.io/)** - Code formatting
- **[ESLint](https://eslint.org/)** - Code linting

### Security & Validation

- **[Argon2](https://github.com/ranisalt/node-argon2)** - Password hashing
- **[class-validator](https://github.com/typestack/class-validator)** - Input validation
- **[cookie-session](https://github.com/expressjs/cookie-session)** - Session management

## 🤝 Contributing

Contributions are welcomed! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Write tests for new functionality
- Ensure all tests pass (`npm test`)
- Follow the existing code style
- Update documentation as needed

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Issues

```bash
# Ensure database file exists
ls -la *.sqlite

# Check permissions
chmod 644 your-database.sqlite
```

# Kill the process

kill -9 <PID>

````

#### Environment Variables Not Loading

```bash
# Check .env file exists
ls -la .env

# Verify file format (no spaces around =)
cat .env
````

#### Migration Issues

```bash
# Reset migrations
npm run db:reset
npm run migrations:run
```

### Getting Help

- 📧 **Email**: [a@ivanderlich.com](mailto:a@ivanderlich.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/IvanDerlich/car-reports/issues)
- 📖 **Documentation**: [Swagger UI](http://localhost:3000/api)

## 🚀 Future Improvements

- [ ] **Server-side sessions** for better security
- [ ] **JWT authentication** as alternative to cookies
- [ ] **Rate limiting** and API throttling
- [ ] **OpenAPI export** for Postman/Insomnia
- [ ] **Docker containerization**
- [ ] **CI/CD pipeline** setup
- [ ] **Performance monitoring** and logging
- [ ] **Caching layer** (Redis)
- [ ] **Email notifications** for report status changes

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ivan Derlich**

- 🌐 Website: [ivanderlich.com](https://ivanderlich.com)
- 📧 Email: [a@ivanderlich.com](mailto:a@ivanderlich.com)
- 💼 LinkedIn: [Ivan Derlich](https://linkedin.com/in/ivanderlich)

---

<div align="center">

**⭐ If you found this project helpful, please give it a star!**

Made with ❤️ by [Ivan Derlich](https://ivanderlich.com)

</div>
