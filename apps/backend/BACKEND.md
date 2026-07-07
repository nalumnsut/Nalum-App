# BACKEND.md

# Backend Engineering Guide

This document defines the backend architecture, coding standards, naming conventions, and implementation rules for NALUM v2.

These rules are mandatory for both human contributors and AI-assisted development.

---

# Technology Stack

* Fastify
* TypeScript
* PostgreSQL
* Redis
* Docker
* BullMQ
* Zod
* Pino

---

# Backend Philosophy

The backend should be:

* Modular
* Predictable
* Readable
* Testable
* Secure
* Easy to extend

The goal is not writing less code.

The goal is writing code that remains understandable years later.

---

# Project Structure

```text
src/

├── config/
├── database/
├── modules/
├── middlewares/
├── plugins/
├── queues/
├── errors/
├── lib/
├── types/
├── utils/
├── app.ts
└── server.ts
```

---

# Feature Structure

Each feature owns its own implementation.

Example:

```text
modules/

    auth/

        auth.routes.ts

        auth.controller.ts

        auth.service.ts

        auth.repository.ts

        auth.schema.ts

        auth.types.ts

        auth.test.ts
```

Never place feature-specific code outside its module.

---

# Request Flow

Every request follows exactly this order.

```
Request

↓

Route

↓

Validation

↓

Controller

↓

Service

↓

Repository

↓

Database
```

No layer may skip another layer.

---

# Layer Responsibilities

## Routes

Responsible only for:

* endpoint registration
* middleware
* validation

No business logic.

---

## Controllers

Responsible only for:

* reading request
* calling services
* formatting response

Controllers should remain small.

---

## Services

Responsible for:

* business logic
* workflows
* authorization
* application rules

Services must never:

* access req
* access res
* perform HTTP operations

---

## Repositories

Repositories are the only layer allowed to access PostgreSQL.

Repositories should never contain:

* validation
* authorization
* business logic

---

# Validation

Every request must be validated before reaching the controller.

Use Zod schemas.

Controllers should assume all incoming data is already valid.

---

# Error Handling

Always throw typed errors.

Never return error objects.

Example hierarchy:

AppError

↓

ValidationError

AuthenticationError

ConflictError

ForbiddenError

NotFoundError

Global error middleware is responsible for generating HTTP responses.

---

# Logging

Use structured logging.

Never use console.log.

Logs should contain:

* timestamp
* requestId
* log level
* message

Never log:

* passwords
* JWTs
* secrets
* personal information

---

# Dependency Rules

Allowed:

Route

↓

Controller

↓

Service

↓

Repository

↓

Database

Forbidden:

Repository → Controller

Controller → Database

Service → HTTP

Route → Database

Circular imports

---

# Naming Conventions

## Files

Use lowercase.

Use feature prefixes.

Examples:

```
auth.service.ts

post.controller.ts

event.repository.ts

notification.schema.ts
```

---

## Variables

camelCase

Good:

```
userProfile

currentUser

refreshToken
```

Bad:

```
Data

TEMP

x

obj
```

---

## Functions

Functions should describe an action.

Good:

```
createUser()

updateProfile()

sendVerificationEmail()

findUserByEmail()

calculateAttendance()

verifyRegistration()
```

Avoid:

```
process()

execute()

handle()

helper()

doStuff()
```

---

## Classes

PascalCase

Examples:

```
UserService

AuthRepository

AppError

NotificationWorker
```

---

## Interfaces

PascalCase.

Avoid prefixing everything with "I".

Good:

```
User

AuthenticatedRequest

LoginResponse
```

---

## Types

PascalCase.

Examples:

```
CreateUserInput

UpdateProfileRequest

NotificationPayload
```

---

## Constants

UPPER_SNAKE_CASE

Examples:

```
MAX_LOGIN_ATTEMPTS

JWT_EXPIRATION

DEFAULT_PAGE_SIZE
```

---

## Enums

PascalCase

Members:

UPPER_CASE

Example:

```
UserRole

ADMIN

ALUMNI

STUDENT
```

---

# Function Rules

Every function should:

* perform one task
* have one clear purpose
* have descriptive names

Avoid functions longer than approximately 40–50 lines.

Large functions should be split.

---

# Async Rules

Always use async/await.

Avoid deeply nested Promise chains.

Long-running work belongs in queues.

---

# Configuration

Never hardcode:

* URLs
* Secrets
* Tokens
* Ports
* Credentials

Use validated environment variables.

Application should fail during startup if configuration is invalid.

---

# API Design

Endpoints should be:

```
GET

POST

PUT

PATCH

DELETE
```

Use proper HTTP status codes.

Version every endpoint.

```
/api/
```

---

# Response Format

Success

```json
{
  "success": true,
  "data": {},
  "message": ""
}
```

Failure

```json
{
  "success": false,
  "error": {
    "code": "",
    "message": ""
  }
}
```

Responses must remain consistent.

---

# Database Rules

* Prefer foreign keys.
* Use transactions when modifying related records.
* Create indexes for frequently queried columns.
* Never duplicate data unnecessarily.
* Keep schema normalized unless denormalization is justified.

---

# Security Rules

Always:

* validate input
* sanitize user data
* hash passwords
* authenticate requests
* authorize actions

Never trust client input.

---

# Code Quality Checklist

Before merging code:

* Architecture followed
* No duplicate logic
* Naming is descriptive
* Validation exists
* Errors handled correctly
* No console.log
* No dead code
* No commented-out code
* No magic numbers
* Readable functions
* No unnecessary abstractions

---

# Final Rule

When multiple implementations are possible,

choose the implementation that is:

1. Easier to understand.
2. Easier to maintain.
3. More consistent with the existing codebase.

Consistency is more valuable than personal preference.
