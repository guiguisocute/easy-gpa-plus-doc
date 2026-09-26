<script setup lang="ts">
import { ref } from 'vue'

const selectedRole = ref(0)
const roles = [
  {
    id: 'student', name: '我是学生', label: '每一分，看得见来处',
    title: '交完材料，不必再等一句「审完了」。',
    description: '按本班方案填报，带上佐证。打开「我的成绩表」，随时看当前成绩与每一项的处理进度；有疑问，就从原记录提出申诉。',
    points: ['表单随评分方案生成，填报有依据', '公开计分可查，公示期可看公开佐证', '核对当前版本，不影响后续申诉'],
    image: '/images/student-report.png', imageLabel: '举报台 · 查看班级公开计分',
    alt: '演示班学生在举报台查看同学的公开计分和材料，数据均为虚构',
    href: '/guide/student', link: '看看学生怎么用',
  },
  {
    id: 'reviewer', name: '我是综测小组', label: '每一次判断，都有依据',
    title: '材料在手边，规则在眼前。',
    description: '系统把材料派给两名成员。佐证原件、学生填报、期望分与规则档位放在同一个工作台，专注处理分给自己的任务。',
    points: ['两人背靠背审核，交齐前互不见结论', '结论一致即定分，冲突进入仲裁', '查看与认定留痕，复核有据可查'],
    image: '/images/review-desk.png', imageLabel: '初审工作台 · 佐证与认定分',
    alt: '演示班初审工作台将佐证原件、申报信息与审核操作并排展示，数据均为虚构',
    href: '/guide/reviewer', link: '了解审核流程',
  },
  {
    id: 'admin', name: '我是班级管理员', label: '每一项待办，都有着落',
    title: '离结算还差什么，一眼看清。',
    description: '从名单、方案到派单与争议处理，在一个地方推进。结算闸门逐项列出尚未满足的条件，处理完成后再生成正式成绩与报表。',
    points: ['封存、定分、待办、专业分逐项检查', '本人相关事项回避，由副班管处理', '结算后导出汇总、明细和学院报表'],
    image: '/images/class-board.png', imageLabel: '班级看板 · 结算闸门与待办',
    alt: '演示班管理员在班级看板查看统计、待办与结算闸门，数据均为虚构',
    href: '/guide/class-admin', link: '查看班管指南',
  },
]

