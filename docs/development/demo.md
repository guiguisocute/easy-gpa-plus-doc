# 演示站

[演示站](https://easygpa-demo.guiguisocute.com)复用前端的真实页面，把 API 换成浏览器内的虚构后端（`mock/src/handle.ts`）。所有数据都是虚构班级，交互只保存在当前浏览器，不连接后端，也不发送邮件。

## 本地运行

```sh
cd frontend
npm ci
npm run mock          # http://localhost:4173
npm run mock:build    # 输出到 mock/dist，并附带演示站对应源码
```

演示站首次进入默认普通模式并停在登录页，点演示浮层中的账号即可登录；顶部常驻模式切换入口，可改为体验共治模式（测试版）。普通模式下可以切换演示身份，共治模式（测试版）展示预置的招募结果、票数与评审，并可推进本机演示时钟。刷新和重新登录会保留所选模式，切换到另一种模式会重新载入该模式的示例数据。

正式部署中不存在演示专用的接口。

## 官方演示站

`easygpa-demo.guiguisocute.com` 由 Cloudflare Pages 项目 `easy-gpa-plus-demo` 从主仓库 `main` 分支自动构建：

| 设置 | 值 |
| --- | --- |
| 构建命令 | `cd frontend && npm ci && npm run mock:build` |
| 输出目录 | `mock/dist` |
| Node.js | `24` |
| 监视路径 | `frontend/*`、`mock/*`、`examples/*`、`scripts/*` 与根目录的许可和说明文件 |

只改后端的提交不会触发演示站构建。

## 部署自己的演示站

也可以用 Wrangler 直接上传到自己的 Pages 项目。项目名和凭据都通过环境变量提供，不写入代码：

```sh
export MOCK_PAGES_PROJECT=your-pages-project
export CLOUDFLARE_ACCOUNT_ID=...
export CLOUDFLARE_API_TOKEN=...
npm run mock:deploy
```

`mock:deploy` 先构建演示站，再用 Wrangler 以 `main` 分支部署 `mock/dist`。
