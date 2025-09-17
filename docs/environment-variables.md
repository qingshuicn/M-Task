# Environment Variables

> 本文档用于集中跟踪本地开发与部署所需的环境变量。所有变量均已在 `backend/src/config/configuration.ts` 中有默认值，生产环境需覆盖敏感项。

## Database

| Variable            | Description                  | Default     |
| ------------------- | ---------------------------- | ----------- |
| `DATABASE_HOST`     | PostgreSQL 主机地址          | `localhost` |
| `DATABASE_PORT`     | PostgreSQL 端口              | `5432`      |
| `DATABASE_USERNAME` | PostgreSQL 用户名            | `mdtsk`     |
| `DATABASE_PASSWORD` | PostgreSQL 密码              | `mdtsk`     |
| `DATABASE_NAME`     | PostgreSQL 数据库名称        | `mdtsk`     |
| `TYPEORM_LOGGING`   | 启用 SQL 日志 (`true/false`) | `false`     |

## Redis

| Variable           | Description        | Default     |
| ------------------ | ------------------ | ----------- |
| `REDIS_HOST`       | Redis 主机地址     | `localhost` |
| `REDIS_PORT`       | Redis 端口         | `6379`      |
| `REDIS_PASSWORD`   | Redis 密码（可选） | `undefined` |
| `REDIS_DB`         | Redis 数据库编号   | `0`         |
| `REDIS_KEY_PREFIX` | Redis key 前缀     | `mdtsk`     |

## OAuth2 / SSO

| Variable                  | Description | Default                                   |
| ------------------------- | ----------- | ----------------------------------------- |
| `OAUTH_AUTHORIZATION_URL` | 授权端点    | `https://sso.example.com/oauth/authorize` |
| `OAUTH_TOKEN_URL`         | 令牌端点    | `https://sso.example.com/oauth/token`     |
| `OAUTH_CLIENT_ID`         | 客户端 ID   | `mdtsk-local`                             |
| `OAUTH_CLIENT_SECRET`     | 客户端密钥  | `change-me`                               |
| `OAUTH_REDIRECT_URI`      | 回调地址    | `http://localhost:3000/auth/callback`     |
| `OAUTH_SCOPE`             | 请求 scope  | `openid profile email`                    |

## JWT

| Variable          | Description                  | Default         |
| ----------------- | ---------------------------- | --------------- |
| `JWT_ISSUER`      | JWT 签发者                   | `mdtsk-service` |
| `JWT_AUDIENCE`    | JWT audience                 | `mdtsk-clients` |
| `JWT_ACCESS_TTL`  | Access Token TTL（如 `15m`） | `15m`           |
| `JWT_REFRESH_TTL` | Refresh Token TTL（如 `7d`） | `7d`            |
| `JWT_PUBLIC_KEY`  | 公钥（PEM）                  | _required_      |
| `JWT_PRIVATE_KEY` | 私钥（PEM）                  | _required_      |

## Session & Cookies

| Variable             | Description        | Default     |
| -------------------- | ------------------ | ----------- |
| `AUTH_COOKIE_DOMAIN` | Cookie domain      | `undefined` |
| `AUTH_REDIS_PREFIX`  | Redis Session 前缀 | `sessions`  |

> ✅ 下一步：将生产密钥托管于密钥管理服务（Vault/KMS），并在 CI/CD 中通过密文注入。
