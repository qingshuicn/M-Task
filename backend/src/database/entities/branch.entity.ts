import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { TaskInstanceEntity } from './task-instance.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'branch' })
@Index(['code'], { unique: true })
export class BranchEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, name: 'contact_email', nullable: true })
  contactEmail?: string | null;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown> | null;

  @OneToMany(() => UserEntity, (user) => user.branch)
  users!: UserEntity[];

  @OneToMany(() => TaskInstanceEntity, (task) => task.branch)
  tasks!: TaskInstanceEntity[];
}
