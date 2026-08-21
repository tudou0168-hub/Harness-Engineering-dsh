# Harness Engineering for DeepSeek Harness

面向生产智能体研发的 DeepSeek Harness 工程研究库。

本项目以 `deepseek-harness` 的真实工程实现为主要研究对象，结合公开发布包、构建产物与可获得的 Source Map / 源码还原结果进行交叉验证，从实现中提炼可复用的 Harness Engineering 原则，而不是复刻官方产品文档。

## 研究目标

本项目回答四类问题：

1. DeepSeek Harness 实际如何驱动 Agent：Session、Agent Loop、System Prompt、Tools、Preset、Subagent、Compaction、Approval 等能力如何协同。
2. 哪些实现属于可迁移的 Harness Engineering 模式，哪些只是 DSH 的具体产品选择。
3. 生产智能体出现上下文漂移、职责越界、长任务失稳、权限失控、重复工程化或质量不稳定时，应优先修改哪一层。
4. 如何在尽量不修改 Agent Loop、不堆叠额外 Runtime 的前提下，利用 DSH 原生扩展点构建稳定的领域生产智能体。

## 当前研究基线

- 研究对象：`tudou0168-hub/deepseek-harness`
- 上游：`deepseek-ai/deepseek-harness`
- 当前公开版本：`0.1.0-rc.8`
- 基线提交：`141eb6fef83422698aef7a981029e843e8161534`
- 对照研究：`ZhangHanDong/harness-engineering-from-cc-to-ai-coding`
- 建库时间：2026-08-21

版本更新时，不覆盖旧结论；新增版本基线并标记哪些模式仍成立、哪些实现已经变化。

## 目录

```text
.
├── README.md
├── AGENTS.md
├── docs/
│   ├── 00-research-method.md
│   ├── 01-dsh-architecture-model.md
│   ├── 02-harness-engineering-principles.md
│   ├── 03-context-engineering.md
│   ├── 04-agent-lifecycle-and-continuation.md
│   ├── 05-prompt-preset-skill.md
│   ├── 06-tools-permissions-and-approval.md
│   ├── 07-observability-and-production-validation.md
│   └── 08-production-agent-design-guide.md
├── evidence/
│   └── README.md
├── studies/
│   └── README.md
└── decisions/
    └── README.md
```

## 研究原则

- **真实实现优先**：源码、发布包、构建产物、Source Map、可复现实验优先于二手解释。
- **当前版本优先**：每项结论绑定版本或 commit，避免把历史实现当成当前事实。
- **模式与实现分离**：先描述 DSH 实际怎么做，再提炼可迁移模式，最后判断是否适用于目标智能体。
- **组合优先于改核**：Prompt、Preset、Skill、Context、Tool、Session、已有事件扩展点能解决的问题，不修改 Agent Loop。
- **只为重复问题增加机制**：单个项目、单次失败不自动升级为系统规则。
- **生产质量优先**：流程 PASS 不是最终目标，最终产物质量和稳定性才是判断依据。

## 目前已经确认的 DSH 原生事实

- DSH 是插件化 Harness，Agent Loop 本身也是可替换实现；官方开发规范明确要求新增行为优先挂载到既有扩展点，而不是修改 Loop。
- Session 是 append-only event log，是 Agent 交互历史的单一事实源；模型历史从日志派生。
- System Prompt、动态 Runtime Context 和 Tool Schema 分层组装，并可按 Agent scope 覆盖。
- Preset 是 per-session agent composition，不是第二套 Agent Loop。
- Subagent 是可选 capability seam，支持一次性与 continuable 等不同执行语义；continuable child 以持久 Session 为身份，而不是一次性 Task。
- Compaction 是独立能力，不属于 Agent Loop 核心；压缩结果和替换过程进入 durable log。
- Approval 是独立能力，采用 closed outcome 和 fail-closed 语义，并把策略变化记录到 Session。

这些特性决定了生产智能体的首选设计方向应是“组合 DSH 原生能力”，而不是为每个领域再实现一套 Runtime。

## 使用方式

研发或修正一个生产智能体时，先阅读：

1. `docs/01-dsh-architecture-model.md`
2. `docs/02-harness-engineering-principles.md`
3. `docs/08-production-agent-design-guide.md`

再根据问题类型进入 Prompt、Context、Lifecycle、Tools/Permission 或 Observability 专题。

本项目不是 DSH 官方文档，也不代表 DeepSeek 官方立场；它是面向生产智能体研发的工程研究与决策基线。
