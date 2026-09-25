# 参与开发

欢迎提交 Issue 与 Pull Request。代码在 [guiguisocute/easy-gpa-plus](https://github.com/guiguisocute/easy-gpa-plus)，文档在 [guiguisocute/easy-gpa-plus-doc](https://github.com/guiguisocute/easy-gpa-plus-doc)。

## 准备环境

使用 Docker Compose 启动本地依赖，配置只写入被 Git 忽略的 `.env.development`：

```sh
cp .env.example .env.development
docker compose --env-file .env.development -f compose.dev.yaml up -d --build
# Windows：./scripts/dev.ps1 up
```

也可以只把依赖放进容器、在宿主上运行 Go 与 Vite，见 [Make 目标](/reference/commands#make-目标)。

## 提交前检查

| 范围 | 命令 |
| --- | --- |
| 前端（`frontend/`） | `npm ci`、`npm run lint`、`npm test`、`npm run build` |
| 后端（`backend/`） | `gofmt -l .`、`go test ./...`、`go vet ./...`、`go build ./...` |
| 集成 | `node e2e/run.mjs backend`，使用独立的本地测试数据库 |

交互改动请在真实浏览器中验证，包括窄屏与深色模式。更多层级见[测试与 E2E](/development/testing)。

## 约定

- 提交范围清晰，说明行为变化与验证结果。
- 使用锁文件和现有 Go 版本，不随任务升级依赖。
- 业务名词以[术语表](/reference/glossary)为准。学生实时查看成绩与单项进度；确认只是对当前版本的核对，不阻塞结算、不取消申诉权。不存在整表终审、整表问题或自动确认。
- 结算仍检查封存或截止、单项定分、待处理事项和专业成绩完整性；保持租户隔离和本人回避。
- 共治模式为测试版：保持中心化为默认；冻结选民、重大事项的全班保护门槛、随机评审与独立申诉不得被旧角色或 MCP 绕过。
- 界面文案面向学生和班委，不写实现细节和行话；`frontend/scripts/check-ui-copy.mjs` 会拦截一部分常见用词。

## 数据与隐私

- 示例只使用虚构数据和 `example.org` 域名。
- 不要在 Issue、日志或代码中放入个人名单、学号、密钥、运行数据或第三方学校素材。
- 截图请使用[演示站](https://easygpamock.guiguisocute.com)或本地虚构数据。

## 许可

项目以 [AGPL-3.0](https://github.com/guiguisocute/easy-gpa-plus/blob/main/LICENSE) 发布。提交贡献即表示你同意按该许可提供贡献。随附字体保留 SIL Open Font License 1.1，依赖保留各自的许可。
