import type { QuestionDraft } from "../../types";

export const leadershipQuestions: QuestionDraft[] = [
  {
    id: "lead-1",
    category: "leadership",
    title: "作为高级前端，如何做有效的 Code Review？",
    difficulty: "进阶",
    tags: ["Code Review", "团队"],
    keyPoints: [
      "关注正确性、可维护性、风险",
      "非风格争论",
      "知识传递",
    ],
    answer: `**Review 关注点（优先级）：**
1. 正确性与边界：空值、并发、卸载后 setState、安全（XSS、开放重定向）。
2. 性能与体验：多余渲染、大包、内存泄漏风险。
3. 架构：是否符合模块边界、是否重复造轮子。
4. 可测试性与可观测：关键路径是否有埋点/日志。
5. 风格：交给 ESLint/Prettier，减少人工争论。

**流程：**
- PR 模板：背景、方案图、测试清单、风险与回滚。
- 24h 内响应；重大改动同步评审会议。
- 新人 PR 重教学轻挑刺；高级 PR 挑战设计假设。

与 JD「带领团队突破技术瓶颈」呼应：CR 是日常技术领导力载体。`,
  },
  {
    id: "lead-2",
    category: "leadership",
    title: "海外社交产品与国内产品在技术侧重上有哪些差异？",
    difficulty: "高级",
    tags: ["海外", "本地化", "合规"],
    answer: `**差异点：**
- **网络**：跨国延迟、CDN 分区、弱网比例更高；多运营商环境复杂。
- **设备**：低端 Android 占比、屏幕比例多样；iOS 占比可能更高（欧美）。
- **文化/UI**：RTL 布局；礼物/付费习惯不同；内容审核与举报流程。
- **合规**：GDPR/CCPA 隐私、年龄验证、数据跨境；支付渠道（Google Pay、本地钱包）。
- **运营**：时区活动 peak 分散；多语言客服与错误文案。
- **技术栈**：Firebase/Adjust 等海外常用 SDK；推送 APNs/FCM 与国内厂商通道差异。

答法结合业务数据（某区域 3G 占比）比空泛罗列更有说服力。`,
  },
  {
    id: "lead-3",
    category: "leadership",
    title: "描述一次你解决重大线上性能或稳定性问题的经历（STAR）",
    difficulty: "高级",
    tags: ["STAR", "项目经验", "软技能"],
    answer: `**STAR 模板（准备真实案例）：**

- **S**：海外某区用户反馈直播间 H5 卡顿率升 30%，影响送礼转化。
- **T**：一周内将卡顿率降到基线以下并建立监控。
- **A**：用 RUM 分桶发现低端 Android + WebGL 礼物同开；降级策略 + 礼物改 Native 播放；优化主线程长任务；与后端降推拉流码率。
- **R**：卡顿率降 45%，送礼转化回升 8%，并上线设备分级配置。

**Tips：** 量化结果、说明你的 **决策权**（技术方案选型）、协作角色（Native/后端/产品）。`,
  },
  {
    id: "lead-4",
    category: "leadership",
    title: "如何在技术方案与业务交付速度之间做权衡？",
    difficulty: "进阶",
    tags: ["技术选型", "业务"],
    answer: `**原则：**
1. ** reversible 决策优先快速实现**：特性开关、模块化拆分，避免一次性过度设计。
2. **不可逆决策慎重**（数据模型、协议、核心架构）：投入调研与 POC。
3. **对齐目标**：问清 deadline、成功指标（DAU、收入、留存）。
4. **分层交付**：MVP 满足上线，债务登记 ticket 与偿还排期。
5. **沟通成本**：用原型/数据说服产品，而非纯技术立场。

高级岗展示 **业务嗅觉**：例如礼物动效可先用 Lottie 上线，再迭代 WebGL。`,
  },
  {
    id: "lead-5",
    category: "leadership",
    title: "你如何带领初中级工程师成长？",
    difficulty: "基础",
    tags: ["mentoring", "团队"],
    answer: `**方法：**
- **任务梯度**：从 bugfix → 小需求 → 独立模块，配对编程过渡。
- **文档与范例**：最佳实践 wiki、golden PR 示例。
- **技术分享**：双周分享（弱网、Bridge、RTC 排障案例）。
- **1:1**：职业目标、反馈双向；复盘线上 incident 不带锅。
- **授权与兜底**：让 owner 做主，高级 backup review 关键路径。

结合 JD「技术分享、Code Review」具体化，避免空喊「有耐心」。`,
  },
];
