# 环境变量

部署差异只写进环境变量，代码不做修改。复制主仓库的 `.env.example` 作为起点：独立部署用 `.env`，开发环境用 `.env.development`，两者都不入库。`compose.yaml` 会在容器内覆盖数据库、Redis、对象存储地址与备份目录等连接参数，下表的默认值指进程本身的默认值。

`APP_ENV=prod` 时，进程启动前会检查当前子命令实际用到的关键配置，缺失或仍为默认值就拒绝启动。

## 应用

| 变量 | 默认 | 说明 |
| --- | --- | --- |
| `APP_ENV` | `dev` | `dev` 或 `prod` |
| `HTTP_ADDR` | `:8080` | API 监听地址 |
| `PUBLIC_URL` | `http://localhost:5173` | 外部访问的站点 origin。决定允许的页面来源、邮件链接与 MCP 地址（`<PUBLIC_URL>/mcp`） |
| `MCP_ENABLED` | `true` | 设为 `false` 整体关闭 MCP 外部请求和新建连接 |
| `MCP_MAX_TTL_HOURS` | `24` | MCP 连接最长有效期，1—168 小时 |
| `IMAGE_TAG`、`GIT_SHA` | `dev`、`unknown` | 版本信息，显示在运维台「部署与版本」 |
| `TRUSTED_PROXIES` | 空 | 可信反代的 IP 或 CIDR，逗号分隔。只有来自这些地址的 `X-Forwarded-For` 才会被采信 |
| `API_RATE_LIMIT_PER_MINUTE` | `180` | 应用层令牌桶的部署硬上限，10—100000；运维页可在上限内热调 |
| `API_RATE_LIMIT_BURST` | `60` | 突发上限，1 至每分钟上限 |
| `PASSWORD_HASH_CONCURRENCY` | `4` | Argon2 并发上限，1—16；每次约占 64 MiB 内存 |

## 认证

| 变量 | 默认 | 说明 |
| --- | --- | --- |
| `JWT_SECRET` | 开发值 | prod 必须为至少 32 字节的非默认值 |
| `ACCESS_TOKEN_TTL` | `15m` | 访问令牌有效期 |
| `REFRESH_TOKEN_TTL` | `720h` | 刷新令牌有效期，必须大于访问令牌 |
| `COOKIE_SECURE` | `false` | prod 必须为 `true` |
| `OPS_ACCOUNT` | `ops@localhost` | 运维登录账号 |
| `OPS_PASSWORD` | 开发值 | prod 必须为非默认值 |

## PostgreSQL

| 变量 | 说明 |
| --- | --- |
| `PG_USER`、`PG_PASSWORD`、`PG_DB` | 数据库所有者、密码与库名，默认 `easygpa` |
| `PG_APP_PASSWORD` | 业务角色 `easygpa_app` 的密码。该角色受行级安全约束，只能访问当前班级 |
| `PG_OPS_PASSWORD` | 运维角色 `easygpa_ops` 的密码，只获得平台管理所需的授权 |
| `DATABASE_URL` | API 与 Worker 使用的业务连接 |
| `MIGRATIONS_DATABASE_URL` | 迁移与备份使用的所有者连接 |
| `OPS_DATABASE_URL` | 运维功能使用的连接 |

`easygpa_app` 与 `easygpa_ops` 两个角色由 `deploy/postgres/init-roles.sh` 在数据库**首次初始化**时创建，之后修改 `PG_*_PASSWORD` 不会自动改库内密码。

## Redis

| 变量 | 默认 | 说明 |
| --- | --- | --- |
| `REDIS_ADDR` | `localhost:6379` | Redis 地址 |
| `REDIS_PASSWORD` | 空 | 使用外部 Redis 时的密码 |

## 对象存储

| 变量 | 默认 | 说明 |
| --- | --- | --- |
| `S3_ENDPOINT` | `localhost:3900` | 服务端访问对象存储的地址 |
| `S3_PUBLIC_ENDPOINT` | 同 `S3_ENDPOINT` | 写入预签名 URL、供浏览器直传的地址 |
| `S3_REGION` | `garage` | 区域 |
| `S3_ACCESS_KEY`、`S3_SECRET_KEY` | 开发值 | 访问密钥。Garage 格式为 `GK` + 24 位十六进制与 64 位十六进制 |
| `S3_BUCKET` | `easygpa` | 桶名 |
| `S3_USE_SSL` | `false` | 服务端连接是否用 HTTPS |
| `S3_PUBLIC_USE_SSL` | 同 `S3_USE_SSL` | 只影响预签名 URL 的协议。对象存储在 HTTPS 反代后面时设为 `true` |

## 邮件

推荐只设置 `MAIL_SECRET_KEY`，其余在运维台「邮件与通知」填写，见[邮件通知](/deploy/mail)。

