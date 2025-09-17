import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TaskStepEntity } from '../entities';
import { BaseRepository } from './base.repository';

@Injectable()
export class TaskStepRepository extends BaseRepository<TaskStepEntity> {
  constructor(@InjectRepository(TaskStepEntity) repository: Repository<TaskStepEntity>) {
    super(repository);
  }
}
