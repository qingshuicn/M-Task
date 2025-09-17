import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { BranchEntity } from './branch.entity';
import { TaskTemplateEntity } from './task-template.entity';
import { TaskStepEntity } from './task-step.entity';
import { AttachmentEntity } from './attachment.entity';
import { UserEntity } from './user.entity';

export enum TaskStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

@Entity({ name: 'task_instance' })
@Index(['code'], { unique: true })
export class TaskInstanceEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  code!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'varchar', length: 50, default: TaskStatus.DRAFT })
  status!: TaskStatus;

  @Column({ name: 'due_at', type: 'timestamptz', nullable: true })
  dueAt?: Date | null;

  @Column({ name: 'submitted_at', type: 'timestamptz', nullable: true })
  submittedAt?: Date | null;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt?: Date | null;

  @Column({ type: 'int', default: 1 })
  version!: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown> | null;

  @ManyToOne(() => TaskTemplateEntity, (template) => template.tasks, { nullable: true })
  @JoinColumn({ name: 'template_id' })
  template?: TaskTemplateEntity | null;

  @ManyToOne(() => BranchEntity, (branch) => branch.tasks, { nullable: false })
  @JoinColumn({ name: 'branch_id' })
  branch!: BranchEntity;

  @ManyToOne(() => UserEntity, (user) => user.createdTasks, { nullable: false })
  @JoinColumn({ name: 'created_by_id' })
  createdBy!: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.assignedTasks, { nullable: true })
  @JoinColumn({ name: 'assignee_id' })
  assignee?: UserEntity | null;

  @OneToMany(() => TaskStepEntity, (step) => step.task, { cascade: true })
  steps!: TaskStepEntity[];

  @OneToMany(() => AttachmentEntity, (attachment) => attachment.task)
  attachments!: AttachmentEntity[];
}
