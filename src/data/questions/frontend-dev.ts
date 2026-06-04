import type { QuestionDraft } from "../../types";

export const frontendDevQuestions: QuestionDraft[] = [
  // JavaScript 核心
  {
    id: "fe-js-1",
    category: "js",
    title: "解释 JavaScript 的事件循环（Event Loop）及宏任务、微任务",
    difficulty: "进阶",
    tags: ["Event Loop", "异步"],
    keyPoints: [
      "调用栈 → 微任务队列 → 宏任务队列",
      "Promise.then 属于微任务，setTimeout 属于宏任务",
      "async/await 本质是 Promise",
    ],
    answer: `浏览器中 JS 是单线程，**事件循环**负责调度异步任务：

1. 执行同步代码（调用栈）
2. 清空 **微任务队列**（Promise.then、queueMicrotask、MutationObserver）
3. 取一个 **宏任务**（setTimeout、setInterval、I/O、UI 渲染）执行
4. 重复 2～3

**经典输出题：** \`console.log(1); setTimeout(() => console.log(2)); Promise.resolve().then(() => console.log(3)); console.log(4);\` → 1, 4, 3, 2

**业务场景：** 社交页批量 DOM 更新可先 \`Promise.then\` 合并，避免 layout thrashing；理解微任务有助于排查「点击后状态未立刻更新」类 bug。`,
  },
  {
    id: "fe-js-2",
    category: "js",
    title: "闭包是什么？在开发中有哪些典型应用与注意事项？",
    difficulty: "基础",
    tags: ["闭包", "作用域"],
    answer: `**闭包**：函数能够访问其词法作用域外的变量，即使外层函数已执行完毕。

**典型应用：**
- 模块化（IIFE 封装私有变量）
- 柯里化、防抖节流保存 timer 引用
- React Hooks 依赖闭包保存 state（需注意陈旧闭包）

**注意：**
- 意外持有大对象引用导致 **内存泄漏**（尤其挂在 window/DOM 事件上）
- 循环中 var + 闭包经典题 → 用 let 或 IIFE

**社交场景：** 聊天输入框防抖发送、直播间倒计时组件内部状态隔离。`,
  },
  {
    id: "fe-js-3",
    category: "js",
    title: "原型链与 class 继承的区别？如何实现继承？",
    difficulty: "进阶",
    tags: ["原型", "继承", "ES6"],
    answer: `每个对象有内部 \`[[Prototype]]\`（可通过 \`__proto__\` 或 \`Object.getPrototypeOf\` 访问），形成 **原型链**，属性查找沿链向上直到 null。

**ES6 class** 是语法糖：\`class B extends A\` 设置 \`B.prototype.__proto__ = A.prototype\`，静态属性继承通过 \`Object.setPrototypeOf(B, A)\`。

**与拷贝继承区别：** 原型链共享方法节省内存；深拷贝继承无法复用行为。

面试可手写：**寄生组合继承** \`Object.create(Super.prototype)\` 作为子类原型，避免调用两次 Super 构造函数。`,
  },
  {
    id: "fe-js-4",
    category: "js",
    title: "== 与 === 的区别？类型转换规则有哪些？",
    difficulty: "基础",
    tags: ["类型", "比较"],
    answer: `\`===\` **严格相等**：类型和值都相同才 true，不做类型转换（推荐默认使用）。

\`==\` **宽松相等**：类型不同先按规则转换再比较，易产生意外：
- \`null == undefined\` 为 true
- 数字与字符串：字符串转数字
- 对象与原始值：对象 \`valueOf/toString\`
- \`[] == false\`、\`[] == ![]\` 等经典坑

**实践：** ESLint \`eqeqeq\`；仅在明确需要 \`x == null\`（同时匹配 null/undefined）时使用 ==。`,
  },

  // HTML / CSS
  {
    id: "fe-html-1",
    category: "html-css",
    title: "语义化 HTML 是什么？对 SEO 与可访问性有什么帮助？",
    difficulty: "基础",
    tags: ["语义化", "SEO", "a11y"],
    answer: `使用符合语义的标签表达结构：\`header/nav/main/article/section/footer\`、\`h1-h6\` 层级、\`button\` 而非 div 绑点击等。

**好处：**
- **SEO**：爬虫更好理解页面结构
- **可访问性**：读屏软件可导航地标区域
- **维护**：代码自解释，减少 div 套娃

**社交产品：** 动态 Feed 用 \`article\` 包裹单条；直播评论区用 \`section\` + \`aria-live\` 提示新消息。`,
  },
  {
    id: "fe-html-2",
    category: "html-css",
    title: "Flex 与 Grid 分别适合什么布局场景？",
    difficulty: "基础",
    tags: ["Flex", "Grid", "布局"],
    answer: `**Flex（一维）：** 导航栏、垂直居中、底部输入栏+上方列表、头像+昵称横排。适合主轴/交叉轴对齐、弹性伸缩。

**Grid（二维）：** 相册墙、直播间礼物面板网格、后台配置页。适合行列同时定义、区域命名（\`grid-template-areas\`）。

**组合：** 页面整体 Grid 划分区域，区域内小组件 Flex 对齐。移动端社交常见「上中下」：顶栏 Flex、中间滚动、底栏 Flex。`,
  },
  {
    id: "fe-html-3",
    category: "html-css",
    title: "BFC 是什么？如何解决 margin 塌陷和清除浮动？",
    difficulty: "进阶",
    tags: ["BFC", "布局"],
    answer: `**块级格式化上下文（BFC）** 是独立渲染区域，内外布局互不影响。

**触发方式：** \`overflow: hidden/auto\`、\`display: flow-root\`（推荐）、\`float\`、\`position: absolute\`、\`display: flex/grid\` 等。

**应用：**
- **margin 塌陷**：父子垂直 margin 合并 → 父元素形成 BFC
- **清除浮动**：父 \`display: flow-root\` 包含浮动子元素
- **自适应两栏**：左侧 float，右侧 BFC 避免覆盖

现代布局优先 Flex/Grid，BFC 题仍常见于考察 CSS 基础深度。`,
  },

  // MVC / MVVM
  {
    id: "fe-pat-1",
    category: "patterns",
    title: "MVC 与 MVVM 的区别？Vue/React 分别更接近哪种？",
    difficulty: "进阶",
    tags: ["MVC", "MVVM", "架构"],
    keyPoints: [
      "MVC：Controller 协调 Model 与 View",
      "MVVM：ViewModel 双向绑定，View 自动更新",
      "React 偏 V 层 + 单向数据流；Vue 模板+响应式偏 MVVM",
    ],
    answer: `**MVC：**
- **Model** 数据与业务
- **View** 展示
- **Controller** 接收输入、更新 Model、选 View 渲染
- 早期 Backbone：Controller 较厚

**MVVM：**
- **Model** 数据
- **View** UI
- **ViewModel** 暴露可绑定数据与命令，**双向绑定** 自动同步（Knockout、Vue 模板时代）

**现代框架：**
- **Vue**：模板 + 响应式 → 常被归为 MVVM；Vue3 Composition 更强调逻辑复用
- **React**：UI = f(state)，单向数据流，更像 **V + State**（Controller 逻辑在 hooks/redux）

答法强调：**模式是思想，不必教条对应**，关键是分层与数据流向清晰。`,
  },
  {
    id: "fe-pat-2",
    category: "patterns",
    title: "什么是单向数据流？在 React 项目中如何实践？",
    difficulty: "进阶",
    tags: ["数据流", "React", "状态"],
    answer: `数据从 **父 → 子** 通过 props 传递；子组件不直接改 props，通过 **回调** 通知父组件更新 state，再自上而下刷新。

**实践：**
- 状态提升到共同父级或 Context / Redux / Zustand
- 子组件 \`onChange\` 回调而非内部改 props
- 派生数据用 \`useMemo\`，副作用用 \`useEffect\` 明确依赖

**对比双向绑定：** v-model 方便表单，复杂应用仍建议「单一数据源」便于调试。

**社交场景：** 消息列表数据在 store，输入框只 dispatch 发送 action，避免多处副本不一致。`,
  },

  // Vue / React
  {
    id: "fe-vr-1",
    category: "vue-react",
    title: "Vue 中 computed 与 watch 的区别与使用场景？",
    difficulty: "基础",
    tags: ["Vue", "computed", "watch"],
    answer: `**computed：**
- 基于依赖 **缓存**，依赖不变不重算
- 必须有返回值，适合 **派生状态**（过滤列表、总价、是否可提交）

**watch：**
- 监听特定源变化执行 **副作用**（请求接口、操作 DOM、localStorage）
- 可配置 \`immediate\`、\`deep\`

**原则：** 能 computed 就不 watch；异步/副作用用 watch；Vue3 也可用 \`watchEffect\` 自动收集依赖。

**例子：** 直播间在线人数用 watch 拉接口；礼物总价用 computed。`,
  },
  {
    id: "fe-vr-2",
    category: "vue-react",
    title: "React Hooks 中 useEffect 的依赖数组如何正确填写？",
    difficulty: "进阶",
    tags: ["React", "Hooks", "useEffect"],
    answer: `**规则：**
- 省略数组：每次渲染后执行（慎用，易死循环）
- \`[]\`：仅挂载/卸载时执行（请求、订阅）
- \`[a, b]\`：a 或 b 变化时执行

**必须包含：** effect 内读取且会变化的 props/state（eslint-plugin-react-hooks）。

**清理：** 返回函数做 unsubscribe、clearInterval，防止泄漏。

**常见坑：**
- 对象/数组依赖用引用每次变 → 用 useMemo 稳定或拆原始值依赖
- 异步竞态：用 aborted flag 或 ignore 过期响应

社交页拉取会话列表：\`useEffect(() => { fetch(id) }, [id])\`。`,
  },
  {
    id: "fe-vr-3",
    category: "vue-react",
    title: "Vue 组件间通信有哪些方式？",
    difficulty: "基础",
    tags: ["Vue", "组件通信"],
    answer: `**父子：** props down / emits up
**跨层：** provide/inject（祖先后代）
**兄弟/任意：** EventBus（Vue2 常 mitt，Vue3 少用）、**Pinia/Vuex** 全局 store
**依赖注入：** app.config.globalProperties 或 composables 共享逻辑

**选型：** 默认 props+emit；超过 2 层考虑 provide 或 store；高频全局状态（用户信息、主题）用 Pinia。

与 JD「前后端数据交互模块」结合：API 层封装在 composable/service，组件只消费数据。`,
  },
  {
    id: "fe-vr-4",
    category: "vue-react",
    title: "React 中 key 的作用？为什么不建议用 index 作 key？",
    difficulty: "基础",
    tags: ["React", "key", "列表"],
    answer: `**key** 帮助 Reconciler 识别列表节点身份，决定复用、更新或卸载。

**index 作 key 的问题：** 列表 **增删、排序** 时 index 变但内容变，导致组件错误复用（输入框内容错位、动画异常、内部 state 残留）。

**正确做法：** 用业务稳定 id（userId、messageId）。

**例外：** 静态无重排列表可临时用 index（极少）。`,
  },

  // jQuery / Bootstrap / Ajax
  {
    id: "fe-leg-1",
    category: "legacy",
    title: "jQuery 中 $(document).ready 与原生 DOMContentLoaded 的关系？",
    difficulty: "基础",
    tags: ["jQuery", "DOM"],
    answer: `\`$(fn)\` / \`$(document).ready(fn)\` 在 DOM 树构建完成、外部资源可能未加载完时触发，等价于：

\`document.addEventListener('DOMContentLoaded', fn)\`

区别于 \`window.onload\`（全部资源加载完）。

**现代项目：** 模块脚本 defer 后放底部或 React/Vue 挂载根节点，少用手写 ready。维护老社交后台时仍会见到 jQuery 渐进迁移。`,
  },
  {
    id: "fe-leg-2",
    category: "legacy",
    title: "Ajax 是什么？与 fetch、axios 相比有何异同？",
    difficulty: "基础",
    tags: ["Ajax", "fetch", "axios"],
    answer: `**Ajax（Asynchronous JavaScript and XML）** 指浏览器 **异步** 与服务器交换数据并局部更新页面，无需整页刷新。

**实现演进：**
- \`XMLHttpRequest\`：回调、手动处理状态码
- **fetch**：原生 Promise，需手动 \`.json()\`，默认不带 cookie 同源策略可配置
- **axios**：封装 XHR/fetch，拦截器、自动 JSON、取消请求、广泛用在 Vue/React 项目

**REST 实践：** GET 查询、POST 创建、PUT/PATCH 更新、DELETE 删除；统一错误处理与 token 刷新。

JD 明确要求 Ajax，需能讲清 **与后端联调**：CORS、Content-Type、鉴权头。`,
  },
  {
    id: "fe-leg-3",
    category: "legacy",
    title: "Bootstrap 栅格系统如何工作？如何实现响应式？",
    difficulty: "基础",
    tags: ["Bootstrap", "响应式"],
    answer: `12 列栅格 + 断点（xs/sm/md/lg/xl）：
- \`container\` / \`container-fluid\` 包裹
- \`row\` + \`col-md-6\` 等分配宽度
- \`col-*\` 在不同断点自动堆叠或并排

**工具类：** \`d-flex\`、\`mt-3\`、\`btn btn-primary\` 快速搭后台/活动页。

**与 JD 关系：** 老项目或运营页常用 Bootstrap；新业务多用 Tailwind/组件库，但面试考察 **响应式思想**（移动优先、弹性布局）一致。`,
  },

  // 工程化
  {
    id: "fe-eng-1",
    category: "engineering",
    title: "Webpack 的核心概念：entry、loader、plugin 分别做什么？",
    difficulty: "进阶",
    tags: ["Webpack", "构建"],
    keyPoints: [
      "entry 入口依赖图",
      "loader 转换非 JS 模块",
      "plugin 扩展构建生命周期",
    ],
    answer: `**entry：** 构建起点，形成依赖图
**output：** 输出 bundle 路径与文件名（含 hash 缓存）
**loader：** 链式转换文件（babel-loader、css-loader、vue-loader）
**plugin：** 参与整个编译周期（HtmlWebpackPlugin、DefinePlugin、SplitChunks）

**常用优化：**
- 代码分割 \`import()\` + SplitChunks
- 缓存：contenthash、runtime 单独 chunk
- Tree-shaking（ESM + sideEffects: false）

JD 要求熟悉 Webpack，需能说明 **开发 vs 生产** 配置差异（source-map、压缩、HMR）。`,
  },
  {
    id: "fe-eng-2",
    category: "engineering",
    title: "什么是前端模块化？CommonJS 与 ES Module 的区别？",
    difficulty: "进阶",
    tags: ["模块化", "CJS", "ESM"],
    answer: `**模块化** 把代码拆成独立作用域单元，明确依赖与导出，避免全局污染。

| | CommonJS | ES Module |
|---|----------|-----------|
| 加载 | 运行时同步 \`require\` | 编译时静态 \`import\` |
| 导出 | \`module.exports\` | \`export\` |
| 值 | 拷贝导出（对象引用共享） |  live binding |
| 环境 | Node 传统 | 浏览器原生 + 现代打包器 |

**Webpack** 可同时处理两者；生产构建常输出 ESM 以利 Tree-shaking。

**业务：** 按 feature 拆分 chat、live、profile 模块，公共 utils 单独包。`,
  },

  // 测试与性能
  {
    id: "fe-test-1",
    category: "testing",
    title: "前端单元测试一般测什么？Jest + Testing Library 如何配合？",
    difficulty: "进阶",
    tags: ["Jest", "单元测试"],
    answer: `**测什么：**
- 纯函数工具（格式化消息时间、敏感词过滤）
- 组件：给定 props 渲染结果、用户交互（点击、输入）后状态
- hooks / store：action 与 reducer

**Testing Library 理念：** 从用户角度查询（getByRole、getByText），少测实现细节（内部 state）。

**Mock：** API 用 msw 或 jest.mock；定时器 fakeTimers。

**社交例子：** 「发送按钮在空内容时 disabled」「消息气泡渲染正确的发送者昵称」。`,
  },
  {
    id: "fe-test-2",
    category: "testing",
    title: "你用过哪些前端性能诊断工具？如何定位首屏慢？",
    difficulty: "进阶",
    tags: ["性能", "Chrome DevTools", "Lighthouse"],
    answer: `**工具：**
- **Chrome Performance**：火焰图看长任务、布局、脚本耗时
- **Network**：瀑布图、TTFB、资源体积、是否 HTTP/2
- **Lighthouse**：FCP、LCP、CLS 评分与建议
- **Coverage**：未使用 JS/CSS
- **React/Vue DevTools**：组件重渲染 Profiler

**首屏慢排查顺序：**
1. HTML 阻塞脚本？→ defer/async
2. 首屏接口慢？→ 并行、BFF、缓存
3. bundle 过大？→ 分割、按需加载
4. 图片未压缩？→ WebP、懒加载
5. 字体 FOIT？→ font-display: swap

结合 JD「持续提升用户体验」给出 **优化前后数据** 更有说服力。`,
  },

  // 社交 / 直播
  {
    id: "fe-soc-1",
    category: "social",
    title: "社交产品中消息列表前端如何实现？应注意什么？",
    difficulty: "进阶",
    tags: ["IM", "列表", "社交"],
    answer: `**实现要点：**
- 数据结构：按会话 id 存消息数组，有序 seq 或时间戳
- **虚拟滚动** 或分页加载历史，避免 DOM 过多
- 新消息：底部锚点、未读数、@ 提醒
- 发送：乐观更新 + 失败重试 + 去重 messageId
- 图片/语音：懒加载、占位、进度条

**注意：** 滚动位置保持、键盘弹起（移动端）、敏感内容 XSS 过滤、国际化时间格式。

有直播经验可补充：**弹幕** 与普通 IM 分离通道、节流渲染。`,
  },
  {
    id: "fe-soc-2",
    category: "social",
    title: "直播间礼物动效在前端如何实现？如何控制性能？",
    difficulty: "进阶",
    tags: ["直播", "动画", "性能"],
    answer: `**方案：**
- CSS 动画 / Lottie JSON / Canvas 序列帧 / 视频透明通道
- 队列播放：多个礼物排队，避免叠层过多

**性能：**
- 同时播放数量上限，低端机降级为静态图标
- 使用 transform/opacity，避免 layout
- 页面隐藏（visibilitychange）暂停动画
- 大图预加载与对象池复用 DOM

**与后端：** 礼物消息经 WebSocket 推送，前端解析 giftId 映射资源。`,
  },
  {
    id: "fe-soc-3",
    category: "social",
    title: "PC 端与移动端同一套社交功能，前端如何适配？",
    difficulty: "基础",
    tags: ["响应式", "多端"],
    answer: `**策略：**
1. **响应式布局**：媒体查询 + Flex/Grid，一套代码适配（Bootstrap 思路）
2. **分开路由/组件**：\`/m/\` 移动站与 PC 站，共享逻辑层（hooks/services）
3. **UA/触摸检测**：引导下载 App 或切换移动版

**交互差异：** 移动端 touch 事件、底部 Tab；PC  hover、右键菜单、快捷键。

**工程：** 共享 API 层与类型定义，UI 层按端分包减小体积。`,
  },

  // 协作与素养
  {
    id: "fe-soft-1",
    category: "soft",
    title: "如何与后端、UI 设计师协作保证需求按时高质量交付？",
    difficulty: "基础",
    tags: ["协作", "沟通"],
    answer: `**需求阶段：** 参与评审，澄清接口格式、异常态、空状态；UI 稿标注切图与交互细节。

**开发阶段：**
- 与后端约定 **接口文档/Mock**（Swagger、YApi），并行开发
- 与 UI 对齐 **设计系统**（间距、色板、组件），减少返工
- 每日站会同步阻塞点

**验收阶段：** 自测清单（主流浏览器、核心路径）；提测说明已知问题。

**JD 关键词：** 「密切配合」「按时按质」→ 用具体流程和工具（Figma、飞书、Git 分支策略）回答。`,
  },
  {
    id: "fe-soft-2",
    category: "soft",
    title: "你如何保持前端技术学习？最近关注什么方向？",
    difficulty: "基础",
    tags: ["学习", "成长"],
    answer: `**可答结构：**
- **输入**：官方文档（React/Vue blog）、优质博客、GitHub Trending、技术播客
- **输出**：内部分享、笔记、side project 验证
- **业务驱动**：为做社交/直播而去学 WebSocket、性能优化

**最近方向（示例，可替换真实）：** TypeScript 严格化、Vite 迁移、RSC 了解、AI 辅助开发工作流

避免空喊「热爱技术」，结合 **3 年经验岗位** 展示持续跟进而非追逐 every hype。`,
  },
  {
    id: "fe-soft-3",
    category: "soft",
    title: "遇到线上前端 bug 你如何排查与处理？",
    difficulty: "进阶",
    tags: ["排障", "线上"],
    answer: `**流程：**
1. **复现**：用户环境（浏览器、系统、账号）、操作路径
2. **定位**：Sentry/监控堆栈、source map 还原；Network 看接口；对比发版时间
3. **止血**：回滚 / 特性开关 / 热修配置
4. **修复**：分支修复 → 测试 → 发布 → 复盘文档

**社交类高频：** 接口字段变更、WebSocket 断线、缓存旧 JS、CDN 未刷新。

强调 **责任心** 与 **沟通**：及时同步产品/后端，记录 incident。`,
  },
];
