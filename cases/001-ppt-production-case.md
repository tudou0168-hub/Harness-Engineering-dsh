# Case 001 · PPT Production Agent

## 定位

PPT Production 是 DSH 在专业生产 Agent 场景中的真实案例。

不是简单聊天机器人，而是：

输入材料 → 专业 Prompt → 连续 Agent 执行 → 用户确认 → 输出物。

## 可迁移经验

1. Main 负责编排，不负责领域创造。
2. 专业任务优先保持同一 Agent 连续执行。
3. 用户确认点属于生产流程，不是额外 QA。
4. 质量问题优先检查内容、视觉、方法，不默认认为是 Runtime 问题。

## 可推广方向

同样模式可用于：

- 建设方案 Agent
- 可研 Agent
- 政策分析 Agent
- 企业知识 Agent

## 后续研究

重点研究：

- 状态管理
- UI 工作台
- 专业 Agent 模板化
- 项目产物可追踪