/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Create subjects table
  pgm.createTable('subjects', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    name: { type: 'varchar(255)', notNull: true },
    code: { type: 'varchar(10)', notNull: true, unique: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create index for subjects
  pgm.createIndex('subjects', 'code');

  // Create topics table
  pgm.createTable('topics', {
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
    name: { type: 'varchar(255)', notNull: true },
    parent_topic_id: {
      type: 'uuid',
      references: 'topics',
      onDelete: 'SET NULL',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create indexes for topics
  pgm.createIndex('topics', 'subject_id');
  pgm.createIndex('topics', 'parent_topic_id');
};

exports.down = (pgm) => {
  pgm.dropTable('topics');
  pgm.dropTable('subjects');
};
