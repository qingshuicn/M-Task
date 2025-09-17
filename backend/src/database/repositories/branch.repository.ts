import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BranchEntity } from '../entities';
import { BaseRepository } from './base.repository';

@Injectable()
export class BranchRepository extends BaseRepository<BranchEntity> {
  constructor(@InjectRepository(BranchEntity) repository: Repository<BranchEntity>) {
    super(repository);
  }
}
