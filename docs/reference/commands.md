# 命令与服务

## 后端子命令

后端是一个名为 `zongce` 的二进制，同一份程序按子命令区分进程角色：

| 子命令 | 作用 |
| --- | --- |
| `api` | HTTP API 与 MCP 服务 |
| `worker:dispatch` | 按分发结果派发审核任务 |
| `worker:notify` | 站内通知与邮件投递 |
| `worker:export` | 生成汇总表、明细、归档与学院报表 |
| `worker:maintenance` | 定时提醒、自动封存、审核时限、导出与临时文件清理 |
| `worker:backup` | 每日数据库与对象备份、恢复演练、异地推送 |
| `worker:ai` | AI 材料整理 |
| `worker:agent` | 班级资料转换与知识问答 |
| `migrate` | 应用全部待执行的数据库迁移 |
| `migrate:down` | 回退最近一个数据库迁移 |
| `eval:ai` | 离线模型评测，不连接业务数据库 |
| `eval:knowledge` | 真实班级知识 Agent 评测，需要双重外发确认 |
| `version` | 输出版本 |

在 `backend/` 目录中可以直接运行，例如 `go run ./cmd/zongce migrate`。

## 独立部署的服务

`compose.yaml` 中，PostgreSQL、Redis 与 Garage 不属于任何 profile，始终启动；其余服务按 profile 启用：

| 服务 | profile | 说明 |
| --- | --- | --- |
| `postgres` | — | PostgreSQL 17 |
| `redis` | — | Redis 8，开启 AOF 持久化 |
| `garage` | — | Garage v2.3 单节点 S3 存储，自动建桶与密钥 |
| `migrate` | `full`、`ai` | 一次性迁移，完成后其他后端服务才启动 |
| `api` | `full` | API |
| `worker-dispatch`、`worker-notify`、`worker-export`、`worker-maintenance`、`worker-backup` | `full` | 各 Worker |
| `worker-ai`、`worker-agent` | `full`、`ai` | AI 相关 Worker，常驻但在运维开关开启前保持空闲 |
| `frontend` | `full` | Nginx 与静态前端 |

`compose.images.yaml` 把上述后端服务与前端改为使用 `BACKEND_IMAGE` 与 `FRONTEND_IMAGE` 指定的已发布镜像，见[按组件发布与升级](/deploy/releases)。

## 本地开发环境

`compose.dev.yaml` 的项目名为 `easygpa-plus-dev`：Go API 用 air 热重载，Worker 在二进制更新后自动重启，前端运行 Vite 开发服务器。Windows 推荐使用 `scripts/dev.ps1`：

| 命令 | 作用 |
| --- | --- |
| `./scripts/dev.ps1 up` | 启动全部服务，就绪后打印前端与 API 地址 |
| `./scripts/dev.ps1 down` | 停止容器，保留依赖缓存与开发数据 |
| `./scripts/dev.ps1 stop [服务…]` | 停止指定服务 |
| `./scripts/dev.ps1 restart [服务…]` | 重启服务，默认重启 api、workers 与 frontend |
| `./scripts/dev.ps1 ps` / `status` | 查看服务状态；`status` 还会检查 Docker 磁盘占用 |
| `./scripts/dev.ps1 logs [服务…]` | 跟随日志 |
| `./scripts/dev.ps1 migrate` | 手动运行迁移 |
| `./scripts/dev.ps1 rebuild` | 重新构建后端镜像并启动 |
| `./scripts/dev.ps1 verify` | 校验配置、启动并检查前端、API 与鉴权 |
| `./scripts/dev.ps1 test` | 在隔离环境运行 Go 测试，再运行前端测试 |
| `./scripts/dev.ps1 debug [api｜workers <kind>]` | 以 Delve 调试 API 或指定 Worker |
| `./scripts/dev.ps1 e2e` / `e2e-clean` | 运行全部端到端测试 / 删除 E2E 缓存卷 |
| `./scripts/dev.ps1 clean` | 停止容器并删除依赖与构建缓存，保留数据库和对象存储数据 |

其他系统可以直接使用 Compose：

```sh
docker compose --env-file .env.development -f compose.dev.yaml up -d --build
```

## Make 目标

`Makefile` 面向在宿主上运行 Go 与 Vite、只把依赖放进容器的混合模式：

| 目标 | 作用 |
| --- | --- |
| `make dev` | 启动 PostgreSQL、Redis 与 Garage |
| `make api` / `make api-plain` | 热重载运行 API / 直接 `go run` |
| `make web` | 启动前端开发服务器 |
| `make full` | 以 `--profile full` 构建并启动整套服务 |
| `make migrate-up` / `make migrate-down` | 应用 / 回退迁移 |
| `make seed` | 创建开发测试班与三个业务账号 |
| `make test` / `make lint` / `make fmt` | 后端测试、静态检查与格式化 |
| `make sqlc` | 由 `db/queries/*.sql` 生成代码 |
| `make e2e`、`make e2e-all`、`make e2e-clean` | 端到端测试，见[测试与 E2E](/development/testing) |
| `make garage` | 查看 Garage 状态 |

## 前端脚本

在 `frontend/` 目录中：

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | Vite 开发服务器 |
| `npm run lint` | oxlint 与界面文案检查 |
| `npm test` | 单元测试与演示站测试 |
| `npm run build` | 类型检查、生产构建并打包对应源码 |
| `npm run mock` / `npm run mock:build` | 运行 / 构建演示站 |
| `npm run mock:deploy` | 部署演示站到 Cloudflare Pages |
