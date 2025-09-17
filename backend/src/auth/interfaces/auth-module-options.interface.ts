export interface OAuthClientConfig {
  authorizationUrl: string;
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string;
}

export interface JwtConfig {
  issuer: string;
  audience: string;
  accessTokenTtl: string;
  refreshTokenTtl: string;
  publicKey: string;
  privateKey: string;
}

export interface AuthModuleOptions {
  oauthClient: OAuthClientConfig;
  jwt: JwtConfig;
  cookieDomain?: string;
  redisKeyPrefix: string;
}
