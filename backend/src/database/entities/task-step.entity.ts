import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { TaskInstanceEntity } from './task-instance.entity';
import { UserEntity } from './user.entity';

export enum TaskStepStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  BLOCKED = 'BLOCKED',
}

@Entity({ name: 'task_step' })
@Index(['taskInstanceId', 'status'])
export class TaskStepEntity extends BaseEntity {
  @Column({ name: 'step_key', type: 'varchar', length: 100 })
  stepKey!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'varchar', length: 50, default: TaskStepStatus.PENDING })
  status!: TaskStepStatus;

  @Column({ name: 'display_order', type: 'int', default: 0 })
  displayOrder!: number;

  @Column({ name: 'is_required', type: 'boolean', default: false })
  isRequired!: boolean;

  @Column({ name: 'due_at', type: 'timestamptz', nullable: true })
  dueAt?: Date | null;

  @Column({ name: 'started_at', type: 'timestamptz', nullable: true })
  startedAt?: Date | null;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt?: Date | null;

  @Column({ type: 'jsonb', nullable: true, default: () => "'{}'::jsonb" })
  payload?: Record<string, unknown> | null;

  @Column({ name: 'lock_version', type: 'int', default: 0 })
  lockVersion!: number;

  @Column({ name: 'task_instance_id', type: 'uuid' })
  taskInstanceId!: string;

  @ManyToOne(() => TaskInstanceEntity, (task) => task.steps, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_instance_id' })
  task!: TaskInstanceEntity;

  @Column({ name: 'assignee_id', type: 'uuid', nullable: true })
  assigneeId?: string | null;

  @ManyToOne(() => UserEntity, (user) => user.assignedSteps, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'assignee_id' })
  assignee?: UserEntity | null;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by_id' })
  createdBy!: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updated_by_id' })
  updatedBy?: UserEntity | null;
}
