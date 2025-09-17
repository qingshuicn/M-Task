import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { TaskInstanceEntity } from './task-instance.entity';
import { TaskStepEntity } from './task-step.entity';

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  SYSTEM = 'SYSTEM',
}

export enum NotificationStatus {
  QUEUED = 'QUEUED',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

@Entity({ name: 'notification_log' })
export class NotificationLogEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  channel!: NotificationChannel;

  @Column({ type: 'varchar', length: 255 })
  recipient!: string;

  @Column({ type: 'varchar', length: 255 })
  subject!: string;

  @Column({ type: 'varchar', length: 50, default: NotificationStatus.QUEUED })
  status!: NotificationStatus;

  @Column({ name: 'sent_at', type: 'timestamptz', nullable: true })
  sentAt?: Date | null;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  payload?: Record<string, unknown> | null;

  @ManyToOne(() => TaskInstanceEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task?: TaskInstanceEntity | null;

  @ManyToOne(() => TaskStepEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'step_id' })
  step?: TaskStepEntity | null;
}
