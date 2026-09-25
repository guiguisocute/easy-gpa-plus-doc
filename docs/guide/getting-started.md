# 快速开始

## 在线体验

[演示站](https://easygpamock.guiguisocute.com)复用真实前端页面和虚构班级数据，所有操作只保存在当前浏览器，不连接后端，也不发送邮件。首次进入先以初始化班管的身份选择普通模式或共治模式；顶部常驻的演示入口可随时切换模式，普通模式下还能切换演示身份，共治模式下可推进演示时钟。

## 在本机启动

需要 Docker 与 Docker Compose。克隆[主仓库](https://github.com/guiguisocute/easy-gpa-plus)后：

```sh
cp .env.example .env.development
docker compose --env-file .env.development -f compose.dev.yaml up -d --build
```

打开 `http://localhost:35173`。Windows 也可以运行：

```powershell
./scripts/dev.ps1 up
```

这套开发环境会启动 PostgreSQL、Redis、Garage 对象存储、自动热重载的 API 与 Worker，以及 Vite 前端，数据库迁移在启动时自动执行。首次启动需要下载镜像和依赖，可能需要几分钟。端口和其他命令见[命令与服务](/reference/commands#本地开发环境)。

::: tip 端口冲突
开发环境默认占用 35173、38080、35432、36379、33900、33903。与其他项目冲突时，在 `.env.development` 修改 `DEV_*_PORT`。
:::

## 创建第一个班级

1. 使用 `.env.development` 中的 `OPS_ACCOUNT` / `OPS_PASSWORD` 登录，进入运维台。
2. 在「班级与班管」开启班级，并填写第一位班管的学号与姓名。
3. 班管在登录页用被任命的学号和姓名完成注册，设置密码后进入班级。
4. 班管在「班级成员」导入名单、任命综测小组；其余成员也用名单中的学号与姓名注册。
5. 在「方案编辑器」导入或编写评分方案，在「时间窗口」设定开放时间，然后发布。

仓库自带一份虚构的示例方案 `examples/scoring-scheme.json`，可在方案编辑器中导入后修改。方案结构见[评分方案](/guide/scoring-scheme)。

### 快速准备测试账号

开发环境启动后，可以一次建好「开发测试班」和三个业务账号：

```sh
API_BASE=http://127.0.0.1:38080 node scripts/seed-dev-accounts.mjs
```

脚本创建班管 `DEV001`、综测小组 `DEV002`、学生 `DEV003`，默认密码为 `devpass123`（可用 `DEV_PASSWORD` 覆盖），学号直接登录。

## 下一步

- 按角色了解操作：[学生](/guide/student)、[综测小组](/guide/reviewer)、[班级管理员](/guide/class-admin)
- 正式上线：[自托管部署](/deploy/self-hosting)
- 让本地 Agent 接入：[连接 Agent](/guide/agent)
