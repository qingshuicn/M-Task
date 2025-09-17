import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { TaskInstanceEntity } from './task-instance.entity';

export interface TaskStepDefinition {
  title: string;
  description?: string;
  dueInHours?: number;
  required?: boolean;
}

@Entity({ name: 'task_template' })
@Index(['code'], { unique: true })
export class TaskTemplateEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  code!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'jsonb', name: 'step_definitions' })
  stepDefinitions!: TaskStepDefinition[];

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive!: boolean;

  @Column({ type: 'int', default: 1 })
  version!: number;

  @OneToMany(() => TaskInstanceEntity, (task) => task.template)
  tasks!: TaskInstanceEntity[];
}
