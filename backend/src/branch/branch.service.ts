import { Injectable, NotFoundException } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';

import { BranchEntity } from '../database/entities';
import { BranchRepository } from '../database/repositories';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchService {
  constructor(private readonly branchRepository: BranchRepository) {}

  create(data: CreateBranchDto): Promise<BranchEntity> {
    return this.branchRepository.create(data);
  }

  findAll(options?: FindManyOptions<BranchEntity>): Promise<BranchEntity[]> {
    const defaultOptions: FindManyOptions<BranchEntity> = {
      order: { name: 'ASC' },
    };

    return this.branchRepository.find({ ...defaultOptions, ...options });
  }

  async findOne(id: string): Promise<BranchEntity> {
    const branch = await this.branchRepository.findById(id);
    if (!branch) {
      throw new NotFoundException(`Branch ${id} was not found`);
    }

    return branch;
  }

  async update(id: string, data: UpdateBranchDto): Promise<BranchEntity> {
    await this.findOne(id);
    return this.branchRepository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.branchRepository.softDelete(id);
  }
}
