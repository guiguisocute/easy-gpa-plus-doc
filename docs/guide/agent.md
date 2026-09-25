# 连接 Agent（MCP）

EasyGPA Plus 已提供 MCP Streamable HTTP 接口和本地 stdio 桥接。网页「问 Agent」与外部连接分别设置：网页开关按账号保存在当前浏览器，关闭它不会撤销外部连接。

## 三步接入

1. 登录后打开「账号设置 → 连接本地 Agent」，新建连接，选择有效期与权限，用当前密码确认。
2. 保存服务地址和只显示一次的临时密钥。默认选择「读取与分析」「草稿与上传」，有效期 1 小时；可自定义分钟数，默认上限 24 小时。
3. 在客户端配置远程 Streamable HTTP 服务及 Bearer 请求头，或使用下面的 stdio 桥接。

```text
URL: https://gpa.example.org/mcp
Authorization: Bearer <临时密钥>
```

密钥放客户端凭据库或环境变量，不放 URL、提示词、仓库或命令行参数。服务端只保存随机密钥的 SHA-256 摘要，不可找回原密钥。每账号最多 10 条有效连接；连接列表可查看范围、到期、最近使用时间，并随时撤销。过期后需要手动新建。

## 仅支持 stdio 的客户端

安装 Node.js 24，使用[主仓库](https://github.com/guiguisocute/easy-gpa-plus/tree/main/scripts) `scripts/` 中三个无额外 npm 依赖的脚本：`mcp-bridge.mjs`、`mcp-http.mjs` 与 `mcp-upload.mjs`。客户端配置的字段名称以其文档为准；以下是常见 `mcpServers` 结构，密钥通过启动该客户端的环境或其凭据管理注入：

```json
{
  "mcpServers": {
    "easygpa": {
      "command": "node",
      "args": ["/absolute/path/easy-gpa-plus/scripts/mcp-bridge.mjs"],
      "env": {
        "EASYGPA_MCP_URL": "https://gpa.example.org/mcp"
      }
    }
  }
}
```

另将 `EASYGPA_MCP_TOKEN` 安全注入桥接进程。Windows 的脚本绝对路径在 JSON 中用 `/` 或 `\\`。桥接只把 JSON-RPC 写到 stdout，错误写到 stderr，不保存密钥；远程地址要求 HTTPS，本机开发允许 loopback HTTP。桥接进程的每次请求仍由服务器重新鉴权。

目前实现手工 Bearer 密钥模式，没有 OAuth 登录、旧式 HTTP+SSE 端点或服务端推送。要求 OAuth、不能设置 Authorization、也不能启动 stdio 服务的客户端暂不适用。Streamable HTTP 使用官方 Go SDK v1.7.0，采用无状态 JSON 响应模式，协议版本由初始化协商。

## 账号权限与工具

有效权限 = 账号当前权限 ∩ 连接获授范围 ∩ 业务此刻允许的操作。

| 授权范围 | 可用身份 | 能力 |
| --- | --- | --- |
| `read` | 学生及以上 | 账号可见的规则、成绩、提交、附件、申诉、班级资料；小组额外读取自己的任务，班管读取本班统计与管理资料 |
| `draft` | 学生及以上 | 创建、更新、删除本人材料草稿，上传佐证，创建申诉草稿 |
| `submit` | 学生及以上 | 正式提交、撤回、申诉与核对当前成绩 |
| `review` | 小组及以上 | 提交审核、申诉复评、举报复核和扣分/异议提案；副班管可准备其职责内的班管事项 |
| `manage` | 班管 | 准备改分、仲裁、直接加分、方案草稿/发布、新增名单成员、GPA 导入、分发、时间窗口、解封与结算 |
| `export` | 班管 | 创建报表任务、读取进度和下载 |

`tools/list` 只列出当前连接可用的工具，工具说明和 JSON Schema 给出参数要求。常用入口：`scheme.current`、`scores.mine`、`scores.scorecard`、`submissions.list/get/draft/update`、`reviews.mine/context/decide`、`class.report/progress/members`、`exports.create/status`。

接口复用网页业务处理器、租户事务和权限验证。封存与窗口、全系统封锁、本人回避、副班管范围、背靠背审核与公示附件规则照常生效。学生成绩核对不阻塞结算，也不取消申诉权。

账号改密/重置、角色或副班管关系变化、停用、班级归档都会撤销旧连接，之后恢复账号或升权也不会恢复旧密钥。MCP 密钥不能作为网页登录令牌使用，网页会话也不能用于 MCP。运维、密码与角色变更、凭据读取、任意 SQL/HTTP 代理不在工具列表中。尚未覆盖的网页功能仍在网页办理。

分析由用户自己的 Agent 和模型完成，不依赖站内 AI 开关或模型额度。客户端可能把读取的材料发送给它所配置的模型服务；用户应按自己的使用场景授权。

## 上传本地材料

先调用 `submissions.draft` 获取草稿 ID，然后让具有本地文件能力的 Agent 运行：

```sh
node scripts/mcp-upload.mjs <草稿ID> <本地文件路径> [请求UUID]
```

连接环境与桥接相同。脚本计算文件大小和 SHA-256，调用 `evidence.prepare_upload`，将原始字节 PUT 到返回地址，再调用 `evidence.complete_upload`。网络重试可以复用请求 UUID；同一个 UUID 不得换文件。完成上传不会自动正式提交，后续提交须具备 `submit` 范围。

也可以自行实现这三个步骤。上传许可绑定连接、草稿和文件摘要，最长 15 分钟且不超过连接有效期；服务端核验大小、SHA-256、文件格式和业务条件。单文件上传/下载最多 64 MiB，平台或小项可设更小上限，大型归档走网页下载。MCP 消息上限 256 KiB，不传大段 Base64，不发送本地路径让远程服务器读取。

`evidence.read`、`resources.read`、`exports.status` 返回本站的下载地址。每次下载必须携带当前连接的 Bearer，并重新校验业务可见性；不会交给客户端可绕过撤销的对象存储签名。上传许可完成后不能覆盖已有文件。

## 批准、重试与审计

所有写工具要求 `idempotencyKey`。相同键和相同内容重试返回原结果；换内容返回冲突。修改/删除草稿还要提交最近一次 `submissions.get` 返回的 `resourceVersion` 作为 `expectedVersion`。

班级管理及副班管裁定使用以下流程，当前实现必须网页批准，不能由客户端自行批准：

1. 调用 `*.prepare`，返回操作 ID、对象、变更内容、可用的变更前资料和账号设置地址，最长保留 10 分钟。
2. 账号本人打开设置，点击「刷新连接与操作」，展开核对后批准或拒绝。
3. Agent 调用 `operations.commit`，服务端复验授权、准备时的业务数据摘要及全部业务条件，然后在同一事务中执行和留审计。

准备只生成待核对内容，不保证届时能执行。准备后材料、成员、方案等发生变化会返回冲突，需要重新准备。审批不转移操作内容，提交不能改参数；已执行的操作 ID 可安全重试。连接撤销或过期后不能继续执行。后台导出在读快照前和发布结果前重新验证连接，撤销后不发布未完成的结果。

审计保留真实操作者，并增加 `channel=mcp`、`connectionId`、`operationId`；匿名业务轨迹不因这些内部标记暴露审核人。账号设置展示最近 100 条连接与代办记录。

## 部署配置

- `PUBLIC_URL` 设置为外部实际访问的站点 origin，服务 URL 自动生成为其 `/mcp`。完整变量见[环境变量](/reference/environment#应用)。
- `MCP_ENABLED=true` 默认启用接口；没有用户主动创建连接时不存在可用外部密钥。设为 `false` 可整体关闭外部请求和新建连接。
- `MCP_MAX_TTL_HOURS=24` 配置最长时限，允许 1—168 小时。
- 迁移 `000063` 新增租户隔离的连接、代办和上传记录，并给导出任务绑定连接。使用项目正常迁移流程；反向迁移会删除这些连接记录。
- 自带 Nginx 与 Vite 代理均转发 `/mcp` 和 `/mcp/*`。自备反代需保留 Authorization、Content-Type、Accept、MCP-Protocol-Version，上传体上限至少 64 MiB；不要记录 Authorization 或创建连接的完整响应。
- MCP JSON 结果上限 4 MiB，支持分页的读取每页 `limit` 最多 100；大结果缩小范围或使用导出。每连接 120 次/分钟、突发 20 次，每账号 240 次/分钟、突发 40 次，同时最多两个文件传输。

## 回归测试

在主仓库运行（端到端环境说明见[测试与 E2E](/development/testing)）：

```sh
node --test scripts/mcp-bridge.test.mjs
node e2e/run.mjs backend
node e2e/run.mjs mcp
```

后端回归使用官方 SDK 客户端连接真实 HTTP 服务和隔离数据库，覆盖范围过滤、上传完整性、跨账号/跨班拒绝、业务封锁、批准与过期版本、重复写入、撤销和到期。CLI 端到端回归走真实注册接口、前端代理、stdio 桥接、本地文件上传与鉴权下载。mock 只演示连接管理与批准交互，`demo_only_` 密钥无法连接真实服务。

参考：[官方 Go SDK](https://github.com/modelcontextprotocol/go-sdk/tree/v1.7.0)、[MCP 协议规范](https://modelcontextprotocol.io/specification)。本文的范围、时限与审批流程是 EasyGPA Plus 的产品规则。
