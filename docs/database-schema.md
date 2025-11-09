# Database Schema Documentation

## Overview

The JAMB CBT Prep system uses PostgreSQL 15+ with a normalized relational schema optimized for exam management and analytics.

## Entity Relationship Diagram

```
schools ──┐
          │
          ├──< users ──┐
          │            │
subjects ─┼──< topics  │
          │      │     │
          │      │     ├──< exam_attempts ──< exam_responses
          │      │     │           │
          │      └──< questions    │
          │            │           │
          └──< passages┘           │
                                   │
exam_templates ──< exam_sections   │
       │                           │
       └──< exam_instances ────────┘

audit_logs (tracks all entities)
```

## Tables

### Core Entities

#### schools
Stores educational institutions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Unique identifier |
| name | varchar(255) | NOT NULL | School name |
| state | varchar(100) | NOT NULL | Nigerian state |
| lga | varchar(100) | NOT NULL | Local Government Area |
| type | varchar(20) | NOT NULL | 'public' or 'private' |
| address | text | NOT NULL | Physical address |
| created_at | timestamp | NOT NULL | Creation timestamp |

**Indexes**: state, lga, type

#### users
System users with role-based access.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Unique identifier |
| name | varchar(255) | NOT NULL | Full name |
| email | varchar(255) | NOT NULL, UNIQUE | Email address |
| hashed_password | varchar(255) | NOT NULL | Bcrypt hashed password |
| role | varchar(20) | NOT NULL | 'candidate', 'tutor', 'admin', 'school' |
| school_id | uuid | FK → schools | Associated school |
| cohort | varchar(10) | | 'SS1', 'SS2', 'SS3' |
| status | varchar(20) | NOT NULL | 'active' or 'inactive' |
| created_at | timestamp | NOT NULL | Creation timestamp |
| last_active_at | timestamp | NOT NULL | Last activity timestamp |

**Indexes**: email, role, school_id, status, cohort

### Question Bank

#### subjects
JAMB examination subjects.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Unique identifier |
| name | varchar(255) | NOT NULL | Subject name |
| code | varchar(10) | NOT NULL, UNIQUE | Subject code (e.g., 'ENG', 'MTH') |
| created_at | timestamp | NOT NULL | Creation timestamp |

**Indexes**: code

#### topics
Subject topics with hierarchical structure.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Unique identifier |
| subject_id | uuid | NOT NULL, FK → subjects | Parent subject |
| name | varchar(255) | NOT NULL | Topic name |
| parent_topic_id | uuid | FK → topics | Parent topic (for subtopics) |
| created_at | timestamp | NOT NULL | Creation timestamp |

**Indexes**: subject_id, parent_topic_id

#### passages
Reading passages for comprehension questions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Unique identifier |
| title | varchar(255) | | Passage title |
| content | text | NOT NULL | Passage text |
| subject_id | uuid | NOT NULL, FK → subjects | Associated subject |
| created_at | timestamp | NOT NULL | Creation timestamp |

**Indexes**: subject_id

#### questions
Question bank with multiple question types.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Unique identifier |
| subject_id | uuid | NOT NULL, FK → subjects | Question subject |
| topic_id | uuid | NOT NULL, FK → topics | Question topic |
| type | varchar(20) | NOT NULL | 'single-mcq', 'multiple-mcq', 'text', 'numerical' |
| stem | text | NOT NULL | Question text |
| passage_id | uuid | FK → passages | Associated passage (optional) |
| options | jsonb | NOT NULL | Answer options (for MCQ) |
| correct_answers | jsonb | NOT NULL | Correct answer(s) |
| explanation | text | | Answer explanation |
| difficulty | integer | NOT NULL | 1-5 difficulty level |
| tags | jsonb | NOT NULL | Question tags |
| media_urls | jsonb | NOT NULL | Associated media files |
| status | varchar(20) | NOT NULL | 'active' or 'deleted' |
| created_at | timestamp | NOT NULL | Creation timestamp |
| updated_at | timestamp | NOT NULL | Last update timestamp |

**Indexes**: subject_id, topic_id, type, difficulty, status, passage_id, tags (GIN)

**Options JSONB Structure**:
```json
[
  { "id": "A", "label": "A", "text": "Option text" },
  { "id": "B", "label": "B", "text": "Option text" }
]
```

#### question_tags
Many-to-many relationship for question tags.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| question_id | uuid | PK, FK → questions | Question reference |
| tag | varchar(100) | PK | Tag name |
| created_at | timestamp | NOT NULL | Creation timestamp |

**Indexes**: tag

### Exam System

#### exam_templates
Reusable exam configurations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Unique identifier |
| name | varchar(255) | NOT NULL | Template name |
| description | text | | Template description |
| created_by | uuid | NOT NULL, FK → users | Creator user |
| created_at | timestamp | NOT NULL | Creation timestamp |
| updated_at | timestamp | NOT NULL | Last update timestamp |

**Indexes**: created_by, created_at

#### exam_sections
Sections within exam templates.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Unique identifier |
| template_id | uuid | NOT NULL, FK → exam_templates | Parent template |
| subject_id | uuid | NOT NULL, FK → subjects | Section subject |
| time_limit_minutes | integer | NOT NULL | Time limit |
| num_questions | integer | NOT NULL | Number of questions |
| negative_marking | boolean | NOT NULL | Enable negative marking |
| negative_mark_value | decimal(3,2) | NOT NULL | Points deducted for wrong answers |
| shuffle_questions | boolean | NOT NULL | Randomize question order |
| shuffle_options | boolean | NOT NULL | Randomize option order |
| section_order | integer | NOT NULL | Display order |
| created_at | timestamp | NOT NULL | Creation timestamp |

