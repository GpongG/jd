import type { QuestionDraft } from "../../types";

export const engineeringQuestions: QuestionDraft[] = [
  {
    id: "eng-1",
    category: "engineering",
    title: "Webpack 与 Vite 在大型 H5 项目中的选型考量是什么？",
    difficulty: "进阶",
    tags: ["Webpack", "Vite", "构建"],
    answer: `**Vite 优势：**
- 开发态 ESM + esbuild 预构建，冷启动快，HMR 极快。
- 配置简洁，适合 Vue3/React 现代栈。
- 生产 Rollup 打包，Tree-shaking 成熟。

**Webpack 优势：**
- 生态插件最全（联邦模块、复杂 legacy、自定义 loader）。
- 超大型项目定制构建管线成熟；历史项目迁移成本高。

**选型建议：**
- 新项目、重开发体验 → Vite。
- 需 Module Federation、特殊打包、老 Babel 链 → Webpack 或 Rspack。
- 可 **渐进迁移**：开发 Vite、生产 Webpack（短期）或统一 Rspack。

面试提 **构建性能预算** 与 **CI 缓存**（pnpm store、vite cache）更加分。`,
  },
  {
    id: "eng-2",
    category: "engineering",
    title: "前端 CI/CD 流水线一般包含哪些环节？如何保证发布质量？",
    difficulty: "进阶",
    tags: ["CI/CD", "质量", "发布"],
    keyPoints: [
      "lint/test/build/预览环境",
      "灰度与回滚",
      "Source map 管理",
    ],
    answer: `**典型流水线：**
1. install（锁文件 + 缓存）
2. lint（ESLint/stylelint）+ typecheck
3. unit test + 可选 E2E（Playwright）
4. build 产出 dist / 离线包
5. 上传 CDN + 刷新缓存
6. 部署预览环境 → QA → 生产灰度

**质量门禁：**
- 覆盖率阈值、bundle size limit。
- Lighthouse CI 分数。
- 变更风险标签：核心支付/RTC 需人工审批。

**发布：**
- 特性开关（远程配置）比纯代码回滚更快。
- 离线包版本与 Native 最低版本矩阵兼容表。
- source map 上传私有符号服务，禁止公网暴露。`,
  },
  {
    id: "eng-3",
    category: "engineering",
    title: "如何为 H5 项目设计合理的目录结构与模块边界？",
    difficulty: "进阶",
    tags: ["架构", "目录", "模块化"],
    answer: `**推荐结构（feature-based）：**
\`\`\`
src/
  app/          # 入口、路由、全局 provider
  features/     # chat, live, gift 等业务域
  shared/       # UI 组件、hooks、utils
  entities/     # 用户、消息等领域模型
  services/     # API、WS、bridge 适配
  assets/
\`\`\`

**边界原则：**
- features 之间禁止循环依赖；共享逻辑下沉 shared。
- API 层与 UI 分离，便于 mock 与契约测试。
- Bridge/环境差异用 adapter 接口隔离。

**Monorepo：** 业务 app + shared ui + eslint-config 分包，独立版本与发布。`,
  },
];