| 变量 | 说明 |
| --- | --- |
| `MAIL_SECRET_KEY` | 32 字节，加密运维页保存的发信凭据 |
| `MAIL_TEMPLATE_DIR` | 模板目录，留空自动查找 `asset/mailtemplate`；容器镜像内为 `/app/mailtemplate` |
| `TENCENTCLOUD_SECRET_ID`、`TENCENTCLOUD_SECRET_KEY` | 回退配置：腾讯云凭据 |
| `TENCENTCLOUD_SES_REGION` | `ap-guangzhou`（默认）或 `ap-hongkong` |
| `TENCENTCLOUD_SES_FROM`、`TENCENTCLOUD_SES_FROM_NAME`、`TENCENTCLOUD_SES_REPLY_TO` | 回退配置：发信地址、发件人名称、回复地址 |
| `TENCENTCLOUD_SES_TEMPLATE_IDS` | 回退配置：模板名到模板 ID 的 JSON |

## 备份

| 变量 | 默认 | 说明 |
| --- | --- | --- |
| `BACKUP_DIR` | 空 | 本地备份目录。`compose.yaml` 内固定为 `/backups/local` |
| `BACKUP_OFFSITE_DIR` | 空 | 离机备份目录。`compose.yaml` 内固定为 `/backups/offsite`；prod 要求与 `BACKUP_DIR` 不同 |
| `BACKUP_OFFSITE_VOLUME` | `backupoffsite` 命名卷 | Compose 中离机目录的来源，填宿主路径即改为挂载该路径 |
| `BACKUP_RETENTION_DAYS` | `30` | 本地保留天数，1—3650 |
| `BACKUP_REMOTE_SECRET_KEY` | 空 | 32 字节，加密运维页保存的远程桶凭据 |
| `BACKUP_REMOTE_RECIPIENT` | 空 | age 公钥（`age1...`），用于加密推往远程桶的归档 |

## AI

新部署在运维台「Agent 配置」管理供应商与路由，见 [AI 与班级知识库](/deploy/ai)。

| 变量 | 默认 | 说明 |
| --- | --- | --- |
| `AI_ENABLED` | `false` | 单端点回退配置的 AI 总开关 |
| `AI_ALLOW_PRIVATE_NETWORK` | `false` | 仅自建内网模型需要，会放宽私网 SSRF 防护 |
| `AI_CONFIG_SECRET_KEY` | 空 | 32 字节，加密运维页保存的模型 API Key；prod 必须设置 |
| `LLM_BASE_URL`、`LLM_API_KEY` | 空 | 回退配置：OpenAI 兼容端点与 Key |
| `LLM_TEXT_MODEL`、`LLM_VISION_MODEL`、`LLM_AGENT_MODEL` | 空 | 回退配置：文本、视觉与问答模型 |
| `LLM_TIMEOUT` | `90s` | 单次调用超时，5 秒—10 分钟 |
| `AI_MAX_BATCH` | `100` | 单批材料数，1—100 |
| `AI_CONCURRENCY` | `2` | 并发数，1—8 |
| `AI_MAX_PDF_PAGES` | `64` | 单个 PDF 页数，1—64 |

## 前端开发

写入 `frontend/.env.local`，不入库。

| 变量 | 默认 | 说明 |
| --- | --- | --- |
| `VITE_API_PROXY` | `http://127.0.0.1:8080` | Vite 开发服务器把 `/api` 与 `/mcp` 转发到哪里 |
| `VITE_AI_ENABLED` | `false` | 仅保留给尚未接入运行时状态的旧 AI 占位区 |

## Compose 端口与镜像

| 变量 | 默认 | 说明 |
| --- | --- | --- |
| `FRONTEND_PORT` | `3080` | 独立部署时前端绑定的本机端口 |
| `DEV_FRONTEND_PORT` | `35173` | 开发环境前端 |
| `DEV_API_PORT` | `38080` | 开发环境 API |
| `DEV_POSTGRES_PORT` | `35432` | 开发环境 PostgreSQL |
| `DEV_REDIS_PORT` | `36379` | 开发环境 Redis |
| `DEV_S3_PORT` | `33900` | 开发环境 Garage S3 |
| `DEV_GARAGE_ADMIN_PORT` | `33903` | 开发环境 Garage 管理接口 |
| `DEV_WATCH_INTERVAL_MS` | `500` | Windows 目录挂载的轮询间隔，越小反馈越快、CPU 占用越高 |
| `BACKEND_IMAGE`、`FRONTEND_IMAGE` | 无 | 使用 `compose.images.yaml` 时指定已发布的不可变镜像 |

## 脚本与测试

| 变量 | 说明 |
| --- | --- |
| `EASYGPA_MCP_URL`、`EASYGPA_MCP_TOKEN` | `scripts/mcp-bridge.mjs` 与 `mcp-upload.mjs` 使用的服务地址和临时密钥，见[连接 Agent](/guide/agent) |
| `API_BASE`、`DEV_PASSWORD` | `scripts/seed-dev-accounts.mjs` 的 API 地址与开发账号密码 |
| `E2E_TEST_TOKEN` | 仅隔离的 E2E 环境使用，用于绕过限流；prod 禁止设置 |
| `ALLOW_RAW_THIRD_PARTY` | 真实班级知识评测 `eval:knowledge` 的外发确认之一 |
| `MOCK_PAGES_PROJECT`、`CLOUDFLARE_ACCOUNT_ID`、`CLOUDFLARE_API_TOKEN` | 部署演示站到 Cloudflare Pages，见[演示站](/development/demo) |
