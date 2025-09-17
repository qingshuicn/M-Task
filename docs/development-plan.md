# Development Plan: mdtsk Monorepo

## Plan Overview

- **Goal**: Deliver the mdtsk task collaboration platform in alignment with the PRD v2.3 requirements, covering backend services, frontend experience, real-time collaboration, and deployment readiness.
- **Methodology**: Two-week sprints with milestone-based tracking. Each milestone closes a set of PRD functional requirements and updates the relevant task documents (`001.md` – `010.md`).
- **Team Setup**: Backend (2 devs), Frontend (2 devs), Full-stack Integrations (1 dev), QA (1), DevOps (1). Product owner coordinates backlog grooming and acceptance.

## Milestones & Deliverables

| Milestone                             | Duration | Scope Highlights                                                                                   | Dependencies | Acceptance Snapshot                                        |
| ------------------------------------- | -------- | -------------------------------------------------------------------------------------------------- | ------------ | ---------------------------------------------------------- |
| **Sprint 0 – Foundation**             | 1 week   | Monorepo scaffolding, shared tooling, Dockerized local stack.                                      | None         | ✅ `001` 完成；根目录脚本可运行；Lint/Test/Build 通过。    |
| **Sprint 1 – Data Layer**             | 2 weeks  | PostgreSQL schema, TypeORM entities, migrations, seed scripts, database CI service.                | Sprint 0     | ✅ `002` 完成；数据库迁移在 CI 中执行通过。                |
| **Sprint 2 – Identity & Access**      | 2 weeks  | OAuth2.0 + PKCE login, SSO integration adapter, JWT issuance/validation, RBAC policies.            | Sprint 1     | ✅ `003` 完成；端到端登录流程（Postman + 前端 stub）验证。 |
| **Sprint 3 – Task Core**              | 3 weeks  | Task template CRUD & versioning, task instance lifecycle, assignment logic, audit trail hooks.     | Sprint 2     | ✅ `004` 完成；关键 API 集成测试覆盖。                     |
| **Sprint 4 – Collaboration Services** | 2 weeks  | MinIO-based attachment service, BullMQ notification service, SMTP integration, templated emails.   | Sprint 3     | ✅ `005`、`006` 完成；文件与通知链路在 staging 验证。      |
| **Sprint 5 – Frontend Experience**    | 3 weeks  | Layout framework, shared components, Kanban board (dnd-kit), WebSocket sync, reviewer console.     | Sprint 3 & 4 | ✅ `007`、`008`、`009` 完成；E2E 场景演练录像。            |
| **Sprint 6 – Production Readiness**   | 2 weeks  | Docker build pipeline, Nginx + SSL, observability (Prometheus/Grafana), error tracking, load test. | Sprint 1–5   | ✅ `010` 完成；部署脚本一键上线成功。                      |

## Workstreams & Ownership

1. **Backend Platform**
   - Lead: Senior NestJS engineer.
   - Responsibilities: Database design (`002`), auth (`003`), task APIs (`004`), notification service (`006`).
2. **Frontend Experience**
   - Lead: Senior React engineer.
   - Responsibilities: Routing/layout (`007`), Kanban & real-time UI (`008`), admin console (`009`).
3. **DevOps & Infrastructure**
   - Lead: DevOps engineer.
   - Responsibilities: Docker/Compose upkeep, environment provisioning, CI/CD pipelines, observability (`010`).
4. **QA & Product**
   - Lead: QA specialist.
   - Responsibilities: Define acceptance tests per milestone, maintain regression suites, coordinate UAT.

## Cross-Cutting Engineering Practices

- **Branch Strategy**: trunk-based development with short-lived feature branches merged via PR and automated checks.
- **Code Quality**: Enforce ESLint, Prettier, Husky hooks; introduce unit tests (Jest + React Testing Library), integration tests (Supertest), and E2E tests (Playwright) as milestones advance.
- **Documentation**: Update task docs (`001`–`010`) upon completion, maintain API reference via OpenAPI generator, and record architectural decisions in ADRs.
- **Security & Compliance**: Apply OWASP ASVS checks, regular dependency audits, secrets scanning (GitGuardian), and least-privilege IAM setup for cloud resources.

## Immediate Next Actions (Sprint 2 Kick-off)

- [x] 定义 OAuth2 + JWT 认证流程，与 SSO 团队确认回调与授权范围，输出集成清单。
- [x] 设计 RBAC 权限模型（角色 ↔ 权限矩阵），补充至 `003.md` 技术细节。
- [x] 搭建 AuthModule 骨架，预置 DTO/Guard/Strategy 目录结构并串联数据库用户实体。
- [x] 草拟单元测试计划（登录、令牌刷新、权限校验），与 QA 对齐覆盖范围。
- [x] 更新开发环境变量文档，补充 OAuth 客户端、JWT 私钥、Redis 会话等配置项。

## Sprint 2 Kick-off Blueprint

### OAuth2 + JWT 端到端流程

1. Web 客户端请求 `/auth/authorize` 获取带 PKCE 参数的授权链接。
2. 用户在 SSO 完成认证后，前端携带 `code`、`state`、`code_verifier` 调用 `/auth/callback`。
3. 后端与 SSO 的 Token Endpoint 交换 Access Token，并基于 `sub`/`email` 解析用户信息。
4. `AuthService` 结合用户资料颁发 RS256 签名的 Access/Refresh Token，并在 Redis 记录会话 ID。
5. 后续受保护 API 通过 `JwtAuthGuard` + `RolesGuard` + `PermissionsGuard` 校验身份与权限。

### 单元测试计划概览

- `auth.service.spec.ts`: 覆盖授权链接生成、会话写入 Redis、用户映射与异常场景。
- `jwt-access.strategy.spec.ts`: 验证携带合法 Access Token 时能解析出用户信息，异常时抛出 `UnauthorizedException`。
- `jwt-refresh.strategy.spec.ts`: 验证刷新令牌读取逻辑、会话校验与错误分支。
- `auth.controller.spec.ts`: 使用 `supertest` 模拟 `authorize`/`me` 路径，确保守卫链路正确挂载。
- 使用 Redis mock（`ioredis-mock`）与 Passport 自定义 mock，保证测试可独立运行。

> 📌 环境变量一览请见 `docs/environment-variables.md`，后续将同步至基础设施脚本与 CI 密钥管理。

## Risk Register (Top 5)

| Risk                                   | Likelihood | Impact | Mitigation                                                                        |
| -------------------------------------- | ---------- | ------ | --------------------------------------------------------------------------------- |
| SSO integration sandbox delays         | Medium     | High   | Engage SSO team early; design adapter with mock provider for development/testing. |
| Real-time sync performance bottlenecks | Medium     | Medium | Prototype Socket.io namespace early; add performance budgets and monitoring.      |
| Attachment storage compliance          | Low        | High   | Align MinIO retention policy with legal; encrypt at rest and enforce signed URLs. |
| Notification deliverability            | Medium     | Medium | Implement retry/backoff with BullMQ; monitor SMTP response codes.                 |
| Deployment environment drift           | Medium     | High   | Maintain IaC (Terraform/Ansible), run nightly configuration drift checks.         |

## Definition of Done (per milestone)

- Requirements mapped to implemented features with traceability links (task IDs ↔ PRs).
- Automated tests (unit + integration) passing, coverage trend non-decreasing.
- Documentation updated (README sections, API docs, runbooks).
- Security review checklist completed for new surfaces.
- Demo walkthrough recorded for stakeholders with acceptance sign-off.