function moveTab(event: KeyboardEvent, index: number) {
  let next: number
  if (event.key === 'ArrowRight') next = (index + 1) % roles.length
  else if (event.key === 'ArrowLeft') next = (index + roles.length - 1) % roles.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = roles.length - 1
  else return
  event.preventDefault()
  selectedRole.value = next
  const tabs = (event.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
  tabs?.[next]?.focus()
}
</script>

<template>
  <div class="home-story">
    <section class="story-section journey" aria-labelledby="journey-title">
      <div class="section-heading opening-heading">
        <div>
          <p class="eyebrow"><span class="eyebrow-dot" aria-hidden="true"></span>告别表格来回传</p>
          <h2 id="journey-title">少一点「发我最新版」，<br />多一点有据可查。</h2>
        </div>
        <p class="section-intro">材料散在聊天里，进度藏在表格里？<br class="desktop-break" />把提交、审核、成绩和导出连在一起，<br class="desktop-break" />让每个人都知道，事情走到了哪一步。</p>
      </div>
      <ol class="journey-track" aria-label="普通模式下，从材料提交到结算导出的流程">
        <li>
          <span class="step-number" aria-hidden="true">01</span>
          <h3>带着依据提交</h3>
          <p>按本班规则填报，<br />材料与佐证一起到位。</p>
          <span class="step-detail">学生 · 材料申报</span>
        </li>
        <li>
          <span class="step-number" aria-hidden="true">02</span>
          <h3>交给独立判断</h3>
          <p>两人背靠背审核，<br />有分歧进入仲裁。</p>
          <span class="step-detail">小组 · 单项认定</span>
        </li>
        <li>
          <span class="step-number" aria-hidden="true">03</span>
          <h3>进度实时可见</h3>
          <p>每一分的来源，<br />每一项的问题，随时查看。</p>
          <span class="step-detail">学生 · 成绩与申诉</span>
        </li>
        <li>
          <span class="step-number" aria-hidden="true">04</span>
          <h3>有条理地收尾</h3>
          <p>逐项检查结算条件，<br />生成排名与所需报表。</p>
          <span class="step-detail">班管 · 结算导出</span>
        </li>
      </ol>
      <p class="journey-footnote"><span aria-hidden="true">↳</span> 学生确认只记录对当前成绩的核对，不阻塞结算，也不取消申诉权。</p>
    </section>

    <section class="story-section workspace" aria-labelledby="workspace-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">各自有工作台，一起把事情做好</p>
          <h2 id="workspace-title">换个身份，看见自己的那一部分。</h2>
        </div>
        <span class="section-aside">普通模式 · 真实界面</span>
      </div>
      <div class="role-tabs" role="tablist" aria-label="选择要了解的角色">
        <button
          v-for="(role, index) in roles" :id="`role-tab-${role.id}`" :key="role.id"
          type="button" role="tab" :aria-selected="selectedRole === index"
          :aria-controls="`role-panel-${role.id}`" :tabindex="selectedRole === index ? 0 : -1"
          @click="selectedRole = index" @keydown="moveTab($event, index)"
        ><span class="tab-index" aria-hidden="true">0{{ index + 1 }}</span>{{ role.name }}<span class="tab-arrow" aria-hidden="true">↗</span></button>
      </div>
      <div
        v-for="(role, index) in roles" v-show="selectedRole === index"
        :id="`role-panel-${role.id}`" :key="role.id" class="role-panel"
        role="tabpanel" :aria-labelledby="`role-tab-${role.id}`" tabindex="0"
      >
        <div class="role-copy">
          <div>
            <p class="role-label">{{ role.label }}</p>
            <h3>{{ role.title }}</h3>
            <p class="role-description">{{ role.description }}</p>
            <a class="text-link" :href="role.href">{{ role.link }}<span aria-hidden="true"> →</span></a>
          </div>
          <ul class="role-points"><li v-for="point in role.points" :key="point"><span aria-hidden="true">✓</span>{{ point }}</li></ul>
        </div>
        <figure class="product-preview">
          <div class="preview-toolbar"><span class="window-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>{{ role.imageLabel }}</span><span class="preview-tag">DEMO</span></div>
          <a class="preview-image-link" :href="role.image" target="_blank" rel="noopener noreferrer" :aria-label="`${role.imageLabel}，在新标签页查看原图`">
            <img :src="role.image" :alt="role.alt" width="2880" height="1800" loading="lazy" decoding="async" />
          </a>
          <figcaption>演示站虚构数据<span>点击界面可查看原图 <span aria-hidden="true">↗</span></span></figcaption>
        </figure>
      </div>
    </section>

    <section class="story-section principles" aria-labelledby="principles-title">
      <div class="principles-heading">
        <p class="eyebrow">把清楚写进流程</p>
        <h2 id="principles-title">分数背后，<br />是规则，是依据。</h2>
        <p>从怎么填，到怎么判，再到怎么算，<br class="desktop-break" />围绕同一份评分方案展开。</p>
        <a class="text-link" href="/guide/scoring-scheme">了解评分方案<span aria-hidden="true"> →</span></a>
      </div>
      <div class="principle-list">
        <div><span class="principle-index" aria-hidden="true">01 /</span><div><h3>规则先说清</h3><p>分类、基础分、扣分和封顶顺序写进方案。正式成绩由后端按规则计算，模型不参与出分。</p></div></div>
        <div><span class="principle-index" aria-hidden="true">02 /</span><div><h3>判断有边界</h3><p>审核人独立提交意见，本人相关事项回避。学生能看到单项处理进度，并保留申诉入口。</p></div></div>
        <div><span class="principle-index" aria-hidden="true">03 /</span><div><h3>过程能回看</h3><p>佐证查看、审核结论和关键变更记入审计。需要复核时，沿着记录找到依据。</p></div></div>
      </div>
    </section>

    <aside class="agent-note" aria-label="Agent 辅助能力">
      <span class="agent-mark" aria-hidden="true">✳</span>
      <div><strong>整理材料，也可以有个帮手。</strong><p>按账号权限连接 Agent，辅助查规则、整理申报与统计；正式操作仍受业务规则和授权约束。</p></div>
      <a class="text-link" href="/guide/agent">连接 Agent<span aria-hidden="true"> ↗</span></a>
    </aside>

    <section class="story-section modes" aria-labelledby="modes-title">
      <div class="section-heading">
        <div><p class="eyebrow">按班级的协作方式开始</p><h2 id="modes-title">分工明确，或一起探索。</h2></div>
        <p class="section-intro">首次配置时选择。<br />正式计分，推荐普通模式。</p>
      </div>
      <div class="mode-layout">
        <article class="mode-primary">
          <span class="mode-badge recommended">推荐使用</span>
          <h3>普通模式</h3>
          <p>班管统筹，系统按材料随机派单，小组成员独立审核。延续熟悉的分工，把零散的协作接起来。</p>
          <div class="mode-flow" aria-label="学生提交材料后由两名小组成员审核，冲突交班管仲裁">
            <span>学生提交</span><span class="flow-arrow" aria-hidden="true">→</span>
            <span class="review-pair"><span>审核人 A</span><span>审核人 B</span></span>
            <span class="flow-arrow" aria-hidden="true">→</span><span>一致定分<br /><small>冲突交班管</small></span>
          </div>
          <a class="text-link" href="/guide/getting-started">从普通模式开始<span aria-hidden="true"> →</span></a>
        </article>
        <article class="mode-experimental">
          <span class="mode-badge beta">可选 · 测试版</span>
          <h3>班级共治</h3>
          <p>共同事项由成员表决，个人案件交随机评审，并设置独立申诉。注册成员自愿加入，满 24 小时后参与新提案。</p>
          <p class="beta-note">尚未经过生产验证。先在演示站了解参与门槛与完整流程，再评估是否适合本班。</p>
          <a class="text-link" href="/guide/governance">了解共治规则与边界<span aria-hidden="true"> →</span></a>
        </article>
      </div>
    </section>

    <section class="story-section get-started" aria-labelledby="get-started-title">
      <div class="start-copy">
        <p class="eyebrow">先体验，再带回自己的班级</p>
        <h2 id="get-started-title">下一次综测，<br />从清楚开始。</h2>
        <p>用演示数据走一遍提交、审核与结算。<br />准备好后，在自己的服务器上部署，按本班细则配置。</p>
        <div class="start-actions">
          <a class="story-button primary" href="https://easygpa-demo.guiguisocute.com" target="_blank" rel="noopener noreferrer">打开在线体验<span aria-hidden="true"> ↗</span><span class="sr-only">（在新标签页打开）</span></a>
          <a class="story-button secondary" href="/deploy/self-hosting">查看部署指南<span aria-hidden="true"> →</span></a>
        </div>
      </div>
      <div class="open-source-note">
        <span class="source-symbol" aria-hidden="true">&lt;/&gt;</span>
        <h3>代码开放，自己部署。</h3>
        <p>源码、使用指南与部署文档公开。<br />可以查看实现，也欢迎一起改进。</p>
        <div class="source-tags"><span>开源</span><span>自托管</span><span>AGPL-3.0</span></div>
        <a class="text-link" href="https://github.com/guiguisocute/easy-gpa-plus" target="_blank" rel="noopener noreferrer">在 GitHub 查看源码<span aria-hidden="true"> ↗</span><span class="sr-only">（在新标签页打开）</span></a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-story {
  --story-surface: var(--vp-c-bg-soft);
  --story-warm: var(--vp-c-brand-soft);
  --story-line: var(--vp-c-divider);
  --story-ink: var(--vp-c-text-1);
  --story-muted: var(--vp-c-text-2);
  --story-accent: var(--vp-c-brand-1);
  margin: 84px 0 0;
  color: var(--story-ink);
}
.home-story :is(h2, h3, p, ol, ul, figure) { margin: 0; }
.home-story :is(h2, h3) { border: 0; padding: 0; letter-spacing: -.035em; }
.home-story h2 { font-size: clamp(26px, 3.05vw, 40px); line-height: 1.4; font-weight: 750; }
.home-story h3 { font-size: 20px; line-height: 1.5; font-weight: 650; }
.home-story p { font-size: 15px; line-height: 1.9; }
.home-story a { text-decoration: none; }
.home-story a:focus-visible, .home-story button:focus-visible, .role-panel:focus-visible { outline: 3px solid var(--story-accent); outline-offset: 5px; }
.home-story .story-section + .story-section { margin-top: 104px; }
.section-heading { display: flex; justify-content: space-between; align-items: flex-end; gap: 36px; margin-bottom: 34px; }
.home-story .eyebrow { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; color: var(--story-accent); font-size: 12px; line-height: 1.6; font-weight: 650; letter-spacing: .08em; }
.eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.home-story .section-intro { flex-shrink: 0; padding-bottom: 4px; color: var(--story-muted); font-size: 14px; }
.section-aside { flex-shrink: 0; padding-bottom: 5px; font-size: 12px; color: var(--story-muted); }
.home-story .journey-track { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0; list-style: none; padding: 34px 30px; border: 1px solid var(--story-line); border-radius: 20px; background: var(--story-surface); }
.journey-track li { position: relative; margin: 0; padding: 0 24px; }
.journey-track li:first-child { padding-left: 0; }
.journey-track li:last-child { padding-right: 0; }
.journey-track li + li { border-left: 1px solid var(--story-line); }
.step-number { display: block; margin-bottom: 22px; color: var(--story-accent); font-family: var(--vp-font-family-mono); font-size: 13px; font-weight: 600; }
.home-story .journey-track h3 { margin-bottom: 10px; font-size: 18px; }
.home-story .journey-track p { color: var(--story-muted); font-size: 13px; }
.step-detail { display: inline-block; margin-top: 24px; color: var(--story-muted); font-size: 11px; }
.home-story .journey-footnote { margin-top: 16px; color: var(--story-muted); font-size: 12px; }
.journey-footnote > span { margin-right: 8px; color: var(--story-accent); }
.role-tabs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-bottom: 1px solid var(--story-line); }
.role-tabs button { display: flex; gap: 14px; align-items: center; justify-content: flex-start; min-height: 60px; padding: 16px 22px; border-bottom: 3px solid transparent; color: var(--story-muted); font-size: 15px; font-weight: 600; text-align: left; cursor: pointer; transition: color .15s, background .15s; }
.role-tabs button:hover { color: var(--story-accent); background: var(--story-surface); }
.role-tabs button[aria-selected="true"] { color: var(--story-accent); border-bottom-color: var(--story-accent); background: var(--story-warm); }
.tab-index { font-family: var(--vp-font-family-mono); font-size: 11px; opacity: .8; }
.tab-arrow { margin-left: auto; font-size: 18px; }
.role-copy { display: grid; grid-template-columns: 1.4fr 1fr; gap: 60px; align-items: center; padding: 34px 0 30px; }
.home-story .role-label { margin-bottom: 8px; color: var(--story-muted); font-size: 12px; }
.home-story .role-copy h3 { margin-bottom: 12px; font-size: 25px; }
.home-story .role-description { margin-bottom: 12px; color: var(--story-muted); font-size: 14px; }
.home-story .text-link { display: inline-block; color: var(--story-accent); font-size: 13px; font-weight: 600; }
.home-story .text-link:hover { text-decoration: underline; text-underline-offset: 5px; }
.home-story .role-points { display: grid; gap: 14px; padding: 0; list-style: none; }
.role-points li { display: flex; align-items: baseline; gap: 12px; margin: 0; font-size: 13px; }
.role-points li span { color: var(--story-accent); }
.product-preview { overflow: hidden; border: 1px solid var(--story-line); border-radius: 14px; background: var(--story-surface); box-shadow: 0 14px 42px #16162008; }
.preview-toolbar { display: flex; align-items: center; gap: 20px; min-height: 44px; padding: 10px 18px; color: var(--story-muted); font-size: 11px; }
.window-dots { display: flex; gap: 5px; }
.window-dots i { width: 6px; height: 6px; border-radius: 50%; background: var(--story-muted); opacity: .35; }
.preview-tag { margin-left: auto; font-size: 9px; letter-spacing: .1em; }
.preview-image-link { display: block; margin: 0 12px; overflow: hidden; border: 1px solid var(--story-line); border-radius: 5px; background: #fff; }
.home-story .product-preview img { display: block; width: 100%; height: auto; border: 0; border-radius: 0; }
.product-preview figcaption { display: flex; justify-content: space-between; gap: 12px; padding: 12px 18px; color: var(--story-muted); font-size: 11px; }
.principles { display: grid; grid-template-columns: 1fr 1.15fr; gap: 70px; padding: 48px 0 16px; border-top: 1px solid var(--story-line); }
.home-story .principles h2 { font-size: 36px; }
.home-story .principles-heading > p:not(.eyebrow) { margin: 20px 0; color: var(--story-muted); font-size: 14px; }
.principle-list > div { display: flex; gap: 22px; padding: 22px 0; }
.principle-list > div:first-child { padding-top: 0; }
.principle-list > div:last-child { padding-bottom: 0; }
.principle-list > div + div { border-top: 1px solid var(--story-line); }
.principle-index { flex-shrink: 0; padding-top: 3px; color: var(--story-accent); font-family: var(--vp-font-family-mono); font-size: 11px; }
.home-story .principle-list h3 { margin-bottom: 8px; font-size: 17px; }
.home-story .principle-list p { color: var(--story-muted); font-size: 13px; }
.agent-note { display: flex; align-items: center; gap: 20px; padding: 25px 0; margin-top: 8px; border-bottom: 1px solid var(--story-line); }
.agent-mark { color: var(--story-accent); font-size: 30px; }
.agent-note strong { font-size: 14px; font-weight: 600; }
.home-story .agent-note p { color: var(--story-muted); font-size: 12px; }
.agent-note .text-link { flex-shrink: 0; margin-left: auto; }
.home-story .modes { margin-top: 96px; }
.mode-layout { display: grid; grid-template-columns: 1.15fr 1fr; border: 1px solid var(--story-line); border-radius: 18px; overflow: hidden; }
.mode-layout article { display: flex; align-items: flex-start; flex-direction: column; padding: 32px; }
.mode-primary { background: var(--story-warm); }
.mode-experimental { border-left: 1px solid var(--story-line); }
.mode-badge { display: inline-flex; margin-bottom: 18px; padding: 3px 9px; border: 1px solid var(--story-line); border-radius: 5px; font-size: 10px; line-height: 1.7; font-weight: 600; }
.recommended { color: var(--story-accent); background: var(--vp-c-bg); }
.beta { color: var(--story-muted); background: var(--story-surface); }
.home-story .mode-layout h3 { margin-bottom: 12px; font-size: 24px; }
.home-story .mode-layout p { color: var(--story-muted); font-size: 13px; }
.mode-flow { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; padding: 24px 0; color: var(--story-ink); font-size: 12px; text-align: center; }
.mode-flow > span:not(.flow-arrow):not(.review-pair), .review-pair span { padding: 8px 10px; border: 1px solid var(--story-line); border-radius: 6px; background: var(--vp-c-bg); }
.review-pair { display: grid; gap: 5px; }
.flow-arrow { color: var(--story-accent); }
.mode-flow small { color: var(--story-muted); font-size: 10px; }
.home-story .beta-note { margin: 24px 0; padding-left: 12px; border-left: 2px solid var(--story-line); font-size: 12px; }
.mode-layout .text-link { margin-top: auto; }
.get-started { display: grid; grid-template-columns: 1.3fr 1fr; gap: 64px; align-items: center; padding: 48px; border: 1px solid var(--story-line); border-radius: 20px; background: var(--story-surface); }
.home-story .get-started h2 { font-size: 40px; }
.home-story .start-copy > p:not(.eyebrow) { margin: 20px 0 24px; color: var(--story-muted); font-size: 13px; }
.start-actions { display: flex; gap: 10px; flex-wrap: wrap; }
.home-story .story-button { display: inline-flex; justify-content: center; gap: 14px; align-items: center; min-height: 43px; padding: 10px 16px; border: 1px solid transparent; border-radius: 7px; font-size: 12px; font-weight: 600; transition: background .15s; }
.home-story .story-button.primary { background: #d6001c; color: #fff; }
.home-story .story-button.primary:hover { background: #b80018; }
.home-story .story-button.secondary { border-color: var(--story-line); background: var(--vp-c-bg); color: var(--story-ink); }
.home-story .story-button.secondary:hover { background: var(--story-warm); }
.open-source-note { padding-left: 40px; border-left: 1px solid var(--story-line); }
.source-symbol { display: block; margin-bottom: 16px; color: var(--story-accent); font-family: var(--vp-font-family-mono); font-size: 28px; }
.home-story .open-source-note h3 { margin-bottom: 12px; font-size: 22px; }
.home-story .open-source-note p { color: var(--story-muted); font-size: 13px; }
.source-tags { display: flex; gap: 7px; flex-wrap: wrap; margin: 20px 0; }
.source-tags span { padding: 3px 9px; border: 1px solid var(--story-line); border-radius: 4px; color: var(--story-muted); font-size: 10px; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
@media (max-width: 959px) {
  .section-heading { gap: 24px; align-items: flex-start; flex-direction: column; }
  .desktop-break { display: none; }
  .journey-track li { padding: 0 16px; }
  .home-story .journey-track h3 { font-size: 16px; }
  .home-story .journey-track p { font-size: 12px; }
  .role-copy { grid-template-columns: 1.2fr 1fr; gap: 32px; }
  .home-story .role-copy h3 { font-size: 22px; }
  .principles { gap: 32px; padding: 32px 0 8px; }
  .home-story .principles h2 { font-size: 30px; }
  .mode-layout article { padding: 26px; }
  .mode-flow { gap: 5px; font-size: 11px; }
  .mode-flow > span:not(.flow-arrow):not(.review-pair), .review-pair span { padding: 7px; }
  .get-started { gap: 32px; padding: 32px; }
  .open-source-note { padding-left: 28px; }
}
@media (max-width: 639px) {
  .home-story { margin-top: 56px; }
  .home-story .story-section + .story-section, .home-story .modes { margin-top: 64px; }
  .section-heading { gap: 14px; margin-bottom: 24px; }
  .home-story h2 { font-size: 27px; }
  .home-story .section-intro { font-size: 13px; }
  .home-story .journey-track { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 26px 20px; padding: 24px; border-radius: 14px; }
  .journey-track li { padding: 0; }
  .journey-track li + li { border-left: 0; }
  .journey-track li:nth-child(n + 3) { padding-top: 22px; border-top: 1px solid var(--story-line); }
  .step-number { margin-bottom: 12px; }
  .step-detail { margin-top: 14px; font-size: 10px; }
  .home-story .journey-footnote { font-size: 11px; }
  .role-tabs button { gap: 5px; min-height: 55px; justify-content: center; padding: 10px 3px; font-size: 12px; }
  .tab-index, .tab-arrow { display: none; }
  .role-copy { grid-template-columns: 1fr; gap: 22px; padding: 26px 0; }
  .home-story .role-copy h3 { font-size: 22px; }
  .home-story .role-points { gap: 8px; }
  .role-points li { font-size: 12px; }
  .preview-toolbar { gap: 8px; padding: 8px 10px; min-height: 36px; font-size: 9px; }
  .preview-tag { font-size: 8px; }
  .window-dots { display: none; }
  .preview-image-link { margin: 0 6px; }
  .product-preview figcaption { padding: 10px; font-size: 9px; }
  .principles { grid-template-columns: 1fr; gap: 30px; padding: 28px 0 8px; }
  .principle-list > div { gap: 16px; }
  .agent-note { flex-wrap: wrap; gap: 12px; padding: 22px 4px; }
  .agent-note > div { flex: 1; }
  .agent-note .text-link { margin-left: 35px; }
  .mode-layout { grid-template-columns: 1fr; border-radius: 14px; }
  .mode-layout article { padding: 26px 24px; }
  .mode-experimental { border-left: 0; border-top: 1px solid var(--story-line); }
  .mode-flow { max-width: 360px; gap: 8px; font-size: 12px; }
  .get-started { grid-template-columns: 1fr; gap: 32px; padding: 28px 24px; border-radius: 14px; }
  .home-story .get-started h2 { font-size: 36px; }
  .open-source-note { padding: 28px 0 0; border-left: 0; border-top: 1px solid var(--story-line); }
  .source-symbol { font-size: 24px; }
  .home-story .story-button { padding: 9px 12px; font-size: 11px; }
}
@media (prefers-reduced-motion: reduce) {
  .role-tabs button, .home-story .story-button { transition: none; }
}
</style>
