---
name: mdtsk
status: backlog
created: 2025-09-04T13:57:23Z
progress: 0%
prd: .claude/prds/mdtsk.md
github: [Will be updated when synced to GitHub]
---

# Epic: mdtsk - 党政事务部任务追踪系统

## Overview

构建一个轻量级、高效的任务协同平台，采用 Monorepo 架构，前后端分离设计。系统核心聚焦任务流转、实时协作和智能辅助，通过精简的技术实现和模块化设计，确保快速交付和可维护性。

## Architecture Decisions

### 核心技术决策
- **Monorepo 结构**：使用单一代码仓库管理前后端，简化CI/CD和依赖管理
- **实时通信**：WebSocket (Socket.io) 处理实时推送，减少轮询开销
- **异步处理**：BullMQ + Redis 处理通知发送、定时催办等异步任务
- **存储策略**：PostgreSQL主库 + Redis缓存 + MinIO对象存储的三层存储架构
- **认证方案**：OAuth2.0 + JWT，接入现有SSO系统，无需自建用户体系

### 设计模式选择
- **前端**：组件化 + Hooks模式，使用TanStack Query管理服务端状态
- **后端**：模块化 + 依赖注入，利用NestJS的IoC容器
- **API设计**：RESTful + WebSocket混合，批量操作优化网络开销
- **数据流**：单向数据流，前端使用Context API管理全局状态

## Technical Approach

### Frontend Components
**核心组件**：
- TaskBoard：看板组件（使用dnd-kit实现拖拽）
- TaskTemplate：模板管理器
- NotificationCenter：通知中心
- PublicScreen：大屏展示组件
- UserManager：用户权限管理

**状态管理**：
- TanStack Query：服务端数据缓存和同步
- React Context：用户信息和主题设置
- Local Storage：用户偏好和草稿保存

### Backend Services
**核心模块**：
- Auth模块：OAuth2认证、JWT管理、权限校验
- Task模块：任务CRUD、状态流转、版本管理
- Notification模块：消息队列、通知发送、催办规则
- Storage模块：文件上传、预签名URL、对象管理
- WebSocket网关：实时推送、在线状态、消息广播

**数据模型优化**：
- 使用JSONB存储任务步骤，减少表关联
- 审计日志使用分区表，提升查询性能
- Redis缓存热点数据（权限、配置等）

### Infrastructure
**部署架构**：
- 前端：Nginx静态托管 + CDN加速
- 后端：PM2进程管理 + 集群模式
- 数据库：主从复制 + 读写分离（后期优化）
- 缓存：Redis Cluster（生产环境）

**监控方案**：
- 应用监控：集成Sentry错误追踪
- 性能监控：自定义metrics接口
- 日志管理：结构化JSON日志

## Implementation Strategy

### 开发策略
1. **MVP优先**：先实现核心任务流转，再添加高级功能
2. **迭代开发**：每周发布测试版本，快速收集反馈
3. **测试驱动**：核心业务逻辑100%单测覆盖
4. **文档先行**：API文档使用Swagger自动生成

### 风险缓解
- LLM集成：设计降级方案，手动拆解任务
- WebSocket兼容：提供轮询降级方案
- 第三方服务：抽象Provider接口，支持快速切换

## Task Breakdown Preview

精简为10个核心任务，覆盖MVP功能：

- [ ] **T1: 项目初始化与基础架构** - Monorepo搭建、基础配置、开发环境
- [ ] **T2: 认证与用户管理** - OAuth2集成、用户CRUD、RBAC权限
- [ ] **T3: 任务核心功能** - 模板管理、任务实例、状态流转
- [ ] **T4: 看板与实时协作** - 拖拽看板、WebSocket推送、状态同步
- [ ] **T5: 文件存储服务** - MinIO集成、预签名上传、附件管理
- [ ] **T6: 通知与催办系统** - 消息队列、SMTP集成、定时催办
- [ ] **T7: 审核与闭环流程** - 审核功能、退回机制、任务归档
- [ ] **T8: 大屏展示功能** - 公共访问、签名验证、数据可视化
- [ ] **T9: LLM集成（可选）** - 任务智能拆解、降级方案
- [ ] **T10: 部署与优化** - 生产部署、性能优化、监控配置

## Dependencies

### 必要依赖（MVP）
- PostgreSQL数据库（已有）
- Redis服务（缓存+队列）
- SMTP服务（邮件通知）
- MinIO/S3（文件存储）

### 可选依赖（增强功能）
- SSO系统（已有则集成）
- LLM API（智能拆解）
- CDN服务（静态加速）
- 监控服务（Sentry等）

### 团队依赖
- 前端开发 2-3人
- 后端开发 2-3人
- DevOps支持 1人
- UI设计支持（兼职）

## Success Criteria (Technical)

### 性能指标
- API响应 P95 < 300ms
- 页面加载 < 2秒
- WebSocket延迟 < 1秒
- 并发用户 > 500

### 质量标准
- 单测覆盖率 > 80%
- 代码规范检查通过率 100%
- 零严重安全漏洞
- 关键路径零Bug

### 交付标准
- 完整API文档
- 部署运维手册
- 用户操作指南
- 源代码和配置

## Estimated Effort

### 时间估算
- **总工期**：10-12周（2.5-3个月）
- **MVP交付**：6-8周
- **完整功能**：10-12周

### 资源需求
- **开发团队**：4-6人
- **测试资源**：1-2人（可兼职）
- **基础设施**：开发/测试/生产环境各一套

### 关键路径
1. Week 1-2: T1 + T2（基础架构+认证）
2. Week 3-4: T3 + T4（核心功能+看板）
3. Week 5-6: T5 + T6（存储+通知）
4. Week 7-8: T7 + T8（审核+大屏）
5. Week 9-10: T9 + T10（LLM+部署）
6. Week 11-12: 集成测试、Bug修复、优化

## 优化建议

### 简化方案
1. **减少依赖**：初期可不集成LLM，手动创建任务模板
2. **功能裁剪**：暂缓自定义报表、BI分析等高级功能
3. **复用组件**：使用成熟的UI组件库（Ant Design/Arco）
4. **渐进增强**：先实现Web端，移动端使用响应式设计

### 快速迭代
1. **Docker化**：所有服务容器化，简化部署
2. **自动化测试**：CI/CD pipeline自动运行测试
3. **特性开关**：使用feature flag控制功能发布
4. **灰度发布**：分批推送新功能给用户

## Tasks Created
- [ ] 001.md - 项目初始化与基础架构搭建 (parallel: false)
- [ ] 002.md - 数据库设计与模型实现 (parallel: false, depends on: 001)
- [ ] 003.md - 认证系统与用户管理 (parallel: false, depends on: 002)
- [ ] 004.md - 任务管理核心功能 (parallel: false, depends on: 003)
- [ ] 005.md - 文件存储与附件管理 (parallel: true, depends on: 004)
- [ ] 006.md - 通知系统与消息队列 (parallel: true, depends on: 004)
- [ ] 007.md - 前端基础架构与核心组件 (parallel: true, depends on: 001)
- [ ] 008.md - 任务看板与实时协作 (parallel: false, depends on: 004, 007)
- [ ] 009.md - 审核流程与管理后台 (parallel: false, depends on: 004, 008)
- [ ] 010.md - 部署配置与生产优化 (parallel: false, depends on: all)

**Total tasks**: 10
**Parallel tasks**: 3 (005, 006, 007)
**Sequential tasks**: 7 (001, 002, 003, 004, 008, 009, 010)
**Estimated total effort**: 172-208 hours (约4-5周，2-3人并行开发)