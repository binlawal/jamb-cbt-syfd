/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Create schools table
  pgm.createTable('schools', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    name: { type: 'varchar(255)', notNull: true },
    state: { type: 'varchar(100)', notNull: true },
    lga: { type: 'varchar(100)', notNull: true },
    type: { type: 'varchar(20)', notNull: true },
    address: { type: 'text', notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create indexes for schools
  pgm.createIndex('schools', 'state');
  pgm.createIndex('schools', 'lga');
  pgm.createIndex('schools', 'type');

  // Create users table
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    name: { type: 'varchar(255)', notNull: true },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    hashed_password: { type: 'varchar(255)', notNull: true },
    role: { type: 'varchar(20)', notNull: true },
    school_id: {
      type: 'uuid',
      references: 'schools',
      onDelete: 'SET NULL',
    },
    cohort: { type: 'varchar(10)' },
    status: { type: 'varchar(20)', notNull: true, default: 'active' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    last_active_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create indexes for users
  pgm.createIndex('users', 'email');
  pgm.createIndex('users', 'role');
  pgm.createIndex('users', 'school_id');
  pgm.createIndex('users', 'status');
  pgm.createIndex('users', 'cohort');
};

exports.down = (pgm) => {
  pgm.dropTable('users');
  pgm.dropTable('schools');
};
