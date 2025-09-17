import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AttachmentEntity } from '../entities';
import { BaseRepository } from './base.repository';

@Injectable()
export class AttachmentRepository extends BaseRepository<AttachmentEntity> {
  constructor(@InjectRepository(AttachmentEntity) repository: Repository<AttachmentEntity>) {
    super(repository);
  }
}
