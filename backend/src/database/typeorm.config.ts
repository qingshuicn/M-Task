import 'dotenv/config';
import { DataSource } from 'typeorm';

import {
  AttachmentEntity,
  AuditLogEntity,
  BranchEntity,
  NotificationLogEntity,
  TaskInstanceEntity,
  TaskStepEntity,
  TaskTemplateEntity,
  UserEntity,
} from './entities';

const isProd = process.env.NODE_ENV === 'production';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USERNAME ?? 'mdtsk',
  password: process.env.DATABASE_PASSWORD ?? 'mdtsk',
  database: process.env.DATABASE_NAME ?? 'mdtsk',
  entities: [
    AttachmentEntity,
    AuditLogEntity,
    BranchEntity,
    NotificationLogEntity,
    TaskInstanceEntity,
    TaskStepEntity,
    TaskTemplateEntity,
    UserEntity,
  ],
  migrations: [isProd ? 'dist/database/migrations/*.js' : 'src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
  logging: process.env.TYPEORM_LOGGING === 'true',
});

export default dataSource;
