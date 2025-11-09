/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Create exam_templates table
  pgm.createTable('exam_templates', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    name: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    created_by: {
      type: 'uuid',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
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

  // Create indexes for exam_templates
  pgm.createIndex('exam_templates', 'created_by');
  pgm.createIndex('exam_templates', 'created_at');

  // Create exam_sections table
  pgm.createTable('exam_sections', {
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
    subject_id: {
      type: 'uuid',
      notNull: true,
      references: 'subjects',
      onDelete: 'CASCADE',
    },
    time_limit_minutes: { type: 'integer', notNull: true },
    num_questions: { type: 'integer', notNull: true },
    negative_marking: { type: 'boolean', notNull: true, default: false },
    negative_mark_value: { type: 'decimal(3,2)', notNull: true, default: 0 },
    shuffle_questions: { type: 'boolean', notNull: true, default: true },
    shuffle_options: { type: 'boolean', notNull: true, default: true },
    section_order: { type: 'integer', notNull: true, default: 0 },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create indexes for exam_sections
  pgm.createIndex('exam_sections', 'template_id');
  pgm.createIndex('exam_sections', 'subject_id');
};

exports.down = (pgm) => {
  pgm.dropTable('exam_sections');
  pgm.dropTable('exam_templates');
};
