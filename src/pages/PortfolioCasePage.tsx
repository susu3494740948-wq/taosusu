import {
  caseStudySections,
  executionTimeline,
  interviewScripts,
  portfolioSummary,
  portfolioVisuals,
  resumeBullets,
  wireframeOptions,
} from '../data/portfolio'

export function PortfolioCasePage() {
  const recommendedWireframe = wireframeOptions.find((option) => option.recommended) ?? wireframeOptions[0]

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] bg-stone-950 p-8 text-white sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-300">
          Cross-border operations portfolio
        </p>
        <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
          4-8 周独立站 MVP 验证案例
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-300">
          {portfolioSummary.positioning}，面向{portfolioSummary.targetRole}岗位，展示从市场选择、
          选品、供应商验证、独立站搭建、流量测试到数据复盘的完整运营闭环。
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ['目标市场', portfolioSummary.targetMarket],
            ['预算范围', portfolioSummary.budget],
            ['验证周期', portfolioSummary.timeline],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl bg-white/10 p-5">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-stone-400">{label}</p>
              <p className="mt-2 text-2xl font-black">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {portfolioSummary.capabilities.map((capability) => (
          <div key={capability} className="rounded-3xl border border-stone-200 bg-white p-5">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-stone-500">Capability</p>
            <h3 className="mt-2 text-xl font-black text-stone-950">{capability}</h3>
          </div>
        ))}
      </section>

      <section className="mt-14 rounded-[2rem] bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-stone-500">Visual proof board</p>
            <h2 className="mt-2 text-3xl font-black text-stone-950">真实图片感的项目素材墙</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-stone-600">
            用生活方式图片和看板图片模拟真实独立站素材，让招聘方先看到“产品怎么卖、内容怎么拍、
            数据怎么复盘”。
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
          <h2 className="mt-2 text-3xl font-black text-stone-950">核心案例页结构</h2>
          <p className="mt-3 text-stone-600">
            这页按照运营岗位最关心的业务顺序展开：先讲验证目标，再讲选品依据、供应商控制、
            站点转化、流量测试和最终决策。
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
              <ul className="mt-5 grid gap-3 text-sm text-stone-700 md:grid-cols-3">
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
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-300">Visual wireframe</p>
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
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-stone-500">Implementation choice</p>
          <h2 className="mt-2 text-3xl font-black text-stone-950">推荐承载形式：React 作品集站</h2>
          <p className="mt-4 leading-7 text-stone-600">
            当前项目已经有商品列表、详情、购物车、结账和运营看板，最适合改造成“作品集站 + 独立站 demo”
            的组合。React 页面负责快速展示运营逻辑，原始 Markdown/CSV 材料保留为过程证据。
          </p>
          <div className="mt-6 grid gap-3">
            {wireframeOptions.map((option) => (
              <div key={option.id} className="rounded-2xl bg-stone-100 p-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-black text-stone-950">{option.title}</h3>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-stone-600">
                    {option.recommended ? 'Recommended' : 'Backup'}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-stone-600">{option.description}</p>
              </div>
            ))}
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
          <h3 className="mt-8 font-black text-stone-950">可被追问的问题</h3>
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
