import dataSource from '../typeorm.config';

async function revert() {
  await dataSource.initialize();
  try {
    await dataSource.undoLastMigration({ transaction: 'all' });
    console.log('Reverted latest migration');
  } finally {
    await dataSource.destroy();
  }
}

revert().catch((error) => {
  console.error('Migration revert failed', error);
  process.exitCode = 1;
});
