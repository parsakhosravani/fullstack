# API Documentation

This document describes the REST API endpoints available in the fullstack application.

## 📋 Table of Contents

- [Base Information](#base-information)
- [Authentication](#authentication)
- [User Management](#user-management)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [API Versioning](#api-versioning)

## 🌐 Base Information

### Base URL

```
Development: http://localhost:3001/api/v1
Production: https://your-domain.com/api/v1
```

### Content Type

All API requests and responses use JSON:

```
Content-Type: application/json
```

### Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "timestamp": "2025-01-01T12:00:00Z"
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  },
  "timestamp": "2025-01-01T12:00:00Z"
}
```

## 🔐 Authentication

### Overview

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### POST /auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2025-01-01T12:00:00Z"
    },
    "tokens": {
      "accessToken": "jwt-access-token",
      "refreshToken": "jwt-refresh-token"
    }
  },
  "message": "User registered successfully"
}
```

**Validation Errors (400):**
- Email already exists
- Invalid email format
- Password too weak (minimum 8 characters)
- Missing required fields

#### POST /auth/login

Authenticate user and receive tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "tokens": {
      "accessToken": "jwt-access-token",
      "refreshToken": "jwt-refresh-token"
    }
  },
  "message": "Login successful"
}
```

**Errors:**
- `401`: Invalid credentials
- `400`: Missing email or password

#### POST /auth/refresh

Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt-refresh-token"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-access-token"
  },
  "message": "Token refreshed successfully"
}
```

#### POST /auth/logout

Logout user and invalidate tokens.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### POST /auth/forgot-password

Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

#### POST /auth/reset-password

Reset password using reset token.

**Request Body:**
```json
{
  "token": "password-reset-token",
  "password": "newpassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

## 👤 User Management

All user endpoints require authentication.

### GET /users/profile

Get current user profile.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "2025-01-01T12:00:00Z",
    "updatedAt": "2025-01-01T12:00:00Z"
  }
}
```

### PUT /users/profile

Update current user profile.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Smith",
    "avatar": "https://example.com/new-avatar.jpg",
    "updatedAt": "2025-01-01T12:00:00Z"
  },
  "message": "Profile updated successfully"
}
```

### PUT /users/password

Change user password.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "currentPassword": "currentpassword",
  "newPassword": "newpassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Errors:**
- `400`: Current password incorrect
- `400`: New password too weak

### DELETE /users/account

Delete current user account.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "password": "currentpassword"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

## ❌ Error Handling

### Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `CONFLICT` | Resource already exists |
| `RATE_LIMITED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

### HTTP Status Codes

| Status | Usage |
|--------|--------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request / Validation Error |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
| `409` | Conflict |
| `422` | Unprocessable Entity |
| `429` | Too Many Requests |
| `500` | Internal Server Error |

### Error Response Examples

**Validation Error (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "fields": {
        "email": "Invalid email format",
        "password": "Password must be at least 8 characters"
      }
    }
  },
  "timestamp": "2025-01-01T12:00:00Z"
}
```

**Unauthorized (401):**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  },
  "timestamp": "2025-01-01T12:00:00Z"
}
```

**Rate Limited (429):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests, please try again later",
    "details": {
      "retryAfter": 60
    }
  },
  "timestamp": "2025-01-01T12:00:00Z"
}
```

## 🚦 Rate Limiting

The API implements rate limiting to prevent abuse:

### Limits

| Endpoint | Limit | Window |
|----------|--------|---------|
| `POST /auth/login` | 5 requests | 15 minutes |
| `POST /auth/register` | 3 requests | 15 minutes |
| `POST /auth/forgot-password` | 3 requests | 15 minutes |
| General API | 100 requests | 15 minutes |

### Headers

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 📚 API Versioning

### Current Version: v1

The API uses URL versioning:

```
/api/v1/endpoint
```

### Version Support Policy

- Current version: Full support and active development
- Previous version: Bug fixes only for 6 months
- Deprecated versions: 3 months notice before removal

### Migration Guides

When new versions are released, migration guides will be provided in:
- API changelog
- Breaking changes documentation
- Example migration code

## 🔧 Development Tools

### OpenAPI/Swagger

API documentation is available in OpenAPI format:

```
GET /api/docs
```

Interactive API explorer:

```
GET /api/docs/swagger
```

### Postman Collection

Import the Postman collection for easy API testing:

```json
{
  "info": {
    "name": "Fullstack API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\",\n  \"name\": \"Test User\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3001/api/v1"
    }
  ]
}
```

### cURL Examples

#### Register User

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

#### Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Get Profile

```bash
curl -X GET http://localhost:3001/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📝 Changelog

### v1.0.0
- Initial API release
- User authentication and management
- JWT token-based authentication
- Rate limiting implementation

For detailed changelog, see [CHANGELOG.md](../CHANGELOG.md)