import type { QuestionDraft } from "../../types";

export const rtcQuestions: QuestionDraft[] = [
  {
    id: "rtc-1",
    category: "rtc",
    title: "WebRTC 建立音视频连接的主要流程是什么？",
    difficulty: "进阶",
    tags: ["WebRTC", "P2P", "信令"],
    keyPoints: [
      "getUserMedia → RTCPeerConnection",
      "Offer/Answer + ICE 候选交换",
      "STUN/TURN 穿透",
    ],
    answer: `**核心步骤：**

1. **采集**：\`navigator.mediaDevices.getUserMedia({ audio, video })\` 获取本地流，加到 \`RTCPeerConnection\`。
2. **信令交换**（经业务服务器，非 WebRTC 标准）：创建 PC 实例 → createOffer → setLocalDescription → 发送 SDP 给对方 → 对方 setRemote + createAnswer → 回传 SDP。
3. **ICE**：双方收集网络候选（host/srflx/relay），通过信令交换，\`addIceCandidate\`。
4. **连接**：\`connectionState\` 变为 connected 后，\`ontrack\` 收到远端流渲染到 \`<video>\`。

**NAT 穿透：**
- **STUN**：获取公网地址，尝试 P2P。
- **TURN**：中继，弱网/对称 NAT 必备，有带宽成本。

**社交产品：** 1v1 可用 P2P + TURN 兜底；语聊房/直播多用 **SFU（声网/即构）** 而非纯 P2P mesh。`,
  },
  {
    id: "rtc-2",
    category: "rtc",
    title: "声网 Agora / 即构 ZEGO 与自研 WebRTC 选型时你会关注什么？",
    difficulty: "高级",
    tags: ["Agora", "ZEGO", "SDK"],
    keyPoints: [
      "全球节点与弱网对抗",
      "音视频策略与计费",
      "与现有 IM/礼物链路集成",
    ],
    answer: `**评估维度：**

| 维度 | 说明 |
|------|------|
| 全球质量 | 中东/欧美 PoP 覆盖、跨国延迟、抗丢包算法 |
| 场景匹配 | 1v1、语聊房、PK、屏幕共享、美颜/变声 |
| SDK 形态 | Web/H5 SDK 能力边界（是否仅 Native 强） |
| 弱网 | FEC、ARQ、码率自适应、音频优先策略 |
| 成本 | 分钟计费、720p/1080p 单价、录制/转码 |
| 合规 | 数据驻留、录制合规、未成年人保护 |
| 可观测 | 通话质量 Post-call QoS、实时告警 |

**H5 高级岗：** 说明「H5 直播/连麦常走 SDK JS + CDN 拉流，重互动走 Native」。能讲清 **SDK 事件回调**（用户加入、音量指示、网络质量）与业务状态机对接。

**故障排查：** 回声（未开 AEC/耳机）、卡顿（上行带宽不足）、首帧慢（编码器/GOP）。`,
  },
  {
    id: "rtc-3",
    category: "rtc",
    title: "音视频卡顿、延迟高、回声分别可能有哪些原因？如何排查？",
    difficulty: "高级",
    tags: ["排障", "QoS", "弱网"],
    keyPoints: [
      "分上行/下行/设备/编码链路",
      "WebRTC stats / SDK 质量回调",
      "端侧与云端协同",
    ],
    answer: `**卡顿（冻结/马赛克）：**
- 上行带宽不足 → 降码率、关高清、音频优先。
- 丢包/抖动 → 开 FEC、切换 TURN、提示用户换 Wi-Fi。
- 设备发热降频、硬编失败软编 CPU 飙高。
- H5 渲染线程阻塞（主线程长任务）→ 礼物动画与播放解耦。

**延迟高：**
- 跨国 RTT、SFU 跳数过多 → 选就近接入、区域房间。
- 编码 B 帧/GOP 过大 → 低延迟配置（短 GOP）。
- 缓冲策略过大 → 直播低延迟模式减小 jitter buffer。

**回声：**
- 外放 + 麦克风形成回路 → 开 AEC、引导耳机。
- 多端同时开麦未静音。
- Native 与 H5 音频会话冲突（iOS category）。

**排查工具：** \`getStats()\` 看 packetLoss、jitter、RTT；SDK 网络质量等级；服务端推拉流日志对照。`,
  },
  {
    id: "rtc-4",
    category: "rtc",
    title: "Canvas 与 WebGL 在社交礼物/特效场景如何选择？",
    difficulty: "进阶",
    tags: ["Canvas", "WebGL", "动画"],
    answer: `**Canvas 2D：**
- 适合中等复杂度、粒子数可控的 2D 礼物、路径动画。
- 优点：API 简单、文本绘制方便；缺点：大量绘制指令 CPU 压力大。

**WebGL / WebGPU：**
- 大量粒子、滤镜、美颜、3D 头饰 → GPU 并行。
- 需要着色器能力、内存与兼容性管理；低端机需降级到静态图或 Lottie。

**工程实践：**
- 离屏 Canvas 预渲染序列帧；RAF 节流；页面隐藏时 pause。
- 与 Native 礼物（svga/mp4）分工：重特效 Native，轻量 H5 Canvas。
- **海外低端机**：检测设备 FPS，动态降级特效等级。`,
  },
  {
    id: "rtc-5",
    category: "rtc",
    title: "简述常见音视频编码格式及在 Web 端的适用场景",
    difficulty: "进阶",
    tags: ["H.264", "VP8", "AAC", "编解码"],
    answer: `**视频：**
- **H.264 (AVC)**：兼容性最好，硬编普遍，WebRTC 默认支持，直播 FLV/HLS 常用。
- **H.265 (HEVC)**：更高压缩率，但 Safari/专利/硬编支持碎片化。
- **VP8/VP9**：WebRTC 生态友好，Chrome 友好。
- **AV1**：更省带宽，编码重，逐步普及。

**音频：**
- **Opus**：WebRTC 首选，低延迟、宽码率范围。
- **AAC**：录播、HLS 主流。

**Web 端注意：**
- MediaRecorder 产出格式因浏览器而异。
- MSE 播放 fMP4 需 codec 字符串匹配；直播低延迟用 LL-HLS/WebRTC 而非传统 HLS 高缓冲。`,
  },
];
