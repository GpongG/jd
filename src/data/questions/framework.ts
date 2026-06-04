import type { QuestionDraft } from "../../types";

export const frameworkQuestions: QuestionDraft[] = [
  {
    id: "fw-1",
    category: "framework",
    title: "请解释 Virtual DOM 是什么，以及它解决了什么问题？",
    difficulty: "基础",
    tags: ["React", "Vue", "渲染"],
    keyPoints: [
      "用 JS 对象描述真实 DOM 树",
      "批量更新 + Diff 减少直接操作 DOM 的次数",
      "声明式 UI 与状态驱动视图",
    ],
    answer: `Virtual DOM（虚拟 DOM）是用 JavaScript 对象描述真实 DOM 树结构的轻量表示。框架在状态变更时，先在内存中生成新的 VDOM 树，再通过 Diff 算法找出最小变更集，最后批量 patch 到真实 DOM。

**解决的问题：**
1. **减少昂贵 DOM 操作**：直接频繁改 DOM 会触发重排重绘，VDOM + Diff 把多次变更合并。
2. **声明式编程模型**：开发者只描述「UI 应该长什么样」，由框架负责同步到 DOM。
3. **跨平台潜力**：VDOM 可渲染到 DOM、Native（React Native）、Canvas 等。

**注意：** VDOM 不是免费的，Diff 本身有 CPU 成本；小页面或极简单更新场景，手写 DOM 可能更快。高级岗位应能说明「何时 VDOM 划算」。`,
  },
  {
    id: "fw-2",
    category: "framework",
    title: "React 与 Vue 的 Diff 算法有何异同？key 的作用是什么？",
    difficulty: "进阶",
    tags: ["Diff", "key", "列表渲染"],
    keyPoints: [
      "同层比较、不跨层移动（传统 Diff 策略）",
      "key 帮助识别节点身份，避免错误复用",
      "Vue3 最长递增子序列优化移动",
    ],
    answer: `**共同点：**
- 都采用「同层比较」策略，不跨层级比较，降低复杂度到 O(n) 量级。
- 都用 **key** 标识列表子节点身份，决定节点是复用、更新还是卸载重建。

**React（Fiber 架构下）：**
- 双缓存 Fiber 树，可中断调和。
- 列表 Diff 默认从左到右，配合 key；无 key 时按索引复用，可能导致状态错乱（输入框内容错位）。
- 仅右移时可能产生较多移动操作（Vue3 对此有优化）。

**Vue 2/3：**
- Vue2：双端指针 Diff（头尾同时比较），对常见插入删除更高效。
- Vue3：静态标记 + 最长递增子序列（LIS）减少 DOM 移动次数。

**key 的最佳实践：**
- 使用稳定唯一 id（如业务 id），不要用随机数或数组 index（在增删排序时会复用错节点）。
- 面试可举例：聊天列表用 messageId 作 key，避免新消息插入后旧消息组件状态串位。`,
  },
  {
    id: "fw-3",
    category: "framework",
    title: "React 18 并发特性（Concurrent）对业务开发有什么影响？",
    difficulty: "高级",
    tags: ["React 18", "Suspense", "useTransition"],
    keyPoints: [
      "可中断渲染，优先响应用户输入",
      "useTransition / useDeferredValue 降低卡顿感知",
      "自动批处理扩大范围",
    ],
    answer: `React 18 引入 **Concurrent Rendering**：渲染工作可中断、可恢复、可分优先级。

**对业务的影响：**
1. **useTransition**：把非紧急更新标为 transition，避免筛选/搜索时输入卡顿。
2. **useDeferredValue**：延迟展示昂贵计算结果（如大列表过滤），保持 UI 跟手。
3. **Suspense**：数据加载、懒加载组件可声明 fallback，配合 streaming SSR。
4. **自动批处理**：setState 在 Promise、setTimeout 里也会批量更新（以前需 unstable_batchedUpdates）。

**海外社交场景举例：** 消息列表滚动时后台拉新历史，可用 transition 降低主线程抢占；礼物动画与输入框共存时，应保证输入高优先级。

**追问准备：** 与 Vue 的响应式（依赖追踪即时更新）对比调度模型差异。`,
  },
  {
    id: "fw-4",
    category: "framework",
    title: "如何设计一套可跨海外社交业务复用的组件库？",
    difficulty: "高级",
    tags: ["组件库", "Design Token", "国际化"],
    keyPoints: [
      "Headless + 主题层分离",
      "RTL、多语言、无障碍",
      "Tree-shaking 与按需加载",
    ],
    answer: `高级 H5 岗常要求「通用组件库」经验，设计要点：

**1. 分层架构**
- **Headless 逻辑层**：行为、可访问性、键盘交互与业务无关。
- **主题层**：Design Token（颜色、间距、圆角、字体），支持亮暗色与品牌换肤。
- **业务适配层**：海外社交特有组件（礼物条、麦位、私信气泡）在基础组件上组合。

**2. 国际化与本地化**
- RTL（阿拉伯语）布局：逻辑属性 \`margin-inline-start\` 替代 \`margin-left\`。
- 文案外置 + ICU 复数/性别格式；组件不硬编码英文。

**3. 工程与质量**
- Monorepo（pnpm workspace）分包：core、icons、hooks、playground。
- 文档站 + 视觉回归（Chromatic）+ 单测（Testing Library）。
- 产物 ESM + 类型声明，sideEffects 标记利于 Tree-shaking。

**4. 性能**
- 虚拟列表、图片懒加载封装进列表/瀑布流组件。
- 动画组件用 CSS transform，避免触发布局。

面试时用「解决过多业务 fork」和「发布流程」举例更有说服力。`,
  },
  {
    id: "fw-5",
    category: "framework",
    title: "Vue3 响应式原理（Proxy）相比 Vue2（Object.defineProperty）强在哪里？",
    difficulty: "进阶",
    tags: ["Vue3", "响应式", "Proxy"],
    keyPoints: [
      "可监听新增/删除属性、数组索引",
      "Reflect 收集依赖",
      "性能与 Map 结构优化",
    ],
    answer: `Vue2 用 \`Object.defineProperty\` 递归劫持已有属性：
- 无法检测对象属性的 **新增/删除**（需 \`Vue.set\`）。
- 数组通过重写变异方法拦截，**直接改索引/length** 有盲区。
- 初始化成本：深层对象需递归遍历。

Vue3 用 **Proxy** 代理整个对象：
- 可拦截 get/set/deleteProperty、has、ownKeys 等，覆盖新增属性。
- 数组索引与 length 变更自然可追踪。
- 惰性访问：只有被读取的嵌套对象才深层代理（性能更好）。

**编译优化（配合响应式）：**
- PatchFlag 标记动态节点；静态提升减少 Diff 范围。
- 面试可提：Vue3 适合大型列表、复杂表单；但 Proxy 不兼容 IE11。`,
  },
  {
    id: "fw-6",
    category: "framework",
    title: "TypeScript 在大型 H5 项目里如何平衡类型安全与开发效率？",
    difficulty: "进阶",
    tags: ["TypeScript", "工程规范"],
    keyPoints: [
      "严格模式渐进开启",
      "API 类型与运行时校验分离",
      "泛型约束组件 Props",
    ],
    answer: `**策略：**
1. **基线配置**：\`strict\` 开启，\`any\` 需 code review 理由；公共包先类型化。
2. **边界类型化**：接口层用 OpenAPI/zod 生成类型 + 运行时校验（海外接口字段常变）。
3. **组件 Props**：联合类型 + 判别联合表达 UI 变体；避免过度 \`as\` 断言。
4. **工具类型**：\`Pick/Omit/ReturnType\` 从 store 推导，减少重复定义。
5. **性能**：项目引用（project references）拆分编译；CI 用 \`tsc -b\` 增量检查。

**社交业务例子：** 消息类型（文本/图片/语音/礼物）用 discriminated union，渲染分支 exhaustive check，防止漏处理新消息类型。`,
  },
];