**Indexes**: template_id, subject_id

#### exam_instances
Scheduled exam sessions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Unique identifier |
| template_id | uuid | NOT NULL, FK → exam_templates | Source template |
| name | varchar(255) | NOT NULL | Instance name |
| scheduled_at | timestamp | NOT NULL | Scheduled start time |
| duration_minutes | integer | NOT NULL | Total duration |
| allowed_roles | jsonb | NOT NULL | Roles allowed to take exam |
| status | varchar(20) | NOT NULL | 'scheduled', 'active', 'completed' |
| created_at | timestamp | NOT NULL | Creation timestamp |

**Indexes**: template_id, scheduled_at, status

#### exam_attempts
Candidate exam attempts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Unique identifier |
| user_id | uuid | NOT NULL, FK → users | Candidate |
| exam_instance_id | uuid | NOT NULL, FK → exam_instances | Exam instance |
| questions | jsonb | NOT NULL | Question IDs in order |
| flagged_questions | jsonb | NOT NULL | Flagged question IDs |
| started_at | timestamp | NOT NULL | Start time |
| submitted_at | timestamp | | Submission time |
| status | varchar(20) | NOT NULL | 'in-progress', 'completed', 'expired' |
| score | decimal(5,2) | | Final score |
| score_breakdown | jsonb | | Detailed score breakdown |
| created_at | timestamp | NOT NULL | Creation timestamp |

**Indexes**: user_id, exam_instance_id, status, started_at, submitted_at, (user_id, exam_instance_id, status)

**Score Breakdown JSONB Structure**:
```json
{
  "totalScore": 85.5,
  "maxScore": 100,
  "percentage": 85.5,
  "subjectScores": [
    { "subjectId": "uuid", "score": 42.5, "maxScore": 50 }
  ],
  "topicScores": [
    { "topicId": "uuid", "score": 8.5, "maxScore": 10 }
  ]
}
```

#### exam_responses
Individual question responses.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Unique identifier |
| attempt_id | uuid | NOT NULL, FK → exam_attempts | Parent attempt |
| question_id | uuid | NOT NULL, FK → questions | Question reference |
| response | jsonb | NOT NULL | Candidate's answer |
| time_spent_seconds | integer | NOT NULL | Time spent on question |
| is_correct | boolean | | Whether answer is correct |
| points_awarded | decimal(5,2) | | Points awarded |
| answered_at | timestamp | NOT NULL | Answer timestamp |
| updated_at | timestamp | NOT NULL | Last update timestamp |

**Indexes**: attempt_id, question_id

**Unique Constraint**: (attempt_id, question_id)

### Audit

#### audit_logs
System audit trail.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Unique identifier |
| user_id | uuid | FK → users | User who performed action |
| action | varchar(100) | NOT NULL | Action performed |
| entity_type | varchar(100) | NOT NULL | Entity type affected |
| entity_id | uuid | NOT NULL | Entity ID affected |
| changes | jsonb | | Changes made |
| ip_address | varchar(45) | | User IP address |
| user_agent | text | | User agent string |
| timestamp | timestamp | NOT NULL | Action timestamp |

**Indexes**: user_id, entity_type, entity_id, action, timestamp, (entity_type, entity_id, timestamp)

## Data Types

### JSONB Columns

JSONB is used for flexible, structured data:

- **questions.options**: Array of option objects
- **questions.correct_answers**: Array of correct answer IDs
- **questions.tags**: Array of tag strings
- **questions.media_urls**: Array of media URLs
- **exam_instances.allowed_roles**: Array of role strings
- **exam_attempts.questions**: Array of question IDs
- **exam_attempts.flagged_questions**: Array of question IDs
- **exam_attempts.score_breakdown**: Nested score object
- **exam_responses.response**: Answer value (string or array)
- **audit_logs.changes**: Object with changed fields

### UUID Generation

All primary keys use PostgreSQL's `gen_random_uuid()` function for UUID v4 generation.

### Timestamps

All timestamps use PostgreSQL's `timestamp` type without timezone, stored in UTC.

## Performance Considerations

### Indexes

- All foreign keys are indexed
- Frequently queried columns have indexes
- Composite indexes for common query patterns
- GIN indexes for JSONB columns

### Query Optimization

- Use prepared statements for repeated queries
- Leverage connection pooling (2-20 connections)
- Use read replicas for analytics queries
- Implement query result caching in Redis

### Partitioning (Future)

Consider partitioning for large tables:
- `exam_attempts` by date (monthly)
- `exam_responses` by date (monthly)
- `audit_logs` by date (monthly)

## Backup and Recovery

### Backup Strategy

- Automated daily backups
- Point-in-time recovery enabled
- 30-day retention period
- Cross-region replication

### Recovery Procedures

```bash
# Restore from backup
pg_restore -d jamb_cbt_prep backup_file.dump

# Point-in-time recovery
# Configure in postgresql.conf and use pg_basebackup
```

## Migrations

All schema changes are managed through migrations in `apps/backend/migrations/`.

See [migrations/README.md](../apps/backend/migrations/README.md) for details.
