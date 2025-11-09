/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Create exam_instances table
  pgm.createTable('exam_instances', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    template_id: {
      type: 'uuid',
      notNull: true,
      references: 'exam_templates',
      onDelete: 'CASCADE',
    },
    name: { type: 'varchar(255)', notNull: true },
    scheduled_at: { type: 'timestamp', notNull: true },
    duration_minutes: { type: 'integer', notNull: true },
    allowed_roles: { type: 'jsonb', notNull: true },
    status: { type: 'varchar(20)', notNull: true, default: 'scheduled' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create indexes for exam_instances
  pgm.createIndex('exam_instances', 'template_id');
  pgm.createIndex('exam_instances', 'scheduled_at');
  pgm.createIndex('exam_instances', 'status');
};

exports.down = (pgm) => {
  pgm.dropTable('exam_instances');
};
