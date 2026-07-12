import {
  caseStudySections,
  executionTimeline,
  interviewScripts,
  portfolioAttachments,
  portfolioSummary,
  portfolioVisuals,
  resumeBullets,
  wireframeOptions,
} from '../data/portfolio'

interface PortfolioCasePageProps {
  onNavigateDemo?: () => void
  onNavigateAdmin?: () => void
  onNavigateReviews?: () => void
}

export function PortfolioCasePage({
  onNavigateDemo,
  onNavigateAdmin,
  onNavigateReviews,
}: PortfolioCasePageProps) {
  const recommendedWireframe = wireframeOptions.find((option) => option.recommended) ?? wireframeOptions[0]

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] bg-stone-950 p-8 text-white sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-300">
          Cross-border operations assistant portfolio
        </p>
        <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
          多平台运营助理作品集
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-300">
          {portfolioSummary.positioning}，面向{portfolioSummary.targetRole}岗位，展示 Listing 上架、
          日报周报、评论处理与数据整理等日常运营交付能力。所有业务数据均为模拟练习项目。
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {portfolioSummary.platforms.map((platform) => (
            <span key={platform} className="rounded-full bg-emerald-400/20 px-4 py-1.5 text-sm font-bold text-emerald-200">
              {platform}
            </span>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ['目标市场', portfolioSummary.targetMarket],
            ['练习预算', portfolioSummary.budget],
            ['验证周期', portfolioSummary.timeline],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl bg-white/10 p-5">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-stone-400">{label}</p>
              <p className="mt-2 text-2xl font-black">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {onNavigateDemo ? (
            <button
              type="button"
              onClick={onNavigateDemo}
              className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-black text-stone-950 transition hover:bg-emerald-300"
            >
              进入商城 Demo →
            </button>
          ) : null}
          {onNavigateAdmin ? (
            <button
              type="button"
              onClick={onNavigateAdmin}
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-black text-white transition hover:bg-white/10"
            >
              运营看板 →
            </button>
          ) : null}
          {onNavigateReviews ? (
            <button
              type="button"
              onClick={onNavigateReviews}
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-black text-white transition hover:bg-white/10"
            >
              评论 Inbox →
            </button>
          ) : null}
        </div>
      </section>

      <section className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
        {portfolioSummary.capabilities.map((capability) => (
          <div key={capability} className="rounded-3xl border border-stone-200 bg-white p-4 sm:p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500 sm:text-sm">Capability</p>
            <h3 className="mt-2 text-base font-black text-stone-950 sm:text-lg">{capability}</h3>
          </div>
        ))}
      </section>

      <section className="mt-14 rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-700">Attachments</p>
            <h2 className="mt-2 text-3xl font-black text-stone-950">附件下载区</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-stone-600">
            招聘方可直接下载 Markdown / CSV 原文，验证「不是 PPT 空话」。所有数据标注为模拟练习项目。
          </p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioAttachments.map((attachment) => (
            <a
              key={attachment.id}
              href={attachment.href}
              download
              className="group rounded-3xl border border-emerald-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                  {attachment.format}
                </span>
                <span className="text-emerald-600 opacity-0 transition group-hover:opacity-100">下载 ↓</span>
              </div>
              <h3 className="mt-4 font-black text-stone-950">{attachment.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{attachment.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-[2rem] bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-stone-500">Visual proof board</p>
            <h2 className="mt-2 text-3xl font-black text-stone-950">案例素材墙</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-stone-600">
            Listing 对照、日报录入、评论处理 — 运营助理最核心的三类日常交付。
          </p>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {portfolioVisuals.map((visual) => (
            <article key={visual.alt} className="overflow-hidden rounded-3xl bg-stone-100">
              <img src={visual.imageUrl} alt={visual.alt} className="h-44 w-full object-cover" loading="lazy" />
              <div className="p-5">
                <h3 className="font-black text-stone-950">{visual.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{visual.caption}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-stone-500">Case narrative</p>
          <h2 className="mt-2 text-3xl font-black text-stone-950">三大核心案例</h2>
          <p className="mt-3 text-stone-600">
            按招聘方优先级排列：多平台 Listing → 日报周报 → 评论处理，辅以供应商整理与 Demo 展示。
          </p>
        </div>
        <div className="mt-8 grid gap-5">
          {caseStudySections.map((section, index) => (
            <article key={section.id} className="rounded-3xl border border-stone-200 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
                    {String(index + 1).padStart(2, '0')} · {section.eyebrow}
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-stone-950">{section.title}</h3>
                </div>
              </div>
              <p className="mt-4 max-w-4xl leading-7 text-stone-600">{section.summary}</p>
              <ul className="mt-5 grid gap-3 text-sm text-stone-700 md:grid-cols-2">
                {section.proofPoints.map((point) => (
                  <li key={point} className="rounded-2xl bg-stone-100 p-4">
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-[2rem] bg-white p-6 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-stone-500">Execution timeline</p>
        <h2 className="mt-2 text-3xl font-black text-stone-950">4-8 周执行节奏</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-5">
          {executionTimeline.map((item) => (
            <div key={item.period} className="rounded-3xl bg-stone-100 p-5">
              <p className="text-sm font-black text-emerald-700">{item.period}</p>
              <h3 className="mt-2 font-black text-stone-950">{item.focus}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">{item.output}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] bg-stone-950 p-6 text-white sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-300">Recommended layout</p>
          <h2 className="mt-2 text-3xl font-black">推荐布局方案</h2>
          <p className="mt-4 text-stone-300">{recommendedWireframe.description}</p>
          <div className="mt-6 rounded-3xl bg-white/10 p-5">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-stone-400">
              {recommendedWireframe.title}
            </p>
            <div className="mt-4 space-y-2">
              {recommendedWireframe.sections.map((section) => (
                <div key={section} className="rounded-2xl bg-white px-4 py-3 font-bold text-stone-950">
                  {section}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-[2rem] border border-stone-200 bg-white p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-stone-500">Live demo</p>
          <h2 className="mt-2 text-3xl font-black text-stone-950">在线 Demo 入口</h2>
          <p className="mt-4 leading-7 text-stone-600">
            React 作品集站 + 淘酥酥商城 Demo + 运营看板，展示前台体验理解与后台日常维护能力。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {onNavigateDemo ? (
              <button
                type="button"
                onClick={onNavigateDemo}
                className="rounded-full bg-stone-950 px-6 py-3 text-sm font-black text-white"
              >
                商城 Demo
              </button>
            ) : null}
            {onNavigateAdmin ? (
              <button
                type="button"
                onClick={onNavigateAdmin}
                className="rounded-full border border-stone-200 px-6 py-3 text-sm font-black text-stone-950"
              >
                运营看板
              </button>
            ) : null}
            {onNavigateReviews ? (
              <button
                type="button"
                onClick={onNavigateReviews}
                className="rounded-full border border-stone-200 px-6 py-3 text-sm font-black text-stone-950"
              >
                评论 Inbox
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-stone-500">Resume bullets</p>
          <h2 className="mt-2 text-3xl font-black text-stone-950">简历项目经历</h2>
          <ul className="mt-6 space-y-3 text-sm leading-6 text-stone-700">
            {resumeBullets.map((bullet) => (
              <li key={bullet} className="rounded-2xl bg-stone-100 p-4">
                {bullet}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[2rem] bg-white p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-stone-500">Interview script</p>
          <h2 className="mt-2 text-3xl font-black text-stone-950">60 秒面试讲述</h2>
          <p className="mt-5 leading-7 text-stone-600">{interviewScripts.sixtySeconds}</p>
          <h3 className="mt-8 font-black text-stone-950">高频追问备料</h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-700">
            {interviewScripts.deepDiveQuestions.map((question) => (
              <li key={question} className="rounded-2xl bg-stone-100 p-4">
                {question}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
