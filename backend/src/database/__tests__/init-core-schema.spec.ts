import {
  DataSource,
  EntityManager,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

import { InitCoreSchema1736016000000 } from '../migrations/1736016000000-init-core-schema';

interface TableRecord {
  table: Table;
  indices: Map<string, TableIndex>;
  foreignKeys: TableForeignKey[];
}

interface RecordingQueryRunner extends QueryRunner {
  tables: Map<string, TableRecord>;
}

const createRecordingQueryRunner = (): RecordingQueryRunner => {
  const tables = new Map<string, TableRecord>();

  const ensureTable = (name: string) => {
    const record = tables.get(name);
    if (!record) {
      throw new Error(`Table ${name} has not been created`);
    }

    return record;
  };

  const runner = {
    tables,
    manager: {} as EntityManager,
    connection: {} as DataSource,
    dataSource: {} as DataSource,
    isTransactionActive: false,
    isReleased: false,
    query: ((query: string) => {
      if (query.trim().toUpperCase().startsWith('CREATE EXTENSION')) {
        return Promise.resolve(undefined);
      }

      return Promise.reject(new Error(`Unexpected query: ${query}`));
    }) as QueryRunner['query'],
    createTable: (table: Table): Promise<void> => {
      tables.set(table.name, { table, indices: new Map(), foreignKeys: [] });
      return Promise.resolve();
    },
    createIndex: (tableName: string, index: TableIndex): Promise<void> => {
      const indexName = index.name ?? index.columnNames.join('_');
      ensureTable(tableName).indices.set(indexName, index);
      return Promise.resolve();
    },
    createIndices: (tableName: string, indices: TableIndex[]): Promise<void> => {
      indices.forEach((index) => {
        const indexName = index.name ?? index.columnNames.join('_');
        ensureTable(tableName).indices.set(indexName, index);
      });
      return Promise.resolve();
    },
    createForeignKey: (tableName: string, foreignKey: TableForeignKey): Promise<void> => {
      ensureTable(tableName).foreignKeys.push(foreignKey);
      return Promise.resolve();
    },
    createForeignKeys: (tableName: string, foreignKeys: TableForeignKey[]): Promise<void> => {
      foreignKeys.forEach((foreignKey) => ensureTable(tableName).foreignKeys.push(foreignKey));
      return Promise.resolve();
    },
    dropIndex: (tableName: string, indexOrName: string | TableIndex): Promise<void> => {
      const name =
        typeof indexOrName === 'string'
          ? indexOrName
          : (indexOrName.name ?? indexOrName.columnNames.join('_'));
      const record = tables.get(tableName);
      record?.indices.delete(name);
      return Promise.resolve();
    },
    dropTable: (tableName: string): Promise<void> => {
      tables.delete(tableName);
      return Promise.resolve();
    },
    release: (): Promise<void> => Promise.resolve(),
    getTable: (tableName: string): Promise<Table | undefined> =>
      Promise.resolve(tables.get(tableName)?.table),
  };

  return runner as unknown as RecordingQueryRunner;
};

describe('InitCoreSchema1736016000000 migration', () => {
  it('creates expected tables, indices and foreign keys, then rolls back cleanly', async () => {
    const queryRunner = createRecordingQueryRunner();
    const migration = new InitCoreSchema1736016000000();

    await migration.up(queryRunner);

    const branchRecord = queryRunner.tables.get('branch');
    expect(branchRecord).toBeDefined();
    expect(branchRecord?.indices.has('IDX_branch_code_unique')).toBe(true);

    const userRecord = queryRunner.tables.get('app_user');
    expect(userRecord).toBeDefined();
    expect(userRecord?.foreignKeys.some((fk) => fk.columnNames.includes('branch_id'))).toBe(true);

    const taskInstanceRecord = queryRunner.tables.get('task_instance');
    expect(
      taskInstanceRecord?.foreignKeys.some((fk) => fk.columnNames.includes('template_id')),
    ).toBe(true);

    await migration.down(queryRunner);

    expect(queryRunner.tables.has('branch')).toBe(false);
    expect(queryRunner.tables.has('app_user')).toBe(false);
    expect(queryRunner.tables.has('task_instance')).toBe(false);
  });
});
