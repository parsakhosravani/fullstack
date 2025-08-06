# Deployment Guide

This guide covers deployment strategies and configurations for the fullstack application across different environments and platforms.

## 📋 Table of Contents

- [Overview](#overview)
- [Environment Setup](#environment-setup)
- [Docker Deployment](#docker-deployment)
- [Cloud Platforms](#cloud-platforms)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring & Logging](#monitoring--logging)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The application consists of:
- **Frontend**: Next.js application (React)
- **Backend**: Express.js API server
- **Database**: PostgreSQL
- **Caching**: Redis (optional)
- **File Storage**: Local or cloud storage

### Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │     Frontend    │    │     Backend     │
│     (Nginx)     │───▶│    (Next.js)    │───▶│   (Express)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                       ┌─────────────────┐            │
                       │      Redis      │◀───────────┤
                       │    (Cache)      │            │
                       └─────────────────┘            │
                                                       │
                       ┌─────────────────┐            │
                       │   PostgreSQL    │◀───────────┘
                       │   (Database)    │
                       └─────────────────┘
```

## 🛠 Environment Setup

### Environment Variables

Create environment-specific configuration files:

#### Production (.env.production)
```env
# Application
NODE_ENV=production
API_URL=https://your-domain.com/api/v1
FRONTEND_URL=https://your-domain.com

# Database
DATABASE_URL=postgresql://user:password@db-host:5432/fullstack_prod

# Security
JWT_SECRET=your-super-secure-jwt-secret-256-bits
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-super-secure-refresh-token-secret

# Redis
REDIS_URL=redis://redis-host:6379

# Email
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password

# File Upload
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=10MB

# External Services
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

#### Staging (.env.staging)
```env
NODE_ENV=staging
API_URL=https://staging.your-domain.com/api/v1
FRONTEND_URL=https://staging.your-domain.com
DATABASE_URL=postgresql://user:password@staging-db:5432/fullstack_staging
# ... other staging-specific variables
```

## 🐳 Docker Deployment

### Multi-stage Dockerfile

#### Frontend Dockerfile
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./

USER nodejs
EXPOSE 3001

CMD ["node", "dist/server.js"]
```

### Docker Compose

#### Production (docker-compose.yml)
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://backend:3001/api/v1
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/fullstack
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: fullstack
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

#### Nginx Configuration
```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }

    upstream backend {
        server backend:3001;
    }

    server {
        listen 80;
        server_name your-domain.com;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/ssl/certs/your-domain.crt;
        ssl_certificate_key /etc/ssl/certs/your-domain.key;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # API routes
        location /api/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Frontend routes
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

### Deployment Commands

```bash
# Build and start services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale backend=3

# Stop services
docker-compose down

# Update services
docker-compose pull
docker-compose up -d
```

## ☁️ Cloud Platforms

### AWS Deployment

#### Using AWS ECS with Fargate

1. **Create ECR repositories**:
   ```bash
   aws ecr create-repository --repository-name fullstack-frontend
   aws ecr create-repository --repository-name fullstack-backend
   ```

2. **Build and push images**:
   ```bash
   # Get login token
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

   # Build and tag images
   docker build -t fullstack-frontend ./frontend
   docker tag fullstack-frontend:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/fullstack-frontend:latest

   # Push images
   docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/fullstack-frontend:latest
   ```

3. **ECS Task Definition** (task-definition.json):
   ```json
   {
     "family": "fullstack-app",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "512",
     "memory": "1024",
     "executionRoleArn": "arn:aws:iam::YOUR_ACCOUNT:role/ecsTaskExecutionRole",
     "containerDefinitions": [
       {
         "name": "frontend",
         "image": "YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/fullstack-frontend:latest",
         "portMappings": [
           {
             "containerPort": 3000,
             "protocol": "tcp"
           }
         ],
         "essential": true,
         "environment": [
           {
             "name": "NODE_ENV",
             "value": "production"
           }
         ]
       }
     ]
   }
   ```

### Vercel (Frontend Only)

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-backend-api.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://your-backend-api.com/api/v1"
  }
}
```

### Heroku

#### Frontend (Heroku)
```json
// package.json
{
  "scripts": {
    "heroku-postbuild": "npm run build",
    "start": "next start -p $PORT"
  }
}
```

#### Backend (Heroku)
```yaml
# Procfile
web: node dist/server.js
release: npx prisma migrate deploy
```

### DigitalOcean App Platform

```yaml
# .do/app.yaml
name: fullstack-app
services:
- name: frontend
  source_dir: /frontend
  github:
    repo: your-username/fullstack
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  env:
  - key: NODE_ENV
    value: production

- name: backend
  source_dir: /backend
  github:
    repo: your-username/fullstack
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  env:
  - key: DATABASE_URL
    value: ${db.DATABASE_URL}

databases:
- name: db
  engine: PG
  version: "13"
```

## 🚀 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 18
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linter
      run: npm run lint

    - name: Run type check
      run: npm run type-check

    - name: Run tests
      run: npm test
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

  build:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'

    steps:
    - uses: actions/checkout@v3

    - name: Build Frontend
      run: |
        cd frontend
        npm ci
        npm run build

    - name: Build Backend
      run: |
        cd backend
        npm ci
        npm run build

    - name: Build Docker images
      run: |
        docker build -t fullstack-frontend ./frontend
        docker build -t fullstack-backend ./backend

  deploy:
    runs-on: ubuntu-latest
    needs: [test, build]
    if: github.ref == 'refs/heads/main'

    steps:
    - uses: actions/checkout@v3

    - name: Deploy to production
      run: |
        # Add your deployment script here
        echo "Deploying to production..."
        # Example: Deploy to AWS, DigitalOcean, etc.
```

### Deployment Scripts

#### deploy.sh
```bash
#!/bin/bash

set -e

echo "🚀 Starting deployment..."

# Pull latest changes
git pull origin main

# Build Docker images
docker-compose build

# Run database migrations
docker-compose run --rm backend npx prisma migrate deploy

# Update services with zero downtime
docker-compose up -d --no-deps --build frontend
docker-compose up -d --no-deps --build backend

# Clean up old images
docker image prune -f

echo "✅ Deployment completed successfully!"
```

## 📊 Monitoring & Logging

### Application Monitoring

#### Sentry Integration
```typescript
// backend/src/utils/sentry.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

#### Health Checks
```typescript
// backend/src/routes/health.ts
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

### Logging Configuration

#### Winston Logger
```typescript
// backend/src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'fullstack-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

## 🔒 Security Considerations

### SSL/TLS Configuration

```nginx
# nginx/ssl.conf
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;

ssl_session_timeout 1d;
ssl_session_cache shared:MozTLS:10m;
ssl_session_tickets off;

# OCSP stapling
ssl_stapling on;
ssl_stapling_verify on;
```

### Environment Security

```bash
# Secure environment variables
export JWT_SECRET="$(openssl rand -base64 32)"
export REFRESH_TOKEN_SECRET="$(openssl rand -base64 32)"
export DATABASE_PASSWORD="$(openssl rand -base64 16)"
```

### Security Headers

```typescript
// backend/src/middleware/security.ts
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Rate limiting
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

// Security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
});
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Database Connection Issues

