/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Create audit_logs table
  pgm.createTable('audit_logs', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_id: {
      type: 'uuid',
      references: 'users',
      onDelete: 'SET NULL',
    },
    action: { type: 'varchar(100)', notNull: true },
    entity_type: { type: 'varchar(100)', notNull: true },
    entity_id: { type: 'uuid', notNull: true },
    changes: { type: 'jsonb' },
    ip_address: { type: 'varchar(45)' },
    user_agent: { type: 'text' },
    timestamp: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create indexes for audit_logs
  pgm.createIndex('audit_logs', 'user_id');
  pgm.createIndex('audit_logs', 'entity_type');
  pgm.createIndex('audit_logs', 'entity_id');
  pgm.createIndex('audit_logs', 'action');
  pgm.createIndex('audit_logs', 'timestamp');

  // Create composite index for common queries
  pgm.createIndex('audit_logs', ['entity_type', 'entity_id', 'timestamp']);
};

exports.down = (pgm) => {
  pgm.dropTable('audit_logs');
};
