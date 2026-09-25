<p align="center">
  <a href="https://easygpa.guiguisocute.com/"><img src="docs/public/logo.svg" width="96" height="96" alt="EasyGPA Plus Logo"></a>
</p>

<h1 align="center">EasyGPA Plus 文档</h1>

<p align="center">
  <a href="https://easygpa.guiguisocute.com/"><strong>访问文档站</strong></a> ·
  <a href="https://github.com/guiguisocute/easy-gpa-plus">主仓库</a> ·
  <a href="https://easygpamock.guiguisocute.com">在线体验</a>
</p>

EasyGPA Plus 的使用指南、部署运维、配置参考与开发文档，基于 VitePress。需要 Node.js 22 或更新版本。

```sh
npm ci
npm run docs:dev
```

发布前执行：

```sh
npm test
npm run docs:build
npm run test:contract -- /path/to/easy-gpa-plus
```

`test:contract` 检查[环境变量](docs/reference/environment.md)与[命令与服务](docs/reference/commands.md)覆盖了主仓库 `.env.example`、`config.go` 与 `zongce` 子命令，且没有记录已删除的变量。CI 会检出主仓库 `main` 分支运行它。

站点部署在 Cloudflare Pages，输出目录 `docs/.vitepress/dist`，域名 `easygpa.guiguisocute.com`。维护约定见[文档站维护](docs/development/documentation.md)。

截图只使用演示站或本地虚构数据。文档内容以 [AGPL-3.0](LICENSE) 发布，与主仓库一致。