```bash
# Check database connectivity
docker exec -it fullstack_postgres_1 psql -U postgres -d fullstack -c "SELECT 1"

# Check database logs
docker logs fullstack_postgres_1
```

#### 2. Memory Issues

```bash
# Monitor memory usage
docker stats

# Increase memory limits in docker-compose.yml
services:
  backend:
    mem_limit: 1g
    memswap_limit: 1g
```

#### 3. Build Failures

```bash
# Clear Docker build cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Debugging Commands

```bash
# View application logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Execute commands in running containers
docker-compose exec backend npm run prisma:studio
docker-compose exec postgres psql -U postgres -d fullstack

# Check container health
docker-compose ps
docker inspect fullstack_backend_1
```

### Performance Monitoring

```bash
# Monitor resource usage
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Database performance
docker exec -it fullstack_postgres_1 psql -U postgres -c "
  SELECT query, mean_time, calls 
  FROM pg_stat_statements 
  ORDER BY mean_time DESC 
  LIMIT 10;
"
```

## 📚 Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/best-practices/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [AWS ECS Guide](https://docs.aws.amazon.com/ecs/)
- [Let's Encrypt SSL](https://letsencrypt.org/)
- [GitHub Actions Documentation](https://docs.github.com/actions)

For more detailed deployment instructions, check platform-specific documentation in the [docs/deployment/](./deployment/) directory.