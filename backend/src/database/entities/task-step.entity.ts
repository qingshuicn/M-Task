import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

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
export class TaskStepEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'varchar', length: 50, default: TaskStepStatus.PENDING })
  status!: TaskStepStatus;

  @Column({ name: 'display_order', type: 'int' })
  displayOrder!: number;

  @Column({ name: 'is_required', type: 'boolean', default: false })
  isRequired!: boolean;

  @Column({ name: 'due_at', type: 'timestamptz', nullable: true })
  dueAt?: Date | null;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt?: Date | null;

  @ManyToOne(() => TaskInstanceEntity, (task) => task.steps, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_id' })
  task!: TaskInstanceEntity;

  @ManyToOne(() => UserEntity, (user) => user.assignedSteps, { nullable: true })
  @JoinColumn({ name: 'assignee_id' })
  assignee?: UserEntity | null;
}
