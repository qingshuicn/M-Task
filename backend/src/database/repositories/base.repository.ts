import { DeepPartial, FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';

export class BaseRepository<TEntity extends { id?: string }> {
  constructor(protected readonly repository: Repository<TEntity>) {}

  create(data: DeepPartial<TEntity>): Promise<TEntity> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  findById(id: string): Promise<TEntity | null> {
    return this.repository.findOne({ where: { id } as FindOptionsWhere<TEntity> });
  }

  find(options?: FindManyOptions<TEntity>): Promise<TEntity[]> {
    return this.repository.find(options);
  }

  update(id: string, data: DeepPartial<TEntity>): Promise<TEntity> {
    return this.repository.save({ ...(data as object), id } as TEntity);
  }

  async softDelete(id: string): Promise<void> {
    if (this.repository.metadata.deleteDateColumn) {
      await this.repository.softDelete(id);
      return;
    }

    await this.repository.delete(id);
  }
}
