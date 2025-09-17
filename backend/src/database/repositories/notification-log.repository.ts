import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotificationLogEntity } from '../entities';
import { BaseRepository } from './base.repository';

@Injectable()
export class NotificationLogRepository extends BaseRepository<NotificationLogEntity> {
  constructor(
    @InjectRepository(NotificationLogEntity) repository: Repository<NotificationLogEntity>,
  ) {
    super(repository);
  }
}
