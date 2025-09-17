import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { TaskInstanceEntity } from './task-instance.entity';
import { TaskStepEntity } from './task-step.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'attachment' })
export class AttachmentEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  filename!: string;

  @Column({ name: 'mime_type', type: 'varchar', length: 128 })
  mimeType!: string;

  @Column({ type: 'bigint' })
  size!: string;

  @Column({ name: 'storage_path', type: 'varchar', length: 512 })
  storagePath!: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown> | null;

  @ManyToOne(() => TaskInstanceEntity, (task) => task.attachments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_id' })
  task!: TaskInstanceEntity;

  @ManyToOne(() => TaskStepEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'step_id' })
  step?: TaskStepEntity | null;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'uploaded_by_id' })
  uploadedBy!: UserEntity;
}
