import dataSource from '../typeorm.config';

async function show() {
  await dataSource.initialize();
  try {
    const hasPendingMigrations = await dataSource.showMigrations();
    console.log(`Pending migrations: ${hasPendingMigrations}`);
  } finally {
    await dataSource.destroy();
  }
}

show().catch((error) => {
  console.error('Migration status failed', error);
  process.exitCode = 1;
});
