---
layout: home
hero:
  name: EasyGPA Plus
  text: 让综合测评，更清楚，也更轻松
  tagline: 开源、自托管的班级综合测评平台：材料提交 · 独立审核 · 班级共治 · 实时成绩
  image:
    src: /logo.svg
    alt: EasyGPA Plus
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 在线体验
      link: https://easygpa-demo.guiguisocute.com
    - theme: alt
      text: 自托管部署
      link: /deploy/self-hosting
features:
  - title: 每一分都有来处
    details: 材料、认定、申诉与结算全程留痕。学生随时查看实时成绩和处理进度，核对当前版本即可。
    link: /guide/scores-settlement
    linkText: 实时成绩与结算
  - title: 两种班级治理
    details: 推荐使用班管负责的普通模式；也提供主动加入、投票决策与随机评审的班级共治（测试版）。
    link: /guide/governance
    linkText: 班级共治
  - title: 规则由方案决定
    details: 分类、基础分、扣分、计分规则与封顶顺序写在评分方案里，结算由后端确定性执行，模型不参与出分。
    link: /guide/scoring-scheme
    linkText: 评分方案
  - title: 连接你的 Agent
    details: 通过 MCP 读取资料、上传佐证、辅助审核与统计。权限由账号掌握，写操作可在网页批准。
    link: /guide/agent
    linkText: 连接 Agent
---

EasyGPA Plus 源自 EasyGPA，面向可复用的开源综合测评场景。React · TypeScript · Go · PostgreSQL · Redis · S3，以 [AGPL-3.0](https://github.com/guiguisocute/easy-gpa-plus/blob/main/LICENSE) 发布。

<div class="home-preview">
  <span class="preview-label">班级看板</span>
  <h2>离结算还差什么，一眼看清</h2>
  <p>结算闸门逐条列出未满足的条件和卡住的人数，审核进度与分数分布就在下方。图中为演示站虚构数据。</p>
  <img src="/images/class-board.png" alt="EasyGPA Plus 班级看板与结算闸门，使用演示站虚构数据" width="1440" height="900" />
</div>
