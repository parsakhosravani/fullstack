# Architecture Overview

This document provides a comprehensive overview of the fullstack application architecture, design decisions, and system components.

## 📋 Table of Contents

- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Design Patterns](#design-patterns)
- [Database Design](#database-design)
- [API Architecture](#api-architecture)
- [Security Architecture](#security-architecture)
- [Scalability Considerations](#scalability-considerations)
- [Performance Optimization](#performance-optimization)

## 🏗 System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Web Browser  │  Mobile App  │  Desktop App  │  API Clients │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                     │
├─────────────────────────────────────────────────────────────┤
│                Next.js Frontend Application                │
│  • React Components    • State Management (React Query)    │
│  • Routing (Next.js)   • UI Components (Tailwind CSS)     │
│  • Client-side Logic   • Form Validation                  │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                     │
├─────────────────────────────────────────────────────────────┤
│                    Nginx Load Balancer                     │
│  • SSL Termination     • Rate Limiting                     │
│  • Load Balancing      • Static File Serving               │
│  • Request Routing     • Security Headers                  │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                      │
├─────────────────────────────────────────────────────────────┤
│                   Express.js Backend API                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │Controllers  │ │ Middleware  │ │   Routes    │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │  Services   │ │ Validators  │ │   Utils     │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                      Business Layer                        │
├─────────────────────────────────────────────────────────────┤
│                    Business Logic Services                 │
│  • User Management     • Authentication & Authorization    │
│  • Data Processing     • Business Rules & Validation       │
│  • External APIs       • Event Handling                   │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Access Layer                     │
├─────────────────────────────────────────────────────────────┤
│                      Prisma ORM                           │
│  • Database Abstraction  • Query Building                  │
│  • Migration Management  • Type Safety                     │
│  • Connection Pooling    • Transaction Management          │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                      Storage Layer                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ PostgreSQL  │    │    Redis    │    │ File System │     │
│  │ (Primary)   │    │   (Cache)   │    │  (Uploads)  │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

```
User Request → Nginx → Express API → Business Service → Prisma → Database
     ↑                                                                │
     └── Next.js Frontend ← JSON Response ← Controller ←─────────────┘
```

## 🔧 Technology Stack

### Frontend Technologies

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Framework** | Next.js 13+ | React framework with SSR/SSG |
| **UI Library** | React 18+ | Component-based UI development |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **State Management** | React Query | Server state management |
| **Forms** | React Hook Form | Form handling and validation |
| **Type Safety** | TypeScript | Static type checking |
| **Build Tool** | Next.js Built-in | Webpack-based bundling |

### Backend Technologies

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Runtime** | Node.js 18+ | JavaScript runtime environment |
| **Framework** | Express.js | Web application framework |
| **Language** | TypeScript | Type-safe JavaScript |
| **ORM** | Prisma | Database toolkit and ORM |
| **Database** | PostgreSQL | Relational database |
| **Caching** | Redis | In-memory data store |
| **Authentication** | JWT | Stateless authentication |
| **Validation** | Zod | Schema validation |

### DevOps & Infrastructure

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Containerization** | Docker | Application containerization |
| **Orchestration** | Docker Compose | Multi-container applications |
| **Reverse Proxy** | Nginx | Load balancing and SSL termination |
| **CI/CD** | GitHub Actions | Automated testing and deployment |
| **Monitoring** | Sentry | Error tracking and monitoring |
| **Logging** | Winston | Structured logging |

## 🎨 Design Patterns

### 1. Layered Architecture

The application follows a layered architecture pattern:

```
┌─────────────────┐
│ Presentation    │ ← Controllers, Routes, Middleware
├─────────────────┤
│ Business Logic  │ ← Services, Validators, Business Rules
├─────────────────┤
│ Data Access     │ ← ORM, Database Queries, Caching
├─────────────────┤
│ Data Storage    │ ← Database, File System, External APIs
└─────────────────┘
```

### 2. MVC (Model-View-Controller)

**Backend Structure:**
- **Models**: Prisma schemas define data structure
- **Views**: JSON responses (API endpoints)
- **Controllers**: Handle HTTP requests and responses

**Frontend Structure:**
- **Models**: TypeScript interfaces and API client functions
- **Views**: React components and pages
- **Controllers**: Custom hooks and context providers

### 3. Repository Pattern

```typescript
// Abstract repository interface
interface IUserRepository {
  findById(id: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;
}

// Concrete implementation
class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
  // ... other methods
}
```

### 4. Service Layer Pattern

```typescript
// User service handling business logic
class UserService {
  constructor(
    private userRepository: IUserRepository,
    private emailService: IEmailService
  ) {}

  async createUser(userData: CreateUserData): Promise<User> {
    // Business logic validation
    if (await this.userRepository.findByEmail(userData.email)) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword
    });

    // Send welcome email
    await this.emailService.sendWelcomeEmail(user);

    return user;
  }
}
```

### 5. Middleware Pattern

```typescript
// Authentication middleware
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

## 🗄 Database Design

### Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│      User       │     │     Session     │     │     Profile     │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (UUID)       │────▶│ id (UUID)       │     │ id (UUID)       │
│ email (unique)  │     │ userId          │     │ userId (FK)     │
│ password        │     │ token           │     │ firstName       │
│ role            │     │ expiresAt       │     │ lastName        │
│ isActive        │     │ createdAt       │     │ avatar          │
│ createdAt       │     └─────────────────┘     │ bio             │
│ updatedAt       │                             │ createdAt       │
└─────────────────┘                             │ updatedAt       │
        │                                       └─────────────────┘
        │                                               ▲
        └───────────────────────────────────────────────┘
```

### Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      Role     @default(USER)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  profile   Profile?
  sessions  Session[]

  @@map("users")
}

model Profile {
  id        String   @id @default(cuid())
  userId    String   @unique
  firstName String?
  lastName  String?
  avatar    String?
  bio       String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("profiles")
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

enum Role {
  USER
  ADMIN
}
```

### Database Optimization

#### Indexing Strategy

```sql
-- User table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_role ON users(role);

-- Session table indexes  
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
```

#### Connection Pooling

```typescript
// prisma/client.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

## 🔌 API Architecture

### RESTful API Design

#### Resource-Based URLs

```
GET    /api/v1/users          # Get all users
GET    /api/v1/users/:id      # Get specific user  
POST   /api/v1/users          # Create user
PUT    /api/v1/users/:id      # Update user
DELETE /api/v1/users/:id      # Delete user

GET    /api/v1/users/:id/profile    # Get user profile
PUT    /api/v1/users/:id/profile    # Update user profile
```

#### Response Format Standardization

```typescript
// utils/apiResponse.ts
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  requestId: string;
}

export const createSuccessResponse = <T>(
  data: T,
  message = 'Success'
): ApiResponse<T> => ({
  success: true,
  data,
  message,
  timestamp: new Date().toISOString(),
  requestId: generateRequestId(),
});

export const createErrorResponse = (
  code: string,
  message: string,
  details?: any
): ApiResponse => ({
  success: false,
  error: { code, message, details },
  timestamp: new Date().toISOString(),
  requestId: generateRequestId(),
});
```

#### Input Validation

```typescript
// validators/userValidator.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain letters and numbers'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
  }),
});

export const validateCreateUser = validate(createUserSchema);
```

### API Versioning Strategy

#### URL Versioning

```typescript
// routes/index.ts
const router = express.Router();

// Version 1
router.use('/api/v1', v1Routes);

// Version 2 (future)
router.use('/api/v2', v2Routes);

export default router;
```

## 🔒 Security Architecture

### Authentication Flow

```
1. User Login Request
   ↓
2. Validate Credentials
   ↓
3. Generate JWT Access Token (15 min TTL)
   ↓
4. Generate Refresh Token (7 days TTL)
   ↓
5. Store Refresh Token in Database
   ↓
6. Return Both Tokens to Client
   ↓
7. Client Stores Tokens (HttpOnly Cookies)
   ↓
8. Client Uses Access Token for API Requests
   ↓
9. When Access Token Expires → Use Refresh Token
   ↓
10. Generate New Access Token
```

### Authorization Middleware

```typescript
// middleware/authorization.ts
export const authorize = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Usage
router.get('/admin/users', authenticate, authorize([Role.ADMIN]), getUsersController);
```

### Data Encryption

```typescript
// utils/encryption.ts
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Password hashing
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

// Sensitive data encryption
export const encrypt = (text: string): string => {
  const algorithm = 'aes-256-gcm';
  const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipher(algorithm, key);
  cipher.setAAD(Buffer.from('additional-data'));
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;
};
```

### Rate Limiting Strategy

```typescript
// middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

const redisClient = new Redis(process.env.REDIS_URL);

// General API rate limiting
export const generalLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
});

// Stricter limits for authentication endpoints
export const authLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  skipSuccessfulRequests: true,
});
```

## 📈 Scalability Considerations

### Horizontal Scaling

#### Load Balancer Configuration

```nginx
# nginx.conf
upstream backend_servers {
    least_conn;
    server backend-1:3001 weight=3;
    server backend-2:3001 weight=3;
    server backend-3:3001 weight=2;
}

server {
    location /api/ {
        proxy_pass http://backend_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

#### Stateless Design

```typescript
// Stateless JWT authentication
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // No server-side session storage
  // All state contained in JWT token
  const token = extractTokenFromRequest(req);
  const decoded = verifyJWTToken(token);
  req.user = decoded;
  next();
};
```

### Database Scaling

#### Read Replicas

```typescript
// prisma/client.ts
export const masterDb = new PrismaClient({
  datasources: {
    db: { url: process.env.MASTER_DATABASE_URL }
  }
});

export const replicaDb = new PrismaClient({
  datasources: {
    db: { url: process.env.REPLICA_DATABASE_URL }
  }
});

// Service layer usage
class UserService {
  async getUser(id: string) {
    // Read from replica
    return replicaDb.user.findUnique({ where: { id } });
  }

  async createUser(data: CreateUserData) {
    // Write to master
    return masterDb.user.create({ data });
  }
}
```

#### Connection Pooling

```typescript
// config/database.ts
export const databaseConfig = {
  connectionLimit: 20,
  acquireTimeoutMillis: 60000,
  createTimeoutMillis: 30000,
  destroyTimeoutMillis: 5000,
  idleTimeoutMillis: 900000,
  reapIntervalMillis: 1000,
  createRetryIntervalMillis: 200,
};
```

### Caching Strategy

#### Multi-Level Caching

```
1. Browser Cache (Static Assets)
   ↓
2. CDN Cache (Images, CSS, JS)
   ↓
3. Application Cache (Redis)
   ↓
4. Database Query Cache
   ↓
5. Database
```

#### Redis Caching Implementation

```typescript
// services/cacheService.ts
class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
  }

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  async set(key: string, value: any, ttl = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  async invalidate(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}

// Usage in service
class UserService {
  async getUser(id: string): Promise<User | null> {
    const cacheKey = `user:${id}`;
    
    // Try cache first
    let user = await this.cacheService.get<User>(cacheKey);
    
    if (!user) {
      // Fetch from database
      user = await this.userRepository.findById(id);
      
      if (user) {
        // Cache for 1 hour
        await this.cacheService.set(cacheKey, user, 3600);
      }
    }
    
    return user;
  }
}
```

## ⚡ Performance Optimization

### Frontend Optimization

#### Code Splitting

```typescript
// pages/dashboard.tsx
import dynamic from 'next/dynamic';

// Lazy load heavy components
const DataVisualization = dynamic(
  () => import('../components/DataVisualization'),
  {
    loading: () => <div>Loading chart...</div>,
    ssr: false, // Disable SSR for client-only components
  }
);

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <DataVisualization />
    </div>
  );
};
```

#### Bundle Analysis

```json
// package.json
{
  "scripts": {
    "analyze": "cross-env ANALYZE=true next build"
  }
}
```

### Backend Optimization

#### Database Query Optimization

```typescript
// Optimized query with select and include
const getUsers = async (page = 1, limit = 20) => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
          avatar: true,
        }
      }
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      createdAt: 'desc'
    }
  });
};

