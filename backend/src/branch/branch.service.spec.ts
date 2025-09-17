import { NotFoundException } from '@nestjs/common';
import { DataType, newDb } from 'pg-mem';
import { randomUUID } from 'node:crypto';
import { DataSource } from 'typeorm';

import {
  AttachmentEntity,
  AuditLogEntity,
  BranchEntity,
  NotificationLogEntity,
  TaskInstanceEntity,
  TaskStepEntity,
  TaskTemplateEntity,
  UserEntity,
} from '../database/entities';
import { BranchRepository } from '../database/repositories';
import { BranchService } from './branch.service';

const createDataSource = async (): Promise<DataSource> => {
  const db = newDb({ autoCreateForeignKeyIndices: true });
  db.public.registerFunction({
    name: 'current_database',
    returns: DataType.text,
    implementation: () => 'test',
  });
  db.public.registerFunction({
    name: 'version',
    returns: DataType.text,
    implementation: () => 'PostgreSQL 13.3',
  });
  db.public.registerFunction({
    name: 'gen_random_uuid',
    returns: DataType.uuid,
    impure: true,
    implementation: () => randomUUID(),
  });

  db.public.registerFunction({
    name: 'uuid_generate_v4',
    returns: DataType.uuid,
    impure: true,
    implementation: () => randomUUID(),
  });
  const dataSource = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: [
      AttachmentEntity,
      AuditLogEntity,
      BranchEntity,
      NotificationLogEntity,
      TaskInstanceEntity,
      TaskStepEntity,
      TaskTemplateEntity,
      UserEntity,
    ],
    synchronize: true,
  });

  await dataSource.initialize();

  return dataSource;
};

describe('BranchService', () => {
  let dataSource: DataSource;
  let service: BranchService;

  beforeAll(async () => {
    dataSource = await createDataSource();
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  });

  beforeEach(() => {
    const repository = new BranchRepository(dataSource.getRepository(BranchEntity));
    service = new BranchService(repository);
  });

  afterEach(async () => {
    await dataSource.getRepository(BranchEntity).createQueryBuilder().delete().execute();
  });

  it('creates and retrieves branches', async () => {
    const created = await service.create({
      code: 'SHA',
      name: 'Shanghai Campus',
      contactEmail: 'team@sh.example.com',
      isActive: true,
    });

    expect(created.id).toBeDefined();

    const fetched = await service.findOne(created.id);
    expect(fetched).toMatchObject({
      id: created.id,
      code: 'SHA',
      name: 'Shanghai Campus',
      contactEmail: 'team@sh.example.com',
      isActive: true,
    });
  });

  it('returns all branches sorted by name', async () => {
    await service.create({
      code: 'BJS',
      name: 'Beijing Campus',
      isActive: true,
      contactEmail: 'bjs@example.com',
      metadata: {},
    });
    await service.create({
      code: 'SHA',
      name: 'Shanghai Campus',
      isActive: true,
      contactEmail: 'sha@example.com',
      metadata: {},
    });

    const branches = await service.findAll();
    expect(branches.map((branch) => branch.name)).toEqual(['Beijing Campus', 'Shanghai Campus']);
  });

  it('updates existing branches', async () => {
    const branch = await service.create({
      code: 'HKG',
      name: 'Hong Kong Campus',
      isActive: true,
      contactEmail: 'hkg@example.com',
      metadata: {},
    });

    const updated = await service.update(branch.id, { name: 'Hong Kong Center', isActive: false });

    expect(updated).toMatchObject({
      id: branch.id,
      name: 'Hong Kong Center',
      isActive: false,
    });
  });

  it('soft deletes branches and prevents further lookup', async () => {
    const branch = await service.create({
      code: 'GZ',
      name: 'Guangzhou Campus',
      isActive: true,
      contactEmail: 'gz@example.com',
      metadata: {},
    });

    await service.remove(branch.id);

    await expect(service.findOne(branch.id)).rejects.toBeInstanceOf(NotFoundException);

    const withDeleted = await dataSource
      .getRepository(BranchEntity)
      .createQueryBuilder('branch')
      .withDeleted()
      .where('branch.id = :id', { id: branch.id })
      .getOne();

    expect(withDeleted?.deletedAt).toBeInstanceOf(Date);
  });

  it('throws when updating unknown branches', async () => {
    await expect(service.update(randomUUID(), { name: 'Missing Campus' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
