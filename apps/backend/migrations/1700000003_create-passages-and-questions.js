/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Create passages table
  pgm.createTable('passages', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    title: { type: 'varchar(255)' },
    content: { type: 'text', notNull: true },
    subject_id: {
      type: 'uuid',
      notNull: true,
      references: 'subjects',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create index for passages
  pgm.createIndex('passages', 'subject_id');

  // Create questions table
  pgm.createTable('questions', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    subject_id: {
      type: 'uuid',
      notNull: true,
      references: 'subjects',
      onDelete: 'CASCADE',
    },
    topic_id: {
      type: 'uuid',
      notNull: true,
      references: 'topics',
      onDelete: 'CASCADE',
    },
    type: { type: 'varchar(20)', notNull: true },
    stem: { type: 'text', notNull: true },
    passage_id: {
      type: 'uuid',
      references: 'passages',
      onDelete: 'SET NULL',
    },
    options: { type: 'jsonb', notNull: true, default: '[]' },
    correct_answers: { type: 'jsonb', notNull: true },
    explanation: { type: 'text' },
    difficulty: { type: 'integer', notNull: true },
    tags: { type: 'jsonb', notNull: true, default: '[]' },
    media_urls: { type: 'jsonb', notNull: true, default: '[]' },
    status: { type: 'varchar(20)', notNull: true, default: 'active' },
    created_at: {
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

  // Create indexes for questions
  pgm.createIndex('questions', 'subject_id');
  pgm.createIndex('questions', 'topic_id');
  pgm.createIndex('questions', 'type');
  pgm.createIndex('questions', 'difficulty');
  pgm.createIndex('questions', 'status');
  pgm.createIndex('questions', 'passage_id');

  // Create GIN index for JSONB columns for efficient querying
  pgm.createIndex('questions', 'tags', { method: 'gin' });

  // Create question_tags table for many-to-many relationship
  pgm.createTable('question_tags', {
    question_id: {
      type: 'uuid',
      notNull: true,
      references: 'questions',
      onDelete: 'CASCADE',
    },
    tag: { type: 'varchar(100)', notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create composite primary key and indexes
  pgm.addConstraint('question_tags', 'question_tags_pkey', {
    primaryKey: ['question_id', 'tag'],
  });
  pgm.createIndex('question_tags', 'tag');
};

exports.down = (pgm) => {
  pgm.dropTable('question_tags');
  pgm.dropTable('questions');
  pgm.dropTable('passages');
};
