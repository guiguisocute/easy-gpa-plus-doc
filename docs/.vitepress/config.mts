import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'EasyGPA Plus',
  description: 'EasyGPA Plus：开源、自托管的班级综合测评平台。材料提交、独立审核、班级共治与实时成绩的使用、部署与开发文档。',
  cleanUrls: true,
  lastUpdated: true,
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],
  sitemap: { hostname: 'https://easygpa.guiguisocute.com' },
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '使用指南', link: '/guide/introduction', activeMatch: '/guide/' },
      { text: '部署运维', link: '/deploy/self-hosting', activeMatch: '/deploy/' },
      { text: '参考', link: '/reference/environment', activeMatch: '/reference/' },
      { text: '开发贡献', link: '/development/contributing', activeMatch: '/development/' },
      { text: '在线体验', link: 'https://easygpa-demo.guiguisocute.com' }
    ],
    sidebar: [
      { text: '使用指南', items: [
        { text: '认识 EasyGPA Plus', link: '/guide/introduction' },
        { text: '快速开始', link: '/guide/getting-started' },
        { text: '账号与登录', link: '/guide/accounts' },
        { text: '学生：提交与申诉', link: '/guide/student' },
        { text: '综测小组：审核', link: '/guide/reviewer' },
        { text: '班级管理员', link: '/guide/class-admin' },
        { text: '评分方案', link: '/guide/scoring-scheme' },
        { text: '实时成绩与结算', link: '/guide/scores-settlement' },
        { text: '班级共治（测试版）', link: '/guide/governance' },
        { text: '连接 Agent（MCP）', link: '/guide/agent' },
        { text: '常见问题', link: '/guide/faq' }
      ] },
      { text: '部署运维', items: [
        { text: '自托管部署', link: '/deploy/self-hosting' },
        { text: '平台运维台', link: '/deploy/operations' },
        { text: '邮件通知', link: '/deploy/mail' },
        { text: 'AI 与班级知识库', link: '/deploy/ai' },
        { text: '备份与恢复', link: '/deploy/backup' },
        { text: '按组件发布与升级', link: '/deploy/releases' }
      ] },
      { text: '参考', items: [
        { text: '环境变量', link: '/reference/environment' },
        { text: '命令与服务', link: '/reference/commands' },
        { text: '术语表', link: '/reference/glossary' }
      ] },
      { text: '开发贡献', items: [
        { text: '参与开发', link: '/development/contributing' },
        { text: '架构', link: '/development/architecture' },
        { text: '测试与 E2E', link: '/development/testing' },
        { text: '演示站', link: '/development/demo' },
        { text: '文档站维护', link: '/development/documentation' }
      ] }
    ],
    search: { provider: 'local', options: { locales: { root: { translations: {
      button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
      modal: { noResultsText: '未找到相关内容', resetButtonTitle: '清除搜索',
        footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' } }
    } } } } },
    socialLinks: [{ icon: 'github', link: 'https://github.com/guiguisocute/easy-gpa-plus' }],
    editLink: { pattern: 'https://github.com/guiguisocute/easy-gpa-plus-doc/edit/main/docs/:path', text: '编辑此页' },
    outline: { label: '本页内容', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最后更新' },
    darkModeSwitchLabel: '外观', lightModeSwitchTitle: '切换到浅色模式', darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '目录', returnToTopLabel: '返回顶部',
    footer: { message: '文档对应主仓库 main 分支，界面与行为以所部署版本为准。', copyright: 'EasyGPA Plus · AGPL-3.0' }
  }
})
