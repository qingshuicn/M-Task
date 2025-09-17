import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AttachmentEntity } from './attachment.entity';
import { BaseEntity } from './base.entity';
import { BranchEntity } from './branch.entity';
import { TaskStepEntity } from './task-step.entity';
import { TaskTemplateEntity } from './task-template.entity';
import { UserEntity } from './user.entity';

export enum TaskStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_REVIEW = 'WAITING_REVIEW',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

@Entity({ name: 'task_instance' })
@Index(['code'], { unique: true })
@Index(['branchId', 'status'])
@Index(['assigneeId', 'status'])
@Index(['reviewerId', 'status'])
export class TaskInstanceEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  code!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'varchar', length: 50, default: TaskStatus.DRAFT })
  status!: TaskStatus;

  @Column({ name: 'status_reason', type: 'text', nullable: true })
  statusReason?: string | null;

  @Column({ name: 'due_at', type: 'timestamptz', nullable: true })
  dueAt?: Date | null;

  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  publishedAt?: Date | null;

  @Column({ name: 'submitted_at', type: 'timestamptz', nullable: true })
  submittedAt?: Date | null;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt?: Date | null;

  @Column({ type: 'int', default: 1 })
  version!: number;

  @Column({ name: 'lock_version', type: 'int', default: 0 })
  lockVersion!: number;

  @Column({ name: 'payload', type: 'jsonb', default: () => "'{}'::jsonb" })
  payload!: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true, default: () => "'{}'::jsonb" })
  metadata?: Record<string, unknown> | null;

  @Column({ name: 'template_id', type: 'uuid' })
  templateId!: string;

  @ManyToOne(() => TaskTemplateEntity, (template) => template.tasks, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'template_id' })
  template!: TaskTemplateEntity;

  @Column({ name: 'branch_id', type: 'uuid' })
  branchId!: string;

  @ManyToOne(() => BranchEntity, (branch) => branch.tasks, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'branch_id' })
  branch!: BranchEntity;

  @ManyToOne(() => UserEntity, (user) => user.createdTasks, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy!: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updated_by_id' })
  updatedBy?: UserEntity | null;

  @Column({ name: 'assignee_id', type: 'uuid', nullable: true })
  assigneeId?: string | null;

  @ManyToOne(() => UserEntity, (user) => user.assignedTasks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'assignee_id' })
  assignee?: UserEntity | null;

  @Column({ name: 'reviewer_id', type: 'uuid', nullable: true })
  reviewerId?: string | null;

  @ManyToOne(() => UserEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'reviewer_id' })
  reviewer?: UserEntity | null;

  @OneToMany(() => TaskStepEntity, (step) => step.task, { cascade: true })
  steps!: TaskStepEntity[];

  @OneToMany(() => AttachmentEntity, (attachment) => attachment.task)
  attachments!: AttachmentEntity[];
}
