# 淘酥酥 · 跨境电商独立站

求职向跨境电商 / 独立站运营作品集，基于 React + TypeScript + Tailwind CSS v4 + Zustand。项目把一个美国市场轻量生活方式产品独立站 MVP 包装成可展示的运营闭环案例，同时保留商品发现、商品详情、购物车、优惠码、结账、订单成功页和简易运营看板等完整前端业务链路。

## 项目定位

这个项目不是为了真实收款发货，而是用于面试展示两类能力：

- 能把跨境运营需求拆成市场选择、选品、供应商验证、建站、流量测试和 Go / Pivot / Stop 复盘。
- 能把业务需求拆成商品数据、购物流程、价格规则和状态管理。
- 能搭建现代 DTC 独立站风格的响应式界面，并解释它如何服务运营验证。
- 能用 TypeScript 建模核心业务对象。
- 能用 Zustand 处理购物车、本地持久化、库存约束和结账状态。
- 能通过测试覆盖价格计算、购物车行为和作品集核心内容。

## 功能亮点

- **作品集首页**：跨境电商运营定位、MVP 假设、核心能力、案例入口和商城 demo 入口。
- **核心案例页**：项目背景、市场与品类选择、SKU 评分、供应商验证、建站方案、14 天流量测试、Go / Pivot / Stop 复盘。
- **可视化布局比较**：比较运营闭环案例型、独立站展示型和选品研究报告型三种作品集结构。
- **求职材料**：简历项目 bullet、60 秒面试讲述和可被深挖的问题。
- **商品列表页**：关键词搜索、分类筛选、价格排序、空状态。
- **商品详情页**：价格、卖点、规格、配送说明、推荐商品。
- **购物车抽屉**：加购、数量修改、删除、库存上限、优惠码、金额汇总。
- **结账模拟**：客户信息校验、配送方式、订单汇总、订单生成。
- **订单成功页**：订单号、客户信息、商品清单、履约状态。
- **运营看板**：SKU 数、预计收入、低库存提醒、Hero SKU 展示。

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开终端显示的本地地址（默认 `http://localhost:5173`）。

## 构建与测试

```bash
npm run build    # 生产构建
npm run test     # Vitest 单元测试
npm run preview  # 预览构建产物
```

## 免费发布（给别人观赏，无需盈利）

### 最快：Netlify 拖拽上线（约 1 分钟，不用 Git）

```bash
npm run build
```

然后双击运行 **`scripts/publish-free.bat`**，或手动：

1. 打开 [Netlify Drop](https://app.netlify.com/drop)
2. 把 **`dist`** 文件夹拖进页面
3. 获得 `https://xxxx.netlify.app` 链接，可直接分享

在 Netlify 站点设置里可把站点名改成 **`taosusu`**（若未被占用），链接变为 `https://taosusu.netlify.app`。

### GitHub Pages（长期固定链接）

推荐仓库名 **`taosusu`**，上线后访问地址为：

```text
https://<你的GitHub用户名>.github.io/taosusu/
```

若注册 GitHub 用户名或组织 **`taosusu`**，并创建仓库 **`taosusu.github.io`**，则可使用更贴近品牌的免费地址：

```text
https://taosusu.github.io/
```

### 一键部署步骤

1. 在 [GitHub](https://github.com/new) 新建仓库，名称填 **`taosusu`**（或 `taosusu.github.io`），选 Public，不要勾选 README。
2. 在本机项目目录执行（需先安装 [Git](https://git-scm.com/download/win)）：

```bash
git init
git add .
git commit -m "Publish taosusu cross-border store"
git branch -M main
git remote add origin https://github.com/<你的用户名>/taosusu.git
git push -u origin main
```

3. 打开仓库 **Settings → Pages**，**Build and deployment** 选 **GitHub Actions**。
4. 等待 Actions 跑完后，访问上面的 GitHub Pages 地址。

仓库已包含 `.github/workflows/deploy-pages.yml`，推送后会自动测试、构建并部署。

### 自定义域名（可选）

购买与淘酥酥相关的域名（如 `taosusu.com`）后：

1. 将 `public/CNAME.example` 复制为 `public/CNAME`，写入你的域名。
2. 在域名 DNS 添加 CNAME 记录指向 `<用户名>.github.io`。
3. 在 GitHub Pages 设置里填写 Custom domain 并启用 HTTPS。

## 技术栈

- React 19 + Vite + TypeScript
- Tailwind CSS v4
- Zustand（状态 + localStorage 持久化）
- Vitest + Testing Library（测试）

## 业务结构

```text
src/
  components/
    cart/
    layout/
    product/
  data/
    portfolio.ts
    products.ts
  lib/
    formatters.ts
    pricing.ts
    validation.ts
  pages/
    HomePage.tsx
    PortfolioCasePage.tsx
    ProductListPage.tsx
    ProductDetailPage.tsx
    CheckoutPage.tsx
    OrderSuccessPage.tsx
    AdminDashboardPage.tsx
  store/
    cartStore.ts
  types.ts
```

## 可讲述的面试点

- `src/data/portfolio.ts` 展示作品集主线、案例结构、执行时间线、简历话术和布局方案。
- `src/pages/PortfolioCasePage.tsx` 展示如何把运营过程包装成招聘方可快速扫读的案例页。
- `src/data/products.ts` 展示商品模型、分类、标签、库存和推荐关系。
- `src/lib/pricing.ts` 展示价格计算、折扣、配送费和税费规则。
- `src/store/cartStore.ts` 展示 Zustand 状态管理、库存限制和本地持久化。
- `src/pages/CheckoutPage.tsx` 展示表单校验、订单生成和跨页面状态流转。
- `src/pages/AdminDashboardPage.tsx` 展示如何把商品数据转成运营视角。

## 求职材料

- `cross-border-portfolio-job-pack.md`：可复制到简历和面试准备中的项目 bullet、60 秒讲述、3 分钟讲述和深挖问答。
- `cross-border-mvp-execution-index.md`：4-8 周独立站 MVP 执行索引。
- `cross-border-mvp-market-and-products.md`：市场、品类和 SKU 优先级决策。
- `cross-border-mvp-site-brief.md`：SaaS 独立站页面、支付、政策和追踪设置 brief。
- `cross-border-mvp-traffic-test-plan.md`：TikTok organic + 小预算 paid ads 测试节奏。
- `cross-border-mvp-go-pivot-stop-review.md`：Go / Pivot / Stop 复盘框架。

## 推荐承载形式

主承载使用 React 作品集站，原始 Markdown/CSV 文档作为过程证据。Notion/飞书文档可以作为备份投递链接，但当前项目已经能同时展示运营逻辑、页面能力和可交互电商 demo。
