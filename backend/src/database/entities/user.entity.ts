import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { BranchEntity } from './branch.entity';
import { TaskInstanceEntity } from './task-instance.entity';
import { TaskStepEntity } from './task-step.entity';

export enum UserRole {
  PGD_OFFICER = 'PGD_OFFICER',
  BRANCH_ADMIN = 'BRANCH_ADMIN',
  TASK_ASSIGNEE = 'TASK_ASSIGNEE',
  SYS_ADMIN = 'SYS_ADMIN',
}

@Entity({ name: 'app_user' })
@Index(['email'], { unique: true })
export class UserEntity extends BaseEntity {
  @Column({ name: 'display_name', type: 'varchar', length: 255 })
  displayName!: string;

  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 50 })
  role!: UserRole;

  @Column({ name: 'sso_id', type: 'varchar', length: 50, nullable: true })
  ssoId?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  preferences?: Record<string, unknown> | null;

  @ManyToOne(() => BranchEntity, (branch) => branch.users, { nullable: false })
  @JoinColumn({ name: 'branch_id' })
  branch!: BranchEntity;

  @OneToMany(() => TaskInstanceEntity, (task) => task.createdBy)
  createdTasks!: TaskInstanceEntity[];

  @OneToMany(() => TaskInstanceEntity, (task) => task.assignee)
  assignedTasks!: TaskInstanceEntity[];

  @OneToMany(() => TaskStepEntity, (step) => step.assignee)
  assignedSteps!: TaskStepEntity[];
}
