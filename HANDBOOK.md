# HANDBOOK.md

# Contributing to NALUM v2

Welcome to NALUM v2.

This document defines the engineering standards every contributor must follow.

Whether code is written manually or generated with AI, these rules are mandatory.

Read this document before making your first contribution.

---

# Philosophy

We optimize for:

* Readability
* Maintainability
* Consistency
* Simplicity

Not cleverness.

Code will be read far more often than it is written.

---

# Before Writing Code

Ask yourself:

* Does this functionality already exist?
* Which module owns this feature?
* Which layer should this belong to?
* Am I solving the correct problem?
* Can I reuse existing code?

Never begin coding immediately.

Understand the problem first.

---

# Follow The Architecture

Every feature must follow the project architecture defined in PROJECT.md.

Never invent a different structure for your own feature.

Consistency across the project is more valuable than individual preferences.

---

# Respect Module Boundaries

Every feature owns its own code.

Do not place business logic inside unrelated modules.

Do not directly access another module's internals.

Use clearly defined public interfaces.

---

# Keep Code Simple

If there are two correct implementations,

choose the simpler one.

Future maintainability is more important than reducing a few lines of code.

---

# Understand AI Generated Code

Never merge code you do not understand.

Before accepting AI-generated code ask yourself:

* Can I explain what this code does?
* Does it follow our architecture?
* Is it readable?
* Is it secure?
* Is it necessary?

If the answer is no,

rewrite it.

---

# Avoid Duplication

Before creating a new function,

search the project.

If similar logic already exists,

reuse or refactor it.

Do not duplicate business logic.

---

# Naming

Names should explain intent.

Good examples:

* createEvent
* updateProfile
* verifyEmail
* searchAlumni

Bad examples:

* helper
* process
* data
* temp
* test

Code should read like English.

---

# Functions

Each function should have one responsibility.

Large functions should be split into smaller ones.

Prefer small, focused functions over large multipurpose ones.

---

# Comments

Do not comment obvious code.

Bad:

// Increment counter

counter++;

Good comments explain *why*, not *what*.

If code requires excessive comments,

consider simplifying it instead.

---

# Configuration

Never hardcode:

* secrets
* URLs
* ports
* credentials
* API keys
* environment-specific values

Configuration belongs in environment variables or configuration files.

---

# Error Handling

Never ignore errors.

Handle expected failures.

Unexpected failures should propagate to the global error handler.

Never leave empty catch blocks.

---

# Logging

Logs should help diagnose production issues.

Do not log:

* passwords
* JWT tokens
* secrets
* personal information

Every log should provide useful context.

---

# Security

Always assume client input is malicious.

Validate all incoming data.

Never trust identifiers supplied by clients.

Always authenticate before authorizing.

---

# Performance

Do not optimize prematurely.

Write code that is:

Correct

↓

Readable

↓

Maintainable

↓

Fast

Measure before optimizing.

---

# Code Reviews

During review ask:

* Is the code understandable?
* Is the architecture respected?
* Is there duplication?
* Is naming clear?
* Is validation present?
* Are errors handled correctly?
* Is the implementation unnecessarily complex?

Review the code, not the person.

---

# Before Creating a Pull Request

Confirm:

* Project builds successfully.
* No lint errors.
* No type errors.
* Tests pass.
* No debugging code remains.
* No commented-out code remains.
* Documentation is updated if necessary.

---

# Leave The Code Better

Whenever you modify a file,

improve it if possible.

Examples:

* Better naming
* Smaller functions
* Remove dead code
* Improve readability
* Remove duplication

Small improvements accumulate into a healthier codebase.

---

# When You Are Unsure

Do not guess.

Ask.

It is always cheaper to discuss architecture before implementation than to rewrite it later.

---

# Final Rule

Every contributor is responsible for maintaining the quality of the project.

Do not ask:

"Does this code work?"

Ask:

"Would I be happy maintaining this code two years from now?"

If the answer is no,

improve it before merging.
