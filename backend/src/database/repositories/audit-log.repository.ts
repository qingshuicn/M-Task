import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuditLogEntity } from '../entities';
import { BaseRepository } from './base.repository';

@Injectable()
export class AuditLogRepository extends BaseRepository<AuditLogEntity> {
  constructor(@InjectRepository(AuditLogEntity) repository: Repository<AuditLogEntity>) {
    super(repository);
  }
}
