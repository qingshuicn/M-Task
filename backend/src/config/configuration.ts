export const configuration = () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  database: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    username: process.env.DATABASE_USERNAME ?? 'mdtsk',
    password: process.env.DATABASE_PASSWORD ?? 'mdtsk',
    name: process.env.DATABASE_NAME ?? 'mdtsk',
    logging: process.env.TYPEORM_LOGGING === 'true',
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB ?? '0', 10),
    keyPrefix: process.env.REDIS_KEY_PREFIX ?? 'mdtsk',
  },
});

export type AppConfig = ReturnType<typeof configuration>;
