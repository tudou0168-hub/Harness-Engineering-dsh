# AGENTS.md

本仓库是 DeepSeek Harness 的 Harness Engineering 研究与生产智能体设计基线，不是 DSH 官方文档镜像。

## 工作顺序

任何研究或设计任务先执行：

1. 确认研究对象的 DSH 版本、commit 和相关 package。
2. 优先读取真实源码与当前仓库内对应 docs / Agent Notes。
3. 涉及公开发布行为时，补充 npm/public release artifact；存在 Source Map 时再做 Source Map 还原，不把猜测称为还原结果。
4. 把“观察到的实现事实”“工程解释”“可迁移原则”“对目标智能体的建议”分开写。
5. 只有稳定结论进入 `docs/`；探索过程放 `studies/`；证据索引放 `evidence/`；正式研发取舍放 `decisions/`。

## 证据优先级

从高到低：

- E1：目标版本真实源码、构建产物、发布包、Source Map、可复现实验。
- E2：DSH 仓库内当前 architecture / subsystem / package README / implemented Agent Note。
- E3：commit / PR / postmortem，用于解释变化原因和历史。
- E4：外部逆向研究，例如《驾驭工程：从 Claude Code 源码到 AI 编码最佳实践》。只用于比较和启发，不作为 DSH 实现事实的唯一证据。
- E5：研究者推断。必须显式标记“推断”，不能写成实现事实。

## 研究写作要求

每个专项研究至少回答：

- 它解决什么真实问题？
- DSH 当前实际怎么实现？
- 状态和事实由谁拥有？
- 模型可见信息来自哪里？
- 哪些内容 durable，哪些仅 live？
- 失败与取消如何表现？
- 哪个扩展点是正确接入位置？
- 哪些改法属于反模式？
- 对生产智能体有什么迁移价值？
- 什么情况下不要使用该模式？

## 生产智能体设计默认原则

- 不因领域需求直接修改 Agent Loop。
- 不复制 DSH 已有 Session、Context、Compaction、Permission、Subagent 生命周期。
- 行为策略优先放 Prompt / Skill / Preset / scoped context；结构性能力使用 capability seam / tool / event。
- Main/Coordinator 只承担必要协调，不自动演化为第二个领域专家。
- 不以“增加 Agent 数量”作为默认扩展方式。
- 长任务优先研究 continuation、durable session、externalized state 和 context hygiene。
- 人工确认应是业务生产过程或高风险操作边界，而不是为了制造 QA 流程。
- Reviewer/Verifier 只有在独立性带来明确价值时存在；默认只读，不成为生产状态拥有者。
- 真实项目中的重复失败优先于理论上的潜在问题。

## 禁止

- 不把外部项目的结论直接写成 DSH 事实。
- 不为了“完整”复制官方文档。
- 不建立与 DSH 原生机制平行的第二套状态机、Session、Tool Registry 或 Agent Runtime，除非源码证据证明原生能力不能满足需求。
- 不因一次失败增加 checker、gate、reviewer 或额外 Agent。
- 不删除证据版本信息。
