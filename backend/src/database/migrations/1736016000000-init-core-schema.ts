import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class InitCoreSchema1736016000000 implements MigrationInterface {
  public readonly name = 'InitCoreSchema1736016000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    await queryRunner.createTable(
      new Table({
        name: 'branch',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'code', type: 'varchar', length: '50' },
          { name: 'name', type: 'varchar', length: '255' },
          { name: 'contact_email', type: 'varchar', length: '255', isNullable: true },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'metadata', type: 'jsonb', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
      }),
    );

    await queryRunner.createIndex(
      'branch',
      new TableIndex({
        name: 'IDX_branch_code_unique',
        columnNames: ['code'],
        isUnique: true,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'app_user',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'display_name', type: 'varchar', length: '255' },
          { name: 'email', type: 'varchar', length: '255' },
          { name: 'role', type: 'varchar', length: '50' },
          { name: 'sso_id', type: 'varchar', length: '50', isNullable: true },
          { name: 'preferences', type: 'jsonb', isNullable: true },
          { name: 'branch_id', type: 'uuid' },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
      }),
    );

    await queryRunner.createIndex(
      'app_user',
      new TableIndex({
        name: 'IDX_app_user_email_unique',
        columnNames: ['email'],
        isUnique: true,
      }),
    );

    await queryRunner.createForeignKey(
      'app_user',
      new TableForeignKey({
        columnNames: ['branch_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'branch',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'task_template',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'code', type: 'varchar', length: '100' },
          { name: 'name', type: 'varchar', length: '255' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'version', type: 'int', default: 1 },
          { name: 'latest', type: 'boolean', default: true },
          { name: 'effective_from', type: 'timestamptz', isNullable: true },
          { name: 'effective_to', type: 'timestamptz', isNullable: true },
          { name: 'steps', type: 'jsonb', default: "'[]'::jsonb" },
          { name: 'metadata', type: 'jsonb', isNullable: true, default: "'{}'::jsonb" },
          { name: 'created_by_id', type: 'uuid' },
          { name: 'updated_by_id', type: 'uuid', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
      }),
    );

    await queryRunner.createIndices('task_template', [
      new TableIndex({
        name: 'IDX_task_template_code_version_unique',
        columnNames: ['code', 'version'],
        isUnique: true,
      }),
      new TableIndex({
        name: 'IDX_task_template_code',
        columnNames: ['code'],
      }),
      new TableIndex({
        name: 'IDX_task_template_latest',
        columnNames: ['latest'],
      }),
    ]);

    await queryRunner.createForeignKeys('task_template', [
      new TableForeignKey({
        columnNames: ['created_by_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'app_user',
        onDelete: 'RESTRICT',
      }),
      new TableForeignKey({
        columnNames: ['updated_by_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'app_user',
        onDelete: 'SET NULL',
      }),
    ]);

    await queryRunner.createTable(
      new Table({
        name: 'task_instance',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'code', type: 'varchar', length: '100' },
          { name: 'title', type: 'varchar', length: '255' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'status', type: 'varchar', length: '50', default: "'DRAFT'" },
          { name: 'status_reason', type: 'text', isNullable: true },
          { name: 'due_at', type: 'timestamptz', isNullable: true },
          { name: 'published_at', type: 'timestamptz', isNullable: true },
          { name: 'submitted_at', type: 'timestamptz', isNullable: true },
          { name: 'completed_at', type: 'timestamptz', isNullable: true },
          { name: 'version', type: 'int', default: 1 },
          { name: 'lock_version', type: 'int', default: 0 },
          { name: 'payload', type: 'jsonb', default: "'{}'::jsonb" },
          { name: 'metadata', type: 'jsonb', isNullable: true, default: "'{}'::jsonb" },
          { name: 'template_id', type: 'uuid' },
          { name: 'branch_id', type: 'uuid' },
          { name: 'assignee_id', type: 'uuid', isNullable: true },
          { name: 'reviewer_id', type: 'uuid', isNullable: true },
          { name: 'created_by_id', type: 'uuid' },
          { name: 'updated_by_id', type: 'uuid', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
      }),
    );

    await queryRunner.createIndices('task_instance', [
      new TableIndex({
        name: 'IDX_task_instance_code_unique',
        columnNames: ['code'],
        isUnique: true,
      }),
      new TableIndex({
        name: 'IDX_task_instance_branch_status',
        columnNames: ['branch_id', 'status'],
      }),
      new TableIndex({
        name: 'IDX_task_instance_assignee_status',
        columnNames: ['assignee_id', 'status'],
      }),
      new TableIndex({
        name: 'IDX_task_instance_reviewer_status',
        columnNames: ['reviewer_id', 'status'],
      }),
    ]);

    await queryRunner.createForeignKeys('task_instance', [
      new TableForeignKey({
        columnNames: ['template_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'task_template',
        onDelete: 'RESTRICT',
      }),
      new TableForeignKey({
        columnNames: ['branch_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'branch',
        onDelete: 'RESTRICT',
      }),
      new TableForeignKey({
        columnNames: ['created_by_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'app_user',
        onDelete: 'RESTRICT',
      }),
      new TableForeignKey({
        columnNames: ['updated_by_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'app_user',
        onDelete: 'SET NULL',
      }),
      new TableForeignKey({
        columnNames: ['assignee_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'app_user',
        onDelete: 'SET NULL',
      }),
      new TableForeignKey({
        columnNames: ['reviewer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'app_user',
        onDelete: 'SET NULL',
      }),
    ]);

    await queryRunner.createTable(
      new Table({
        name: 'task_step',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'step_key', type: 'varchar', length: '100' },
          { name: 'title', type: 'varchar', length: '255' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'status', type: 'varchar', length: '50', default: "'PENDING'" },
          { name: 'display_order', type: 'int', default: 0 },
          { name: 'is_required', type: 'boolean', default: false },
          { name: 'due_at', type: 'timestamptz', isNullable: true },
          { name: 'started_at', type: 'timestamptz', isNullable: true },
          { name: 'completed_at', type: 'timestamptz', isNullable: true },
          { name: 'payload', type: 'jsonb', isNullable: true, default: "'{}'::jsonb" },
          { name: 'lock_version', type: 'int', default: 0 },
          { name: 'task_instance_id', type: 'uuid' },
          { name: 'assignee_id', type: 'uuid', isNullable: true },
          { name: 'created_by_id', type: 'uuid' },
          { name: 'updated_by_id', type: 'uuid', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
      }),
    );

    await queryRunner.createIndex(
      'task_step',
      new TableIndex({
        name: 'IDX_task_step_instance_status',
        columnNames: ['task_instance_id', 'status'],
      }),
    );

    await queryRunner.createForeignKeys('task_step', [
      new TableForeignKey({
        columnNames: ['task_instance_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'task_instance',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['assignee_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'app_user',
        onDelete: 'SET NULL',
      }),
      new TableForeignKey({
        columnNames: ['created_by_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'app_user',
        onDelete: 'RESTRICT',
      }),
      new TableForeignKey({
        columnNames: ['updated_by_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'app_user',
        onDelete: 'SET NULL',
      }),
    ]);

    await queryRunner.createTable(
      new Table({
        name: 'attachment',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'filename', type: 'varchar', length: '255' },
          { name: 'mime_type', type: 'varchar', length: '128' },
          { name: 'size', type: 'bigint' },
          { name: 'storage_path', type: 'varchar', length: '512' },
          { name: 'metadata', type: 'jsonb', isNullable: true },
          { name: 'task_id', type: 'uuid' },
          { name: 'step_id', type: 'uuid', isNullable: true },
          { name: 'uploaded_by_id', type: 'uuid' },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
      }),
    );

    await queryRunner.createForeignKeys('attachment', [
      new TableForeignKey({
        columnNames: ['task_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'task_instance',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['step_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'task_step',
        onDelete: 'SET NULL',
      }),
      new TableForeignKey({
        columnNames: ['uploaded_by_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'app_user',
        onDelete: 'RESTRICT',
      }),
    ]);

    await queryRunner.createTable(
      new Table({
        name: 'notification_log',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'channel', type: 'varchar', length: '50' },
          { name: 'recipient', type: 'varchar', length: '255' },
          { name: 'subject', type: 'varchar', length: '255' },
          { name: 'status', type: 'varchar', length: '50', default: "'QUEUED'" },
          { name: 'sent_at', type: 'timestamptz', isNullable: true },
          { name: 'error_message', type: 'text', isNullable: true },
          { name: 'payload', type: 'jsonb', isNullable: true },
          { name: 'task_id', type: 'uuid', isNullable: true },
          { name: 'step_id', type: 'uuid', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
      }),
    );

    await queryRunner.createForeignKeys('notification_log', [
      new TableForeignKey({
        columnNames: ['task_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'task_instance',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['step_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'task_step',
        onDelete: 'SET NULL',
      }),
    ]);

    await queryRunner.createIndex(
      'notification_log',
      new TableIndex({
        name: 'IDX_notification_log_recipient',
        columnNames: ['recipient'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'audit_log',
        columns: [
          { name: 'id', type: 'bigserial', isPrimary: true },
          { name: 'scope', type: 'varchar', length: '100' },
          { name: 'scope_id', type: 'uuid', isNullable: true },
          { name: 'action', type: 'varchar', length: '255' },
          { name: 'actor_id', type: 'uuid', isNullable: true },
          { name: 'payload', type: 'jsonb', isNullable: true },
          { name: 'occurred_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
    );

    await queryRunner.createIndex(
      'audit_log',
      new TableIndex({
        name: 'IDX_audit_log_scope',
        columnNames: ['scope', 'scope_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('audit_log', 'IDX_audit_log_scope');
    await queryRunner.dropTable('audit_log');

    await queryRunner.dropIndex('notification_log', 'IDX_notification_log_recipient');
    await queryRunner.dropTable('notification_log');

    await queryRunner.dropTable('attachment', true, true);

    await queryRunner.dropIndex('task_step', 'IDX_task_step_instance_status');
    await queryRunner.dropTable('task_step', true, true);

    await queryRunner.dropIndex('task_instance', 'IDX_task_instance_reviewer_status');
    await queryRunner.dropIndex('task_instance', 'IDX_task_instance_assignee_status');
    await queryRunner.dropIndex('task_instance', 'IDX_task_instance_branch_status');
    await queryRunner.dropIndex('task_instance', 'IDX_task_instance_code_unique');
    await queryRunner.dropTable('task_instance', true, true);

    await queryRunner.dropIndex('task_template', 'IDX_task_template_latest');
    await queryRunner.dropIndex('task_template', 'IDX_task_template_code');
    await queryRunner.dropIndex('task_template', 'IDX_task_template_code_version_unique');
    await queryRunner.dropTable('task_template', true, true);

    await queryRunner.dropIndex('app_user', 'IDX_app_user_email_unique');
    await queryRunner.dropTable('app_user', true, true);

    await queryRunner.dropIndex('branch', 'IDX_branch_code_unique');
    await queryRunner.dropTable('branch');
  }
}