// Batch operations
const createMultipleUsers = async (users: CreateUserData[]) => {
  return prisma.user.createMany({
    data: users,
    skipDuplicates: true, // Skip users with duplicate emails
  });
};
```

#### Response Compression

```typescript
// app.ts
import compression from 'compression';

app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6,
  threshold: 1024,
}));
```

### Monitoring and Analytics

#### Performance Metrics

```typescript
// utils/metrics.ts
import { performance } from 'perf_hooks';

export const measureExecutionTime = async <T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> => {
  const start = performance.now();
  
  try {
    const result = await fn();
    const end = performance.now();
    
    logger.info(`${operation} completed in ${end - start}ms`);
    
    // Send to monitoring service
    analytics.timing(operation, end - start);
    
    return result;
  } catch (error) {
    const end = performance.now();
    logger.error(`${operation} failed after ${end - start}ms`, { error });
    throw error;
  }
};

// Usage
const users = await measureExecutionTime('getUsersList', () =>
  userService.getUsers(page, limit)
);
```

## 📚 Additional Considerations

### Error Handling Strategy

```typescript
// utils/errors.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // Log unexpected errors
  logger.error('Unexpected error:', err);
  
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong',
    },
  });
};
```

### Testing Strategy

```typescript
// tests/integration/user.test.ts
describe('User API Integration Tests', () => {
  beforeEach(async () => {
    // Setup test database
    await setupTestDatabase();
  });

  afterEach(async () => {
    // Cleanup test data
    await cleanupTestDatabase();
  });

  describe('POST /api/v1/users', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(201);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe(userData.email);
    });
  });
});
```

This architecture provides a solid foundation for a scalable, maintainable, and secure fullstack application. The design patterns and strategies outlined here can be adapted based on specific requirements and scaling needs.