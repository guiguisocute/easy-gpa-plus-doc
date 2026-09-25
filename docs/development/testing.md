# 测试与 E2E

## 单元测试与静态检查

```sh
# 后端
cd backend
gofmt -l .
go vet ./...
go test ./...

# 前端
cd frontend
npm run lint
npm test
npm run build
```

依赖数据库的 Go 集成测试在没有 `EASYGPA_TEST_DATABASE_URL` 等变量时会自动跳过，由下面的隔离环境运行。

## 隔离的端到端环境

`e2e/run.mjs` 为每次运行启动独立的 Compose 项目 `easygpa-plus-e2e`：数据库使用 tmpfs，端口只绑定本机回环地址（前端 45173、API 48080、PostgreSQL 45432 等），与开发环境、其他项目互不干扰。运行结束后删除容器和测试数据，只保留依赖缓存卷。

```sh
node e2e/run.mjs backend      # Go 单元、集成与竞态检测，使用独立数据库
node e2e/run.mjs smoke        # 真实 HTTP 业务冒烟
node e2e/run.mjs workflow     # 冒烟、方案重发布、副班管、强制驳回、加分、解封与 Markdown 附件
node e2e/run.mjs all          # 全部 HTTP 场景与 Playwright
node e2e/run.mjs clean        # 删除 E2E 缓存卷
```

可用的单项目标：

| 目标 | 覆盖 |
| --- | --- |
| `mcp` | MCP 注册、stdio 桥接、本地文件上传与鉴权下载 |
| `governance` | 共治后端测试与 HTTP 流程 |
| `registration` | 名单注册，不绑定邮箱 |
| `knowledge` | 知识 Agent 全栈，使用合成模型 |
| `republish` | 方案重发布 |
| `deputy` | 副班管仲裁 |
| `force-rejection` | 强制驳回 |
| `bonus-grants` | 直接加分 |
| `unseal` | 解封与结算失效 |
| `current-score` | 实时成绩 |
| `gpa` | 专业素质分 |
| `review-revision` | 修改审核结论 |
| `submission-claims` | 申报与期望分 |
| `adjudication-history` | 处理历史 |
| `markdown-attachments` | 审核意见附件 |
| `score-history` | 成绩变化记录 |
| `college-export` | 学院格式导出 |
| `playwright` | 真实 Chromium 界面用例，额外参数会透传给 Playwright |

后端测试报告写入 `.ai-eval/go-test/`，该目录不入库。

AI 相关场景使用 `e2e/fake-openai.mjs` 合成模型，不访问外部服务。`make e2e-knowledge-real` 会把真实班级材料发给第三方模型，需要设置 `ALLOW_RAW_THIRD_PARTY=1` 并在命令行二次确认，请谨慎使用。

## CI

GitHub Actions 的 `ci` 工作流按改动路径选择检查：

- **后端**：gofmt、build、vet、test，以及并发相关包的 `-race` 测试；
- **前端**：lint、测试、MCP 桥接测试、生产构建与演示站构建；
- **部署配置**：渲染三套 Compose 配置，并检查部署脚本语法。

`checks` 汇总全部受影响的检查，可作为分支保护的必需状态。`cd` 工作流见[按组件发布与升级](/deploy/releases)。
