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
  auth: {
    oauthClient: {
      authorizationUrl:
        process.env.OAUTH_AUTHORIZATION_URL ?? 'https://sso.example.com/oauth/authorize',
      tokenUrl: process.env.OAUTH_TOKEN_URL ?? 'https://sso.example.com/oauth/token',
      clientId: process.env.OAUTH_CLIENT_ID ?? 'mdtsk-local',
      clientSecret: process.env.OAUTH_CLIENT_SECRET ?? 'change-me',
      redirectUri: process.env.OAUTH_REDIRECT_URI ?? 'http://localhost:3000/auth/callback',
      scope: process.env.OAUTH_SCOPE ?? 'openid profile email',
    },
    jwt: {
      issuer: process.env.JWT_ISSUER ?? 'mdtsk-service',
      audience: process.env.JWT_AUDIENCE ?? 'mdtsk-clients',
      accessTokenTtl: process.env.JWT_ACCESS_TTL ?? '15m',
      refreshTokenTtl: process.env.JWT_REFRESH_TTL ?? '7d',
      publicKey: process.env.JWT_PUBLIC_KEY ?? '',
      privateKey: process.env.JWT_PRIVATE_KEY ?? '',
    },
    cookieDomain: process.env.AUTH_COOKIE_DOMAIN,
    redisKeyPrefix: process.env.AUTH_REDIS_PREFIX ?? 'sessions',
  },
});

export type AppConfig = ReturnType<typeof configuration>;
