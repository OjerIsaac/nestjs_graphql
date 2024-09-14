# NestJS GraphQL Authentication Service

This project is a NestJS application that provides a RESTful API with user authentication, registration, and biometric login functionalities using GraphQL. It uses Prisma as the ORM and JWT for authentication.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Database Migrations](#database-migrations)
- [Testing](#testing)
- [GraphQL Playground](#graphql-playground)
- [Project Structure](#project-structure)
- [License](#license)

## Prerequisites

Ensure you have the following installed:

- Node.js (version 18.x or later)
- PostgreSQL
- NPM

## Installation

1. **Clone the Repository**

   ```bash
   git clone git@github.com:OjerIsaac/nestjs_graphql.git
   cd nestjs_graphql
   ```

2. **Install Dependencies**

   Use npm to install the project dependencies.

   ```bash
   npm install
   ```

## Configuration

1. **Environment Variables**

   Create a `.env` file in the root directory and add the following environment variables:

   ```plaintext
   DATABASE_URL="postgresql://username:password@localhost:5432/yourdatabase"
   JWT_SECRET="your_jwt_secret"
   NODE_ENV=dev
   PORT="your_port"
   ```

   Replace the values with yours.

2. **Prisma Configuration**

   Prisma will be configured via the `prisma/schema.prisma` file. Ensure that the `DATABASE_URL` in your `.env` file matches the URL defined in `schema.prisma`.

## Running the Application

1. **Run the Application**

   Use the following command to start the NestJS application:

   ```bash
   npm run start:dev
   ```

   The application will be available at `http://localhost:3000/graphql`.

## Database Migrations

1. **Run Migrations**

   To apply the database schema changes, run the Prisma migration command:

   ```bash
   npx prisma migrate dev
   ```

   This command will apply the migrations and update your database schema.

2. **Generate Prisma Client**

   Generate the Prisma client after applying migrations:

   ```bash
   npx prisma generate
   ```

## Testing

To run the unit tests for the service, use:

```bash
npm test
```

## GraphQL Playground

Once the application is running, you can test the GraphQL API using GraphQL Playground. Navigate to `http://localhost:3000/graphql` in your browser. You can execute the following mutations and queries:

### Register a User

```graphql
mutation {
  register(email: "test@example.com", password: "password123") {
    id
    email
    biometricKey
    createdAt
    updatedAt
  }
}
```

### Login

```graphql
mutation {
  login(email: "test@example.com", password: "password123") {
    accessToken
  }
}
```

### Biometric Login

```graphql
mutation {
  biometricLogin(biometricKey: "biometricKey123") {
    id
    email
    biometricKey
    createdAt
    updatedAt
  }
}
```

## Project Structure

- `src/`: Contains the source code for the application.
  - `user/`: Contains user-related modules, services, resolvers, and models.
  - `prisma/`: Contains the Prisma service and schema.
  - `libs/`: Contains global interceptors and filters.
- `prisma/schema.prisma`: Prisma schema file for database modeling.
- `.env`: Environment variables file.