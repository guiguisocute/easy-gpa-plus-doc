# 自托管部署

主仓库提供两套相互独立的 Compose，各用自己的数据卷：

| 文件 | 用途 |
| --- | --- |
| `compose.dev.yaml` | 源码热更新的开发环境，见[快速开始](/guide/getting-started) |
| `compose.yaml --profile full` | 构建静态前端、API 与全部 Worker 的独立部署 |

本页说明后者。只想发布已构建的镜像而不在服务器编译，见[按组件发布与升级](/deploy/releases)。

## 准备

- 一台装有 Docker Engine 与 Docker Compose v2 的 Linux 服务器；
- 站点的 HTTPS 域名，例如 `gpa.example.org`；
- 对象存储的 HTTPS 域名，例如 `s3.example.org`。学生上传、下载佐证时由浏览器直连对象存储，因此它必须能从公网访问；
- 一个 HTTPS 反向代理（Nginx、Caddy、Cloudflare Tunnel 等）。

## 启动

```sh
git clone https://github.com/guiguisocute/easy-gpa-plus.git
cd easy-gpa-plus
cp .env.example .env
docker compose --profile full up -d --build
```

默认访问 `http://localhost:3080`（`FRONTEND_PORT` 可改），使用 `.env` 中的运维账号登录。数据库迁移由 `migrate` 服务在 API 启动前自动执行。之后运维创建班级、导入学号与姓名并任命班管，班管配置评分方案、时间窗口及专业成绩。仓库不内置学生名单。

## 正式部署清单

在 `.env` 中设置：

| 变量 | 要求 |
| --- | --- |
| `APP_ENV` | `prod`。缺少下列关键配置时进程会拒绝启动 |
| `PUBLIC_URL` | 外部实际访问的站点 origin，如 `https://gpa.example.org`。它同时决定允许的页面来源、邮件链接与 MCP 地址 |
| `COOKIE_SECURE` | `true`（prod 必须） |
| `JWT_SECRET` | 至少 32 字节的随机值，不能是默认值：`openssl rand -hex 32` |
| `OPS_ACCOUNT`、`OPS_PASSWORD` | 运维账号与非默认密码 |
| `PG_PASSWORD`、`PG_APP_PASSWORD`、`PG_OPS_PASSWORD` | 数据库所有者、业务角色与运维角色的密码。角色只在数据库**首次初始化**时创建，请在第一次启动前设好 |
| `S3_ACCESS_KEY`、`S3_SECRET_KEY` | 替换开发密钥。Garage 格式：`GK` + 24 位十六进制，与 64 位十六进制 |
| `S3_PUBLIC_ENDPOINT`、`S3_PUBLIC_USE_SSL` | 浏览器可达的对象存储域名与 `true` |
| `AI_CONFIG_SECRET_KEY` | 32 字节，加密运维页保存的模型 API Key（prod 必须）：`openssl rand -hex 32` |
| `MAIL_SECRET_KEY` | 启用邮件时设置，加密运维页保存的发信凭据 |
| `BACKUP_OFFSITE_VOLUME` | 离机备份所在的独立存储路径，见[备份与恢复](/deploy/backup) |
| `TRUSTED_PROXIES` | 只填写自己的反向代理地址或网段 |

::: warning 密钥一经使用不要更换
`AI_CONFIG_SECRET_KEY`、`MAIL_SECRET_KEY` 与 `BACKUP_REMOTE_SECRET_KEY` 用于加密已保存在数据库中的凭据。更换后旧密文无法解开，需要在运维页重新填写。
:::

### Garage 配置

`deploy/garage/garage.toml` 中的 `rpc_secret` 与 `admin_token` 是开发值。把它复制到仓库以外的目录，重新生成这两项（`openssl rand -hex 32`），再用 `compose.override.yaml` 替换挂载：

```yaml
# compose.override.yaml，与 compose.yaml 放在同一目录，Compose 会自动合并
services:
  garage:
    volumes:
      - /etc/easygpa/garage.toml:/etc/garage.toml:ro
```

### 反向代理

- 站点域名指向前端容器的 `3080` 端口。前端自带的 Nginx 提供静态资源和 CSP，并把 `/api/` 与 `/mcp` 转发给 API；上传体上限为 64 MiB。
- 对象存储域名指向 Garage 的 `3900` 端口。
- 自备的反代需要保留 `Authorization`、`Content-Type`、`Accept` 与 `MCP-Protocol-Version` 请求头，不要记录 `Authorization`。

前端与 API 同源。PostgreSQL、Redis、对象存储和 API 端口默认只绑定 `127.0.0.1`：

| 服务 | 本机端口 |
| --- | --- |
| 前端 | 3080 |
| API | 8080 |
| PostgreSQL | 5432 |
| Redis | 6379 |
| Garage S3 / 管理 | 3900 / 3903 |

需要真实客户端 IP 时，只在 `TRUSTED_PROXIES` 中填写自己的代理地址，API 才会采信 `X-Forwarded-For`。

## 可选能力

- **邮件**：找回密码、验证码与业务通知，见[邮件通知](/deploy/mail)。
- **AI**：材料整理、班级知识 Agent，见 [AI 与班级知识库](/deploy/ai)。
- **MCP**：随 API 提供，账号在设置中主动创建连接后才能访问，见[连接 Agent](/guide/agent)。
- **登录页校徽**：在运维台「开关与阈值」上传 SVG，可预览、替换或移除；示例文件为 `examples/crest.svg`。

邮件与 AI 都需要在运维页显式配置并启用。

## 日常维护

- 更新前备份 PostgreSQL、对象存储与部署配置，步骤见[按组件发布与升级](/deploy/releases)。
- `docker compose down` 保留数据卷；不要随意加 `--volumes`。
- 各容器日志按 50 MB × 3 份轮转。

## 源码提供义务

EasyGPA Plus 以 AGPL-3.0 发布。向他人提供网络服务时，须向使用者提供所运行版本的对应源码。正式构建和演示站构建都会自动生成 `source.tar.gz` 并在页面底部提供下载入口；修改代码后重新构建即可更新。

报表是通用参考模板，可以按学校规则替换 `backend/internal/exportjob/templates/` 中的文件。
