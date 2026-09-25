# 按组件发布与升级

## CI 与镜像

主仓库的 CI 按改动路径只运行受影响的检查：后端、前端或部署配置。CD 在 `main` 的 CI 成功后，只为发生变化的组件构建镜像并推送到 GHCR，以完整 Git SHA 作为标签；前端按钮的改动不会重建后端镜像。CD 默认不连接任何部署服务器。

| 镜像 | 地址 |
| --- | --- |
| 后端（API 与全部 Worker 共用） | `ghcr.io/<owner>/easy-gpa-plus-backend:<sha>` |
| 前端（Nginx 与静态资源） | `ghcr.io/<owner>/easy-gpa-plus-frontend:<sha>` |

每次发布的 `production-state` 制品包含 `release-manifest.json` 与 `images.env`，记录这一版可以一起使用的前后端镜像。比较基线是上次成功发布的清单：失败发布的改动会在下次补齐，旧的 CI 结果不会覆盖新版本；清单缺失时完整构建两端，手动运行并勾选 `full_deploy` 可以强制构建两端。

## 首次部署

先按[自托管部署](/deploy/self-hosting)配置 `.env` 并启动完整环境。之后可以在服务器上放置下载的 `images.env`，用已发布的镜像代替本机构建。

## 只更新前端

```sh
# --no-deps 保证不启动、重建或重启 API 与 Worker
docker compose --env-file .env --env-file images.env -f compose.yaml -f compose.images.yaml --profile full pull frontend
docker compose --env-file .env --env-file images.env -f compose.yaml -f compose.images.yaml --profile full up -d --no-deps frontend
```

为避免发布时已打开的页面请求旧 JS 后白屏，带内容哈希的前端资源会跨版本保留在 `frontend-assets` 卷中，更新前端容器时请保留这个卷。HTML 与 `/release.txt` 始终读取当前版本。

## 更新后端

1. 备份 PostgreSQL，见[备份与恢复](/deploy/backup)；
2. 拉取新的后端镜像；
3. 运行 `migrate`；
4. 迁移成功后更新 `api` 与各 Worker。

```sh
compose="docker compose --env-file .env --env-file images.env -f compose.yaml -f compose.images.yaml --profile full"
$compose pull migrate api
$compose run --rm migrate
$compose up -d --no-deps api worker-dispatch worker-notify worker-export worker-ai worker-agent worker-maintenance worker-backup
```

不要为了只更新前端而执行整套 `up --build`。两端的 SHA 相互独立，可从前端 `/release.txt` 与运维台「部署与版本」核对；API 有不兼容改动时需要两端同时发布。

## 从源码迭代

本地从源码更新同样可以只动一个组件：

```sh
docker compose --profile full build frontend
docker compose --profile full up -d --no-deps frontend
```

后端服务共用 `easygpa-plus-backend:local` 镜像，`build api` 一次即可，不会为每个 Worker 重复编译。

## 数据库迁移

迁移文件位于 `backend/db/migrations/`，编号递增，随二进制一起嵌入。`zongce migrate` 应用全部待执行迁移，`zongce migrate:down` 回退最近一个。回退可能删除该迁移引入的数据，例如回退 `000063` 会删除 MCP 连接记录，请先备份。
