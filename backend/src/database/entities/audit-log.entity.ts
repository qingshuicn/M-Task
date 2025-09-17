import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'audit_log' })
@Index(['scope', 'scopeId'])
export class AuditLogEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id', type: 'bigint' })
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  scope!: string;

  @Column({ name: 'scope_id', type: 'uuid', nullable: true })
  scopeId?: string | null;

  @Column({ type: 'varchar', length: 255 })
  action!: string;

  @Column({ name: 'actor_id', type: 'uuid', nullable: true })
  actorId?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  payload?: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'occurred_at', type: 'timestamptz' })
  occurredAt!: Date;
}
