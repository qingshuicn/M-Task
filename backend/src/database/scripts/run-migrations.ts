import dataSource from '../typeorm.config';

async function run() {
  await dataSource.initialize();
  try {
    const results = await dataSource.runMigrations({ transaction: 'all' });
    results.forEach((migration) => {
      console.log(`Executed migration: ${migration.name}`);
    });
  } finally {
    await dataSource.destroy();
  }
}

run().catch((error) => {
  console.error('Migration run failed', error);
  process.exitCode = 1;
});
