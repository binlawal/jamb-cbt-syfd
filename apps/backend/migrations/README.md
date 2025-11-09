# Database Migrations

This directory contains all database migrations for the JAMB CBT Prep system.

## Migration Order

Migrations are executed in the following order:

1. **1700000001_create-users-and-schools.js** - Creates schools and users tables
2. **1700000002_create-subjects-and-topics.js** - Creates subjects and topics tables
3. **1700000003_create-passages-and-questions.js** - Creates passages, questions, and question_tags tables
4. **1700000004_create-exam-templates.js** - Creates exam_templates and exam_sections tables
5. **1700000005_create-exam-instances.js** - Creates exam_instances table
6. **1700000006_create-exam-attempts.js** - Creates exam_attempts and exam_responses tables
7. **1700000007_create-audit-logs.js** - Creates audit_logs table

## Running Migrations

### Prerequisites

1. Ensure PostgreSQL is running
2. Create a database: `createdb jamb_cbt_prep`
3. Set the `DATABASE_URL` environment variable in `.env`

### Commands

```bash
# Run all pending migrations
npm run migrate:up

# Rollback the last migration
npm run migrate:down

# Create a new migration
npm run migrate:create <migration-name>

# Check migration status
npm run migrate -- list
```

## After Running Migrations

After running migrations, seed the initial data:

```bash
# Seed subjects and topics
npm run seed:subjects
```

## Database Schema Overview

### Core Tables

- **schools** - Educational institutions
- **users** - System users (candidates, tutors, admins, schools)
- **subjects** - JAMB subjects (English, Mathematics, etc.)
- **topics** - Subject topics with hierarchical structure

### Question Bank

- **passages** - Reading passages for comprehension questions
- **questions** - Question bank with multiple types (MCQ, text, numerical)
- **question_tags** - Tags for question categorization

### Exam System

- **exam_templates** - Reusable exam configurations
- **exam_sections** - Sections within exam templates
- **exam_instances** - Scheduled exam sessions
- **exam_attempts** - Candidate exam attempts
- **exam_responses** - Individual question responses

### Audit

- **audit_logs** - System audit trail

## Indexes

All tables have appropriate indexes for performance:

- Foreign key columns
- Frequently queried columns (status, dates, etc.)
- Composite indexes for common query patterns
- GIN indexes for JSONB columns

## Notes

- All primary keys use UUID v4
- Timestamps use PostgreSQL's `timestamp` type
- JSONB is used for flexible data structures (options, responses, etc.)
- Soft deletes are implemented where needed (questions, users)
