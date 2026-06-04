import type { QuestionDraft } from "../../types";

export const performanceQuestions: QuestionDraft[] = [
  {
    id: "perf-1",
    category: "performance",
    title: "如何系统性地优化 H5 首屏加载时间？请给出可量化指标",
    difficulty: "高级",
    tags: ["FCP", "LCP", "首屏"],
    keyPoints: [
      "关键渲染路径",
      "资源优先级与分包",
      "接口与渲染并行",
    ],
    answer: `**指标：** FCP、LCP、TTI、首屏接口完成时间、容器打开耗时。

**优化清单：**
1. **HTML**：内联关键 CSS；defer/async JS；preload 字体与 LCP 图。
2. **JS**：路由级 code splitting；tree-shaking；避免大包 lodash moment。
3. **接口**：并行请求；BFF 聚合首屏；GraphQL 或自定义 aggregate 接口。
4. **渲染**：骨架屏；SSR/预渲染视 SEO 需求；hydration 最小化。
5. **图片**：响应式 srcset、懒加载、CDN 裁剪。
6. **Hybrid**：离线包 + WebView 预热（见 Hybrid 篇）。

**量化：** Lighthouse CI + 真机 RUM（分国家/网络类型）；设定预算 gate CI。`,
  },
  {
    id: "perf-2",
    category: "performance",
    title: "长列表（消息流、礼物墙）如何保持滚动流畅？",
    difficulty: "进阶",
    tags: ["虚拟列表", "滚动", "渲染"],
    answer: `**核心：虚拟滚动（windowing）**
- 只渲染视口 + 缓冲区 item，总 DOM 数恒定。
- 动态高度：先估高 + 测量缓存 + 修正 offset（react-virtualized、tanstack-virtual）。

**其它：**
- 项组件 Pure/memo；避免内联函数导致全列表重渲染。
- 图片懒加载 + 固定占位防布局抖动。
- 反向列表（聊天从底向上）：维护 scroll anchor，新消息插入不跳屏。
- 合成层：will-change 慎用；推广使用 content-visibility: auto。

**极端场景：** 万级历史消息分片加载，离开视口卸载媒体解码。`,
  },
  {
    id: "perf-3",
    category: "performance",
    title: "如何建立前端监控体系以支撑海外社交产品？",
    difficulty: "高级",
    tags: ["监控", "RUM", "告警"],
    keyPoints: [
      "性能 + 错误 + 业务漏斗",
      "采样与隐私合规",
      "与 Native 日志关联",
    ],
    answer: `**三层监控：**

1. **性能 RUM**：LCP/FID/CLS、资源耗时、长任务、内存趋势；按国家/机型/网络分桶。
2. **稳定性**：JS 错误、Promise rejection、资源 404；source map 还原；用户操作面包屑。
3. **业务**：注册/进房/送礼/支付漏斗；WebSocket 断线率、RTC 首帧时长。

**实现：**
- 上报 SDK 批量、sendBeacon 卸载 Flush；采样率可配置。
- TraceId 贯穿 H5-Native-服务端。
- 告警：错误率环比、P99 延迟阈值；Dashboard 分区域。

**合规：** GDPR 避免 PII 明文；提供 opt-out；欧盟数据存储策略。`,
  },
  {
    id: "perf-4",
    category: "performance",
    title: "移动端 H5 内存泄漏有哪些常见场景？如何定位？",
    difficulty: "进阶",
    tags: ["内存", "泄漏", "调试"],
    answer: `**常见场景：**
- 未清除的 setInterval、WebSocket、EventBus 订阅。
- 闭包持有大数组/ DOM 引用。
- 第三方 SDK（地图、RTC、统计）未 destroy。
- Detached DOM（移出文档仍被 JS 引用）。
- 无限增长的缓存 Map（图片 blob url 未 revoke）。

**定位：**
- Chrome Performance/Memory 快照对比 Heap snapshot。
- iOS Safari Web Inspector 远程调试。
- 生产：内存指标上报 + 页签停留时长关联。

**预防：** 路由卸载统一 cleanup；WeakMap 存组件私有缓存；SDK 单例生命周期与容器绑定。`,
  },
];
