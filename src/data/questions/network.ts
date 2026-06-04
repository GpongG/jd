import type { QuestionDraft } from "../../types";

export const networkQuestions: QuestionDraft[] = [
  {
    id: "net-1",
    category: "network",
    title: "WebSocket 与 HTTP 长轮询、SSE 相比，在 IM 场景各有什么优劣？",
    difficulty: "进阶",
    tags: ["WebSocket", "IM", "SSE"],
    keyPoints: [
      "双向、低头部开销",
      "代理/防火墙与心跳保活",
      "降级方案",
    ],
    answer: `**WebSocket：**
- 全双工、帧开销小，适合 IM、礼物信令、在线状态。
- 需处理心跳、重连、鉴权（URL token 或首帧 auth）。
- 部分企业代理/老旧 CDN 支持差，需降级。

**SSE（Server-Sent Events）：**
- 单向服务端推送，HTTP/2 友好，自动重连。
- 不适合客户端高频上行（如打字上报），IM 常作辅助通道。

**长轮询：**
- 兼容性强，延迟与服务器压力大，作兜底。

**海外实践：** 多区域接入点 + TLS；消息序号与 ack 去重；弱网时合并推送、拉取补偿（sync 接口）。`,
  },
  {
    id: "net-2",
    category: "network",
    title: "如何设计高并发下的长连接保活与重连策略？",
    difficulty: "高级",
    tags: ["长连接", "重连", "心跳"],
    keyPoints: [
      "指数退避 + 抖动",
      "前后台切换与网络变化",
      "消息补偿与幂等",
    ],
    answer: `**心跳：**
- 客户端每 30s ping（根据服务端 idle timeout 调整）；服务端 pong 或应用层 heartbeat。
- 移动端考虑 **省电**：后台拉长间隔或断开，前台立即重连并 sync。

**重连：**
- 指数退避：1s → 2s → 4s … 上限 30s，加 **随机抖动** 防惊群。
- 监听 \`online/offline\`、Native 网络变化 Bridge。
- 重连成功后带 **lastSeq** 拉增量；客户端本地去重（messageId）。

**高并发服务端（了解即可）：**
- 连接分片、网关无状态、Redis 存路由。
- 限流与鉴权在握手阶段完成。

**H5 特有问题：** 页签后台节流定时器 → 依赖 Page Visibility + Native 保活；Safari ITP 不影响 WSS 但影响 cookie 会话。`,
  },
  {
    id: "net-3",
    category: "network",
    title: "IM 消息顺序、可靠性、已读回执如何在前端保证体验？",
    difficulty: "高级",
    tags: ["IM", "消息队列", "已读"],
    answer: `**顺序：**
- 会话内单调递增 seq；展示层按 seq 排序，乱序到达先缓冲。
- 发送中消息本地临时 id，服务端 ack 后替换为正式 id。

**可靠性：**
- 至少一次投递 + 客户端幂等（messageId 去重）。
- 发送失败入 **Outbox 队列**，重试带退避；用户可手动重发。
- 拉取历史分页 + 空洞检测（seq 跳号触发补拉）。

**已读回执：**
- 进入视口（IntersectionObserver）批量上报已读，节流 500ms。
- 群聊区分「已读人数」与「最后已读位置」降低写压力。

**体验：** 乐观更新、失败红叹号、弱网草稿箱；海外时区显示本地时间 + 相对时间。`,
  },
  {
    id: "net-4",
    category: "network",
    title: "海外弱网环境下 API 与静态资源请求如何优化？",
    difficulty: "进阶",
    tags: ["弱网", "CDN", "海外"],
    keyPoints: [
      "多 CDN / 区域域名",
      "超时、重试、请求优先级",
      "Body 压缩与协议选择",
    ],
    answer: `**网络层：**
- 区域 CDN、Anycast、核心 API 与静态资源分域名。
- HTTP/2 多路复用；关键接口 HTTP/3 试点（视 CDN 支持）。
- 超时区分：读超时 15s、关键支付接口更短_fail fast。

**协议与数据：**
- Brotli/Gzip；protobuf 或精简 JSON 字段名。
- 图片 WebP/AVIF 多规格；头像用小图占位。

**策略：**
- 请求优先级：首屏配置 > 列表 > 预加载资源。
- 弱网检测（RTT、downlink）降级：关自动播放、减图片质量、延迟非关键请求。
- 离线缓存（Service Worker）谨慎：社交实时性高，适合静态壳 + 配置。

与 JD 中「中东/欧美市场」结合：测速选路、跨国专线成本与体验平衡。`,
  },
];
