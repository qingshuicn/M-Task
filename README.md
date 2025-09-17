# mdtsk Monorepo

党政事务部集团-分校任务追踪系统（mdtsk）的代码仓库采用 pnpm 管理的 Monorepo 结构，包含 React 前端与 NestJS 后端项目。本仓库提供开发、代码规范及容器化的基础配置，满足 PRD 中对项目初始化的要求。

## 项目结构

```
.
├── backend/           # NestJS 12 服务端工程
├── frontend/          # React 19 + Vite 前端工程
├── package.json       # pnpm workspace 及统一脚本
├── pnpm-workspace.yaml
├── tsconfig.base.json # TypeScript 基础配置
├── eslint.config.mjs  # 统一 ESLint 规则（Flat Config）
├── .prettierrc        # Prettier 代码风格配置
├── docker-compose.yml # 本地一键启动（前后端+依赖）
└── Dockerfile         # 多阶段构建镜像示例
```

## 开发准备

1. 安装 Node.js >= 18 与 pnpm >= 8：
   ```bash
   corepack enable
   corepack prepare pnpm@8 --activate
   ```
2. 安装依赖：
   ```bash
   pnpm install
   ```
3. 初始化 Husky 钩子（`pnpm install` 会自动触发 `prepare` 脚本）：
   ```bash
   pnpm prepare
   ```

## 常用脚本

| 命令                                   | 说明                           |
| -------------------------------------- | ------------------------------ |
| `pnpm dev`                             | 启动前端开发服务器（Vite）     |
| `pnpm --filter backend start:dev`      | 以监听模式启动 NestJS 后端     |
| `pnpm lint`                            | 执行所有工作空间的 ESLint      |
| `pnpm format`                          | 使用 Prettier 对代码进行格式化 |
| `pnpm build`                           | 构建前后端项目                 |
| `pnpm test`                            | 运行所有包的测试命令           |
| `pnpm --filter backend migrate:run`    | 执行最新数据库迁移             |
| `pnpm --filter backend migrate:revert` | 回滚上一条数据库迁移           |
| `pnpm --filter backend migrate:show`   | 查看待执行的数据库迁移         |

## 代码规范

- 使用 ESLint + Prettier 管控代码风格。
- Husky 配置 `pre-commit`（lint-staged）与 `commit-msg`（commitlint）钩子，确保提交符合 Conventional Commits 规范。
- `tsconfig.base.json` 提供统一的 TypeScript 严格模式设置，各子项目通过 `extends` 复用。

## Docker 支持

- `Dockerfile` 提供多阶段构建示例：使用 pnpm 安装依赖并分别构建前后端工件。
- `docker-compose.yml` 帮助本地快速启动前端、后端与 PostgreSQL、Redis 等基础服务。

执行以下命令即可启动本地开发栈：

```bash
docker compose up --build
```

> 若只需启动某个服务，可在 `docker-compose.yml` 中调整或单独执行对应命令。

## 数据层配置

- 后端通过 `@nestjs/config` 读取以下环境变量（默认为本地 docker-compose）：
  - `DATABASE_HOST` / `DATABASE_PORT` / `DATABASE_USERNAME` / `DATABASE_PASSWORD` / `DATABASE_NAME`
  - `REDIS_HOST` / `REDIS_PORT` / `REDIS_PASSWORD` / `REDIS_DB` / `REDIS_KEY_PREFIX`
- 执行迁移前请确保 PostgreSQL 与 Redis 服务已启动，可直接运行 `docker compose up -d postgres redis`。
- 如需自定义连接，可在 `backend/.env.local`（未提交）中覆盖上述变量，并通过 `pnpm --filter backend migrate:run` 应用 schema。
- 迁移脚本位于 `backend/src/database/migrations`，会在构建时编译到 `dist/`，生产环境使用同一套变更历史。

## 已落地的后端能力

- 启用 URI 版本控制的 NestJS 应用骨架，提供 `/api/v1/health` 健康检查接口与全局校验、CORS 支持。
- 基于 `Branch` 模块开放 `/api/v1/branches` CRUD API，可维护分校基础信息，供任务分配等业务使用。

## 进一步开发

- 在 `frontend/` 中补充页面、组件与 API 调用逻辑。
- 在 `backend/` 中实现 NestJS 模块（认证、任务、通知等）。
- 根据 PRD 要求逐步完善实时协作、文件存储与大屏展示等功能模块。

如需更多背景信息，请参考 `mdtsk.md` 与 `epic.md` 中的 PRD 及需求描述。
