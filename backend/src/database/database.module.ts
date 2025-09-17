import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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
import {
  AttachmentRepository,
  AuditLogRepository,
  BranchRepository,
  NotificationLogRepository,
  TaskInstanceRepository,
  TaskStepRepository,
  TaskTemplateRepository,
  UserRepository,
} from './repositories';

const entities = [
  AttachmentEntity,
  AuditLogEntity,
  BranchEntity,
  NotificationLogEntity,
  TaskInstanceEntity,
  TaskStepEntity,
  TaskTemplateEntity,
  UserEntity,
];

const repositories = [
  AttachmentRepository,
  AuditLogRepository,
  BranchRepository,
  NotificationLogRepository,
  TaskInstanceRepository,
  TaskStepRepository,
  TaskTemplateRepository,
  UserRepository,
];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: repositories,
  exports: [...repositories, TypeOrmModule],
})
export class DatabaseModule {}
