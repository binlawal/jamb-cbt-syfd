/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Create exam_attempts table
  pgm.createTable('exam_attempts', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    exam_instance_id: {
      type: 'uuid',
      notNull: true,
      references: 'exam_instances',
      onDelete: 'CASCADE',
    },
    questions: { type: 'jsonb', notNull: true },
    flagged_questions: { type: 'jsonb', notNull: true, default: '[]' },
    started_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    submitted_at: { type: 'timestamp' },
    status: { type: 'varchar(20)', notNull: true, default: 'in-progress' },
    score: { type: 'decimal(5,2)' },
    score_breakdown: { type: 'jsonb' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create indexes for exam_attempts
  pgm.createIndex('exam_attempts', 'user_id');
  pgm.createIndex('exam_attempts', 'exam_instance_id');
  pgm.createIndex('exam_attempts', 'status');
  pgm.createIndex('exam_attempts', 'started_at');
  pgm.createIndex('exam_attempts', 'submitted_at');

  // Create composite index for preventing duplicate attempts
  pgm.createIndex('exam_attempts', ['user_id', 'exam_instance_id', 'status']);

  // Create exam_responses table
  pgm.createTable('exam_responses', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    attempt_id: {
      type: 'uuid',
      notNull: true,
      references: 'exam_attempts',
      onDelete: 'CASCADE',
    },
    question_id: {
      type: 'uuid',
      notNull: true,
      references: 'questions',
      onDelete: 'CASCADE',
    },
    response: { type: 'jsonb', notNull: true },
    time_spent_seconds: { type: 'integer', notNull: true, default: 0 },
    is_correct: { type: 'boolean' },
    points_awarded: { type: 'decimal(5,2)' },
    answered_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create indexes for exam_responses
  pgm.createIndex('exam_responses', 'attempt_id');
  pgm.createIndex('exam_responses', 'question_id');

  // Create unique constraint to prevent duplicate responses
  pgm.addConstraint('exam_responses', 'exam_responses_attempt_question_unique', {
    unique: ['attempt_id', 'question_id'],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('exam_responses');
  pgm.dropTable('exam_attempts');
};
