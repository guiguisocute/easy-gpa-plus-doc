# 文档站维护

文档源代码位于 [guiguisocute/easy-gpa-plus-doc](https://github.com/guiguisocute/easy-gpa-plus-doc)，使用 [VitePress](https://vitepress.dev/) 和 Cloudflare Pages。主仓库 README 只保留最简入口，使用、部署与开发说明都在本站维护。

## 本地编辑

使用 Node.js 22 或更新版本，先安装锁定依赖：

```sh
npm ci
npm run docs:dev
```

Markdown 位于 `docs/`。栏目导航配置在 `docs/.vitepress/config.mts`，主题样式在 `docs/.vitepress/theme/`，图片放入 `docs/public/images/`。站内链接使用 `/guide/student` 形式，代码链接指向主仓库。

```sh
npm test
npm run docs:build
npm run docs:preview
```

构建会检查站内死链，不要通过关闭死链检查来掩盖问题。提交前检查窄屏、深浅色、搜索结果和目录链接。截图只使用演示站或本地虚构数据，不得包含真实姓名、学号、凭据或会话信息。

当前锁定 VitePress 1.6.4，并通过 npm overrides 使用 Vite 6.4.3。升级后同时检查构建、预览、搜索和依赖审计。

## 与主仓库的契约

[环境变量](/reference/environment)与[命令与服务](/reference/commands)必须覆盖主仓库的实际配置。`test:contract` 读取主仓库的 `.env.example`、`backend/internal/config/config.go` 与 `backend/cmd/zongce/main.go`，检查每个变量和子命令都已记录，且文档中没有已删除的变量：

```sh
npm run test:contract -- /path/to/easy-gpa-plus
```

CI 会检出主仓库 `main` 分支运行这项检查。主仓库新增或删除环境变量、子命令时，请同时更新文档。

## Cloudflare Pages

| 设置 | 值 |
| --- | --- |
| 项目 | `easy-gpa-plus-doc` |
| 文档域名 | `https://easygpa.guiguisocute.com/` |
| 生产分支 | `main` |
| 构建命令 | `npm run docs:build` |
| 输出目录 | `docs/.vitepress/dist` |
| Node.js | `22` |

自定义域名在 Pages 项目中绑定，DNS 使用指向 `easy-gpa-plus-doc.pages.dev` 的 CNAME；站点地图和对外文档链接统一使用 `https://easygpa.guiguisocute.com/`。Pages API 令牌不存入仓库。

## 更新约定

- 使用指南描述用户操作；配置字段和实现约束放在部署、参考或开发栏目。
- 按源代码核对行为，不写尚未实现的计划。
- 角色、流程与模式使用[术语表](/reference/glossary)中的名称。
- 共治模式在转为正式功能前，相关页面保留测试版提示。
