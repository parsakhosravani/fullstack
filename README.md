# Fullstack MERN Application

A comprehensive MERN (MongoDB, Express, React, Node.js) stack application with modern testing setup.

## Project Structure

```
fullstack/
├── client/          # React frontend
│   ├── src/         # React components and utilities
│   ├── __tests__/   # Frontend tests
│   └── package.json # Frontend dependencies
├── server/          # Express backend
│   ├── src/         # Server code and utilities
│   ├── __tests__/   # Backend tests
│   └── package.json # Backend dependencies
└── package.json     # Root package with scripts
```

## Testing Setup

This project uses Jest for both frontend and backend testing:

### Backend Testing
- **Framework**: Jest with Node.js environment
- **API Testing**: Supertest for HTTP endpoint testing
- **Location**: `server/__tests__/`

### Frontend Testing
- **Framework**: Jest with jsdom environment
- **React Testing**: React Testing Library
- **DOM Assertions**: Jest-DOM matchers
- **Location**: `client/__tests__/`

## Getting Started

### Install Dependencies

```bash
# Install all dependencies (frontend and backend)
npm run install:all

# Or install separately
npm run install:server  # Backend dependencies
npm run install:client  # Frontend dependencies
```

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage reports
npm run test:coverage

# Run only server tests
npm run test:server

# Run only client tests
npm run test:client
```

## Test Examples

The project includes sample tests to demonstrate the testing setup:

- **Server**: `server/__tests__/utils.test.js` - Tests utility functions
- **Client**: `client/__tests__/Welcome.test.js` - Tests React component

## Next Steps

1. Set up Express server with MongoDB connection
2. Create React components and routing
3. Implement authentication and API endpoints
4. Add integration tests
5. Set up CI/CD pipeline with automated testing