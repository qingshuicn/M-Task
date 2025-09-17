import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TaskInstanceEntity } from '../entities';
import { BaseRepository } from './base.repository';

@Injectable()
export class TaskInstanceRepository extends BaseRepository<TaskInstanceEntity> {
  constructor(@InjectRepository(TaskInstanceEntity) repository: Repository<TaskInstanceEntity>) {
    super(repository);
  }
}
