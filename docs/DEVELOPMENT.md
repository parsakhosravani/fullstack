# Development Guide

This guide covers everything you need to know to start developing with this fullstack project.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Debugging](#debugging)
- [Performance](#performance)

## 🔧 Prerequisites

### Required Software

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v8.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** (v2.30.0 or higher)
- **Docker** (optional, for containerized development)

### Recommended Tools

- **Visual Studio Code** with recommended extensions:
  - TypeScript and JavaScript Language Features
  - ESLint
  - Prettier
  - Auto Rename Tag
  - GitLens
  - Thunder Client (for API testing)

## 🛠 Environment Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/parsakhosravani/fullstack.git
cd fullstack

# Install dependencies
npm install
# or
yarn install
```

### 2. Environment Configuration

Create environment files for different environments:

#### `.env` (Development)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fullstack_dev"

# Server Configuration
API_PORT=3001
API_HOST=localhost
NODE_ENV=development

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
FRONTEND_PORT=3000

# Authentication
JWT_SECRET=your-super-secret-jwt-key-for-development
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret

# External APIs
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (for development, use a service like Mailtrap)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-user
SMTP_PASS=your-mailtrap-password

# File Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5MB
```

#### `.env.test` (Testing)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/fullstack_test"
NODE_ENV=test
JWT_SECRET=test-jwt-secret
```

### 3. Database Setup

```bash
# Install and start PostgreSQL (if using locally)
# For Docker:
docker run --name fullstack-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

## 📁 Project Structure

```
fullstack/
├── frontend/                 # Next.js frontend application
│   ├── components/          # Reusable React components
│   ├── pages/              # Next.js pages and API routes
│   ├── styles/             # CSS and styling files
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Frontend utilities
│   └── types/              # TypeScript type definitions
├── backend/                 # Express.js backend application
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models (Prisma)
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic layer
│   │   ├── utils/          # Backend utilities
│   │   └── types/          # Backend TypeScript types
│   └── prisma/             # Database schema and migrations
├── shared/                  # Shared code between frontend and backend
│   ├── types/              # Shared TypeScript types
│   ├── utils/              # Shared utilities
│   └── constants/          # Shared constants
├── tests/                   # Test files
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── e2e/                # End-to-end tests
└── docs/                    # Documentation
```

## 🔄 Development Workflow

### Starting Development Servers

```bash
# Start both frontend and backend in development mode
npm run dev

# Or start them separately:
npm run dev:frontend  # Starts Next.js dev server on port 3000
npm run dev:backend   # Starts Express server on port 3001
```

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only

# Building
npm run build           # Build both frontend and backend
npm run build:frontend  # Build frontend only
npm run build:backend   # Build backend only

# Testing
npm test               # Run all tests
npm run test:unit      # Run unit tests
npm run test:integration # Run integration tests
npm run test:e2e       # Run end-to-end tests
npm run test:watch     # Run tests in watch mode

# Code Quality
npm run lint           # Lint all code
npm run lint:fix       # Fix linting issues
npm run format         # Format code with Prettier
npm run type-check     # TypeScript type checking

# Database
npm run db:migrate     # Run database migrations
npm run db:generate    # Generate Prisma client
npm run db:studio      # Open Prisma Studio
npm run db:seed        # Seed database with sample data
```

### Creating New Features

1. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Backend Development**:
   - Create models in `backend/prisma/schema.prisma`
   - Add controllers in `backend/src/controllers/`
   - Define routes in `backend/src/routes/`
   - Write services in `backend/src/services/`
   - Add tests in `tests/`

3. **Frontend Development**:
   - Create components in `frontend/components/`
   - Add pages in `frontend/pages/`
   - Create hooks in `frontend/hooks/`
   - Add styles using Tailwind CSS

4. **Testing**:
   ```bash
   npm test -- --testPathPattern=your-feature
   ```

5. **Commit and Push**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

## 🧪 Testing

### Test Structure

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and database interactions
- **E2E Tests**: Test complete user workflows

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- UserService.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should create user"
```

### Writing Tests

#### Backend Tests (Jest + Supertest)

```typescript
// tests/unit/services/UserService.test.ts
import { UserService } from '../../../backend/src/services/UserService';
import { prismaMock } from '../../mocks/prisma';

describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123'
      };

      prismaMock.user.create.mockResolvedValue({
        id: '1',
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const result = await UserService.createUser(userData);

      expect(result).toHaveProperty('id');
      expect(result.email).toBe(userData.email);
    });
  });
});
```

#### Frontend Tests (Jest + React Testing Library)

```typescript
// tests/unit/components/UserProfile.test.tsx
import { render, screen } from '@testing-library/react';
import { UserProfile } from '../../../frontend/components/UserProfile';

describe('UserProfile', () => {
  it('renders user information correctly', () => {
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com'
    };

    render(<UserProfile user={user} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
```

## 📊 Code Quality

### Linting and Formatting

The project uses ESLint and Prettier for code quality:

```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint:fix

# Format code with Prettier
npm run format
```

### Pre-commit Hooks

Husky is configured to run quality checks before commits:

- Lint staged files
- Run type checking
- Run relevant tests

### Code Review Checklist

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] No new linting errors
- [ ] TypeScript types are properly defined
- [ ] Documentation is updated
- [ ] Performance considerations addressed
- [ ] Security best practices followed

## 🐛 Debugging

### Backend Debugging

#### Using VS Code Debugger

1. Create `.vscode/launch.json`:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Debug Backend",
         "type": "node",
         "request": "launch",
         "program": "${workspaceFolder}/backend/src/server.ts",
         "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"],
         "env": {
           "NODE_ENV": "development"
         },
         "runtimeArgs": ["-r", "ts-node/register"],
         "restart": true
       }
     ]
   }
   ```

2. Set breakpoints in your code
3. Press F5 to start debugging

#### Console Debugging

```typescript
// Use structured logging
import { logger } from '../utils/logger';

logger.info('User created', { userId: user.id, email: user.email });
logger.error('Failed to create user', { error: error.message });
```

### Frontend Debugging

#### React DevTools

1. Install React DevTools browser extension
2. Use the Components and Profiler tabs

#### Console Debugging

```typescript
// Development only debugging
if (process.env.NODE_ENV === 'development') {
  console.log('Component props:', props);
  console.log('Component state:', state);
}
```

### Database Debugging

#### Prisma Studio

```bash
npx prisma studio
```

#### SQL Query Logging

Add to your Prisma client configuration:

```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

## ⚡ Performance

### Backend Performance

#### Monitoring

- Use tools like New Relic or DataDog for production monitoring
- Implement health check endpoints
- Monitor database query performance

#### Optimization

```typescript
// Database query optimization
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true
  }, // Only select needed fields
  take: 20, // Limit results
  skip: offset, // Implement pagination
});

// Caching with Redis
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

const cachedUser = await redis.get(`user:${userId}`);
if (cachedUser) {
  return JSON.parse(cachedUser);
}
```

### Frontend Performance

#### Bundle Analysis

```bash
# Analyze bundle size
npm run analyze
```

#### Performance Monitoring

```typescript
// Web Vitals monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

#### Optimization Techniques

- Use React.memo for expensive components
- Implement code splitting with dynamic imports
- Optimize images with Next.js Image component
- Use SWR or React Query for data fetching

## 🚀 Next Steps

After completing the development setup:

1. Review the [API Documentation](./API.md)
2. Check out the [Architecture Overview](./ARCHITECTURE.md)
3. Read the [Deployment Guide](./DEPLOYMENT.md)
4. Explore example implementations in the codebase

Need help? Create an issue or check our [Contributing Guide](../CONTRIBUTING.md).