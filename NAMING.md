# NAMING.md

# Naming Conventions

This document defines naming conventions for NALUM v2.

Consistency is more important than personal preference.

---

# General Rules

Names should describe intent.

A developer should understand what something does without opening its implementation.

Avoid abbreviations unless universally understood.

Prefer clarity over brevity.

---

# File Names

Use lowercase.

Separate words with dots.

Pattern:

feature.role.ts

Examples:

auth.service.ts

auth.controller.ts

user.repository.ts

event.routes.ts

notification.schema.ts

Do not use:

AuthService.ts

helper.ts

temp.ts

newFile.ts

---

# Folder Names

Use lowercase.

Use singular feature names.

Good:

auth

user

profile

event

notification

chat

Bad:

Helpers

Controllers

Utils2

New

---

# Variables

Use camelCase.

Good:

currentUser

refreshToken

profileImage

connectionRequest

Bad:

Data

TEMP

obj

value1

x

---

# Constants

Use UPPER_SNAKE_CASE.

Examples:

JWT_EXPIRATION

MAX_LOGIN_ATTEMPTS

DEFAULT_PAGE_SIZE

UPLOAD_DIRECTORY

---

# Classes

Use PascalCase.

Examples:

AuthService

UserRepository

NotificationWorker

AppError

---

# Interfaces

Use PascalCase.

Do not prefix with I.

Good:

User

LoginRequest

AuthenticatedRequest

Bad:

IUser

ILoginRequest

---

# Types

Use PascalCase.

Examples:

CreatePostInput

UpdateProfileRequest

NotificationPayload

---

# Enums

Enum names:

PascalCase

Members:

UPPER_CASE

Example:

UserRole

ADMIN

ALUMNI

STUDENT

---

# Functions

Functions should describe actions.

Examples:

createUser()

updateProfile()

deleteComment()

findUserByEmail()

verifyPassword()

sendNotification()

calculateAttendance()

Avoid:

handle()

execute()

process()

helper()

doStuff()

---

# Boolean Variables

Always start with:

is

has

can

should

Examples:

isVerified

hasPermission

canEdit

shouldNotify

Avoid:

verified

permission

flag

status

---

# Collections

Plural names.

Examples:

users

posts

notifications

events

comments

Never:

userList

array

data

---

# Database Tables

Use snake_case.

Plural names.

Examples:

users

posts

event_registrations

connection_requests

notifications

---

# Database Columns

Use snake_case.

Examples:

created_at

updated_at

profile_image

user_id

event_id

---

# API Routes

Use plural resources.

Good:

GET /users

GET /users/:id

POST /users

PUT /users/:id

DELETE /users/:id

Nested resources:

GET /users/:id/posts

POST /events/:id/register

Avoid verbs in URLs.

Bad:

/createUser

/getPosts

/deleteEvent

---

# Environment Variables

UPPER_SNAKE_CASE.

Examples:

DATABASE_URL

REDIS_URL

JWT_SECRET

PORT

NODE_ENV

---

# Error Classes

End with Error.

Examples:

ValidationError

AuthenticationError

ConflictError

NotFoundError

ForbiddenError

---

# DTOs / Payloads

Suffix with purpose.

Examples:

CreateUserInput

UpdateProfileRequest

LoginResponse

NotificationPayload

---

# Test Files

Same name as implementation.

Examples:

auth.service.test.ts

user.repository.test.ts

event.controller.test.ts

---

# Git Branches

feature/user-profile

feature/chat

bugfix/auth-refresh

refactor/event-service

docs/backend-guide

---

# Commits

Use Conventional Commits.

Examples:

feat: add alumni search

fix: handle expired refresh token

refactor: simplify auth service

docs: update backend architecture

test: add event controller tests

---

# Final Rule

If another developer cannot understand the purpose of a variable, function, file, or class from its name alone, rename it.

Good names eliminate the need for many comments.
