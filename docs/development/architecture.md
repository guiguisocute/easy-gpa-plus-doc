# 架构

## 仓库结构

| 目录 | 内容 |
| --- | --- |
| `backend/` | Go 后端：`cmd/zongce` 入口，`internal/` 业务包，`db/migrations` 迁移，`db/queries` 与 sqlc |
| `frontend/` | React 19 + Vite 8 + TypeScript 前端 |
| `mock/` | 演示站：复用前端页面，用浏览器内的虚构后端代替 API |
| `e2e/` | 端到端测试与隔离环境运行器 |
| `deploy/` | 开发容器脚本、Garage、Nginx 与 PostgreSQL 初始化 |
| `asset/mailtemplate/` | 邮件模板 |
| `examples/` | 示例评分方案与校徽 |
| `scripts/` | 开发、MCP 桥接、CI 与打包脚本 |

## 后端

后端是一个 `zongce` 二进制，按子命令运行为 API 或各类 Worker，见[命令与服务](/reference/commands#后端子命令)。主要依赖：

- HTTP：Gin；认证使用 JWT 双令牌与 Argon2 密码哈希；
- 数据库：PostgreSQL 17，驱动 pgx，查询由 sqlc 生成；
- 队列：Redis Stream，失败的消息进入死信，可在运维台重投；
- 对象存储：任意 S3 兼容服务，默认 Garage，客户端 minio-go；
- 邮件：腾讯云 SES API；模型：OpenAI 兼容接口；
- MCP：官方 Go SDK v1.7.0，Streamable HTTP 无状态 JSON 模式；
- 备份加密：age。

### 租户隔离

每个班级是一个租户。业务表启用 PostgreSQL 行级安全，业务请求在事务开头设置 `app.current_class`，业务角色 `easygpa_app` 不能绕过行级安全，因此即使查询遗漏了班级条件，也读不到其他班级的数据。运维功能使用独立的 `easygpa_ops` 角色，迁移使用数据库所有者。

权限在后端判定。前端的角色守卫只防误操作，不是安全边界；运维身份访问业务接口得到 404，而不是 403。

### 评分与结算

评分规则在 `internal/scheme`，结算在 `internal/settle`。计分顺序固定为：单项封顶 → 互斥组 → 共享上限 → 基础分与扣分 → 分类封顶，以千分之一分定点运算，重复结算结果逐字节一致。结算快照同时保存总分、各项名次、奖学金档与三好结果，学生页、班管预览与导出读取同一份数据。

### 班级共治

共治复用的接口挂在路由的 `collective` 组：前缀换成 `/governance`，处理函数与 `/review`、`/admin` 相同，由 `requireGovernanceMember` 代替角色放行。前端只替换前缀（`queries.ts` 的 `deskBase`），并通过 `collective` 开关切换措辞。独立评审台与初审工作台共用 `components/ReviewDesk.tsx`；结算检查与导出授权共用 `SettlementGate.tsx` 等组件。共享组件只接收数据与回调，不内置班管或共治的写接口。`GET /governance/cases/:id` 下发当事人、申报内容、期望分和本轮已提交份数，不下发其他评审的身份或意见。

## 前端

- **不用路由库**：一个外壳加一块内容区，URL 只需要 `?v=` 一个参数。管理端与运维台按角色用 `React.lazy` 分包，学生不会下载到这些代码。
- **不用组件库**：设计令牌与外壳原语在 `components/ui.tsx`，样式以内联为主，悬停与焦点等伪类落到 `global.css` 的工具类。
- **容器查询**：侧栏占位时视口宽度并不代表内容宽度，响应式基于 `@container shell`。
- **ID 一律当字符串**：后端的 int64 以字符串下发，避免超出 JS 安全整数范围后被静默取整。
- **前端不算分**：提交页的期望分只是预期；封顶、共享上限、互斥组、合成、排名与三好都由后端结算器产出。排名在结算前不存在，页面显示「尚未结算」。
- 数据请求使用 TanStack Query，状态使用 Zustand，表单使用 react-hook-form 与 zod。

目录：

```text
frontend/src/
├── api/          client.ts（双令牌与 401 单飞刷新）、types.ts、queries.ts
├── components/   ui.tsx（设计原语）、Shell.tsx（外壳）、ReviewDesk.tsx 等共享组件
├── lib/          领域类型、导航表 nav.ts、格式化工具
├── pages/        student / group / admin / ops 与共治页面
├── stores/       Zustand：会话、视图、视角、主题
└── styles/       global.css（设计令牌）、fonts.css
```

## 部署拓扑

```text
浏览器 ──HTTPS──> 反向代理 ──> frontend (Nginx :8080)
                                  ├─ 静态资源与 CSP
                                  └─ /api/、/mcp ──> api (:8080)
浏览器 ──HTTPS 直传──> 反向代理 ──> garage (:3900)

api、worker-* ──> postgres、redis、garage
```

前端 Nginx 为文档设置了严格的 CSP：`script-src` 不含 `unsafe-inline`，`index.html` 中唯一的内联主题脚本通过 sha256 放行，`frontend/src/lib/csp.test.ts` 保证哈希与脚本同步。
