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

React · TypeScript · Go · PostgreSQL · Redis · S3，本项目遵循 [AGPL-3.0](https://github.com/guiguisocute/easy-gpa-plus/blob/main/LICENSE) 协议。

<div class="home-preview">
  <span class="preview-label">告别表格来回传</span>
  <h2>整理、审核、汇总，各做各的那一份</h2>
  <p>传统综测里，学生自己翻找证书和截图、对照细则估分、填好表格发给综测小组；小组逐份核对，拿不准就在群里问；班管再把几十份表格汇总起来手算排名。任何一步出错，都很难说清错在哪里。EasyGPA Plus 把这条链路放进同一个平台，每个角色只处理轮到自己的那部分。</p>
  <div class="role-grid">
    <div>
      <h3>学生</h3>
      <p class="role-before">以前：翻聊天记录找材料，对着细则自己算分，表格发出去之后只能等消息。</p>
    </div>
    <div>
      <h3>综测小组</h3>
      <p class="role-before">以前：收一堆表格和压缩包逐份核对，谁审了哪条、为什么这样判，全凭记忆。</p>
    </div>
    <div>
      <h3>班级管理员</h3>
      <p class="role-before">以前：催交、汇总、手算排名和奖学金名额，改一处就要重新核一遍。</p>
    </div>
  </div>
</div>

<div class="home-preview">
  <span class="preview-label">学生</span>
  <h2>对学生：自己的分看得清，全班的分也摆在明处</h2>
  <p>表单按本班方案生成，能报什么、要什么佐证、预计多少分，填写时就知道；班级开启 AI 后，上传图片或 PDF 就能整理出申报草稿。每条材料走到哪一步、每一分从哪里来，都能在「我的成绩表」实时查看。审核人的身份对学生隐藏，有异议直接在原记录上申诉，不必顾虑人情。</p>
  <p>举报台上，全班每个人的基础分、已定分和扣分都公开可查，班管也不例外；公示期间还能预览、下载已公开的佐证原件。发现不实申报可以匿名举报：班管、审核人和同学都查不到是谁提的，审计日志也不记录举报人。举报由两名审核人分头复核，只能主张把分改低，不是加分的通道。</p>
  <img src="/images/student-report.png" alt="学生在举报台查看同学的公开计分，使用演示站虚构数据" width="1440" height="900" />
  <p class="preview-caption">图中为演示站虚构数据：学生在举报台查看同学的计分。</p>
</div>

<div class="home-preview">
  <span class="preview-label">综测小组</span>
  <h2>对综测小组：只审分给自己的，判得有据也判得安心</h2>
  <p>不用再收表格、解压缩包。系统按工作量均衡地把每条材料派给两名成员，待办任务里只有分给自己的那几条。初审工作台把佐证原件、学生填报、期望分和规则允许的分数区间放在一起，通过、调整或驳回一步完成。</p>
  <p>两人背靠背独立判断，交齐之前互相看不到结论；一致即定分，冲突交班管仲裁，不必私下商量。学生看不到是谁审的，按规则判就好。每次查看佐证、每条结论都记入审计，学生申诉时由原来的两人复评，判了什么、为什么这样判都有据可查。</p>
  <img src="/images/review-desk.png" alt="综测小组的初审工作台，左侧为佐证与学生填报，右侧为期望分与审核结论，使用演示站虚构数据" width="1440" height="900" />
  <p class="preview-caption">图中为演示站虚构数据：综测小组成员的初审工作台。</p>
</div>

<div class="home-preview">
  <span class="preview-label">班级管理员</span>
  <h2>对班管：离结算还差什么，一眼看清</h2>
  <p>在方案编辑器里定好分类和计分规则，学生表单、审核区间和结算都以同一份方案为准；名单用 CSV 一次导入，审核任务试算后即可分发。班级看板的结算闸门把「能否结算」拆成五个条件，逐条列出卡在哪、卡住多少人，还能直接提醒未封存的同学。</p>
  <p>冲突、申诉和异议集中到仲裁台处理，本人相关的事项交副班管。结算一次算出排名、奖学金档和三好，导出汇总表、逐人明细和学院格式报表；谁看了什么、谁改了什么，审计日志都记得。</p>
  <img src="/images/class-board.png" alt="EasyGPA Plus 班级看板与结算闸门，使用演示站虚构数据" width="1440" height="900" />
  <p class="preview-caption">图中为演示站虚构数据。想亲手点一遍，可以打开<a href="https://easygpa-demo.guiguisocute.com" target="_blank" rel="noreferrer">在线体验</a>。</p>
</div>
