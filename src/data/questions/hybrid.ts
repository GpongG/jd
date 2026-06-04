import type { QuestionDraft } from "../../types";

export const hybridQuestions: QuestionDraft[] = [
  {
    id: "hy-1",
    category: "hybrid",
    title: "描述一个典型的 JSBridge 实现方案，以及如何避免通信阻塞？",
    difficulty: "进阶",
    tags: ["JSBridge", "WebView", "Native"],
    keyPoints: [
      "URL Scheme / 注入 JS 上下文 / WKWebView messageHandlers",
      "异步回调 + 唯一 callbackId",
      "队列与超时处理",
    ],
    answer: `**常见实现方式：**

1. **URL Scheme 拦截**（早期 iOS）：H5 改 \`iframe.src = 'myapp://method?params'\`，Native 拦截请求执行。缺点：长度限制、性能差。
2. **JavaScript Bridge 注入**：Native 向 WebView 注入 \`window.NativeBridge.call(method, params)\`，内部走同步/异步通道。
3. **iOS WKWebView**：\`webkit.messageHandlers.xxx.postMessage\`；Android 用 \`@JavascriptInterface\`。

**异步模型：**
\`\`\`
H5: call('getUserInfo', { callbackId: 'cb_1' })
Native: 执行后回调 window.__bridgeCallback('cb_1', result)
\`\`\`

**避免阻塞：**
- 所有 Bridge 调用 **默认异步**，避免 Native 主线程重任务卡死 WebView。
- H5 侧 Promise 封装 + 超时（3s）+ 失败降级。
- 批量调用合并（flush queue），高频埋点走 Native 批量上报通道。

**安全：** 校验调用白名单、签名、HTTPS 页面；防 XSS 注入恶意 bridge 调用。`,
  },
  {
    id: "hy-2",
    category: "hybrid",
    title: "iOS Safari 与 Android Chrome（WebView）有哪些常见兼容性深水区？",
    difficulty: "高级",
    tags: ["Safari", "WebView", "兼容性"],
    keyPoints: [
      "100vh、安全区、橡皮筋滚动",
      "自动播放策略、日期/文件选择",
      "GPU 层叠与 fixed 定位",
    ],
    answer: `**iOS Safari / WKWebView：**
- **视口**：\`100vh\` 含地址栏变化导致跳动 → 用 \`dvh/svh\` 或 JS 测 \`innerHeight\` 设 CSS 变量。
- **安全区**：刘海/底部 Home 条 → \`env(safe-area-inset-*)\` + viewport-fit=cover。
- **滚动**：内部 \`overflow: scroll\` 惯性、橡皮筋；与 Native 手势冲突需 \`-webkit-overflow-scrolling\` 与 touch 协商。
- **音视频**：自动播放需 muted 或用户手势；通话页需 WebRTC + 音频会话 category 配合 Native。
- **日期/文件**：\`<input type="date">\` 样式不可控；大文件上传易 OOM。

**Android WebView / Chrome：**
- **内核碎片化**：系统 WebView 版本差异 → 目标 minSdk + X5/自建内核评估。
- **键盘**：resize vs pan 导致输入框被挡 → \`window.visualViewport\` 监听调整。
- **层级**：\`position: fixed\` + 软键盘 + 全屏视频层级错乱。
- **内存**：低端机 WebView 易杀进程 → 状态恢复、localStorage 容量。

**面试答法：** 举实际 bug（如 iOS 键盘顶起聊天输入框）+ 检测手段（UA + feature detect，不单靠 UA）。`,
  },
  {
    id: "hy-3",
    category: "hybrid",
    title: "H5 页面在 App 内如何与 Native 共享登录态与路由栈？",
    difficulty: "进阶",
    tags: ["登录态", "路由", "容器"],
    keyPoints: [
      "Token 由 Native 注入或安全存储读取",
      "统一路由协议 deep link",
      "返回栈与关闭 WebView 约定",
    ],
    answer: `**登录态：**
- **推荐**：Token 存 Native Keychain/Keystore，H5 通过 Bridge **按需获取**（短期 access + refresh 流程由 Native 刷新），避免 H5 localStorage 明文长期存 token。
- 首屏：Native 在加载 URL 时注入 cookie 或 header（仅限同源可信页）。
- 登出：Native 广播事件，H5 清内存态并跳登录页。

**路由：**
- 定义统一 schema：\`myapp://web?url=encode&title=xx&immersive=1\`
- H5 内部 SPA 路由用 hash 或 history，与 Native 约定：**关闭容器** vs **H5 history.back**。
- 新开 WebView vs 当前栈 push：由 Native 路由表配置，防止套娃。

**海外注意：** 多账号、游客模式、合规 cookie 横幅（GDPR）与 Native 隐私弹窗顺序。`,
  },
  {
    id: "hy-4",
    category: "hybrid",
    title: "如何设计 Hybrid 容器的预加载与缓存策略以优化首屏？",
    difficulty: "高级",
    tags: ["预加载", "离线包", "首屏"],
    keyPoints: [
      "WebView 池化预热",
      "离线资源包版本管理",
      "接口数据 prefetch",
    ],
    answer: `**1. WebView 池**
- App 启动预创建 1 个隐藏 WebView，加载空白页完成进程预热。
- 打开 H5 时复用实例，减少冷启动 300ms～1s。

**2. 离线包（类似美团/Gaia 方案）**
- 构建产出 zip + manifest（hash、路由映射）。
- Native 按版本下载、校验、解压到本地；WebView 拦截请求映射到 file:// 或 custom scheme。
- 灰度：按用户百分比下发新版本，失败回滚。

**3. 数据预取**
- Native 在点击入口时并行请求首屏 API，通过 Bridge \`injectInitialData\` 传给 H5，减少白屏等待 waterfall。
- SSR/SSG 对 SEO 页有用；App 内社交页更重接口预取。

**4. 监控**
- 区分「容器打开耗时 / HTML 解析 / 接口 TTFB / 首帧渲染」四段埋点。`,
  },
  {
    id: "hy-5",
    category: "hybrid",
    title: "WebView 与 Native 手势冲突（侧滑返回、列表滚动）如何解决？",
    difficulty: "进阶",
    tags: ["手势", "滚动", "UX"],
    answer: `**问题：** iOS 边缘右滑返回 vs 页面内横向滑动（轮播、清屏）；列表纵向滚动 vs 下拉刷新 Native 组件。

**方案：**
1. **协商协议**：H5 在横向滑动区域开始时 \`bridge.notifyGestureLock(true)\`，结束释放；Native 临时禁用全屏 pop。
2. **CSS**：\`touch-action: pan-y\` 限制轴向；避免全局 \`touchmove preventDefault\` 导致滚动失效。
3. **区域命中**：仅边缘 20px 交给系统返回，中间区域 H5 处理（需 Native 支持自定义边缘宽度）。
4. **嵌套滚动**：记录 scrollTop，到顶才将后续 pull 交给 Native 下拉刷新。

高级岗应强调 **可观测性**：埋点统计手势冲突导致的误返回率。`,
  },
];
