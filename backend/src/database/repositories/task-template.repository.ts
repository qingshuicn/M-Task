import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TaskTemplateEntity } from '../entities';
import { BaseRepository } from './base.repository';

@Injectable()
export class TaskTemplateRepository extends BaseRepository<TaskTemplateEntity> {
  constructor(@InjectRepository(TaskTemplateEntity) repository: Repository<TaskTemplateEntity>) {
    super(repository);
  }
}
