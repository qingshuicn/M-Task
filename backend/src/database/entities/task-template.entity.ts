import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { TaskInstanceEntity } from './task-instance.entity';
import { UserEntity } from './user.entity';

export interface TaskTemplateStep {
  key: string;
  title: string;
  description?: string;
  required?: boolean;
  formSchema?: Record<string, unknown>;
  assigneeRole?: string;
}

@Entity({ name: 'task_template' })
@Index(['code', 'version'], { unique: true })
@Index(['code'])
@Index(['latest'])
export class TaskTemplateEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  code!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'int', default: 1 })
  version!: number;

  @Column({ type: 'boolean', default: true })
  latest!: boolean;

  @Column({ name: 'effective_from', type: 'timestamptz', nullable: true })
  effectiveFrom?: Date | null;

  @Column({ name: 'effective_to', type: 'timestamptz', nullable: true })
  effectiveTo?: Date | null;

  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" })
  steps!: TaskTemplateStep[];

  @Column({ type: 'jsonb', nullable: true, default: () => "'{}'::jsonb" })
  metadata?: Record<string, unknown> | null;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by_id' })
  createdBy!: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updated_by_id' })
  updatedBy?: UserEntity | null;

  @OneToMany(() => TaskInstanceEntity, (task) => task.template)
  tasks!: TaskInstanceEntity[];
}
