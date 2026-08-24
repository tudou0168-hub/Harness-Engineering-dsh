# 08 · Agent Observability：下一阶段不要再靠“感觉 Agent 跑偏了”定位问题

## 结论先行

随着 DSH 项目从单次聊天进入长任务、专业 Agent、企业工作台，调试方式必须从：

```text
看最终回答好不好
```

升级为：

```text
这一次 Turn 实际给模型看了什么？
模型调用了什么 Tool？
每一步耗时多少？
Token 消耗在哪里？
哪个上下文注入导致行为变化？
```

社区已经出现 OpenTelemetry tracing 插件，把一个 Agent Turn 转成 GenAI Span Tree，覆盖 step、LLM call、TTFT、Tool execution、token usage，并可导出到 Jaeger、Grafana Tempo、SigNoz、Langfuse 等 OTLP 后端。

这对 PPT Production、文档 Agent 和长任务研发非常有价值。

---

## 一、为什么现有调试方式不够

真实项目中常见这类判断：

- “这次 Agent 怎么突然不听 Prompt 了？”
- “上次可以，这次又不行。”
- “是不是 Context 太长？”
- “是不是 Skill 没加载？”
- “是不是 Designer 恢复之后忘了设计规范？”

如果没有 tracing，这些只能靠猜。

而专业生产系统不能长期靠猜。

---

## 二、应该观察哪些层

建议未来统一观察四层：

### 1. Request Context

记录：

- system prompt sections
- runtime snapshot
- agent instructions
- skill catalog
- project instructions
- coordinator relay

目的：回答“模型实际看到了什么”。

### 2. LLM Calls

记录：

- model
- duration
- TTFT
- input/output token
- retry / error

目的：回答“慢在哪里、贵在哪里”。

### 3. Tool Execution

记录：

- tool name
- arguments 摘要
- duration
- result status
- error

目的：回答“是模型判断错，还是工具执行错”。

### 4. Agent / Session Lifecycle

记录：

- turn
- step
- child agent
- continuation
- pause / resume
- final state

目的：回答“长任务在哪个生命周期点断了”。

---

## 三、对 PPT Production 的直接价值

PPT 项目目前遇到的很多问题可以分成两类：

### A. 质量问题

例如：

- 页面视觉不够好；
- 没有回看修复；
- 模板继承不足；
- 设计风格变形。

这种问题主要查 professional prompt、设计流程、render/inspect、视觉复核。

### B. Harness 执行问题

例如：

- 没有真正加载 Preset；
- child context 不完整；
- resume 后关键设计文件没重读；
- tool 暴露发生变化；
- coordinator 指令覆盖专业 Prompt。

这种问题 tracing 非常适合定位。

所以以后不能把所有 PPT 失败都归因于“DSH 不稳定”，也不能把所有失败都归因于“PPT Master 设计不好”。

需要证据区分。

---

## 四、建议建立的最小诊断面板

Laoli Workspace 不需要一开始上完整 Grafana。

V1 只需要一个 Agent Inspector：

```text
当前 Session
├─ Model
├─ Prompt Sections
├─ Skills Loaded
├─ Tools Visible
├─ Current Step
├─ Last Tool Calls
├─ Token Usage
├─ Turn Duration
└─ Errors / Warnings
```

这会比增加一个 Reviewer Agent 更有价值。

Reviewer 只能再给一个意见；Inspector 可以告诉我们系统真实发生了什么。

---

## 五、与 Context Doctor 的组合

Observability 与 Context Doctor 解决不同问题：

```text
Context Doctor
  → 静态/半静态分析“上下文结构是否臃肿、冲突、重复”

Tracing
  → 运行时分析“这一 Turn 实际发生了什么”
```

两者组合后，可以形成：

```text
设计时 Context Audit
        +
运行时 Trace
        ↓
Agent 生产诊断体系
```

---

## 六、不要过度工程化

当前阶段不建议：

- 自建完整可观测平台；
- 自建新的 tracing 协议；
- 每个项目做不同日志体系。

优先：

- 采用 OpenTelemetry 标准；
- DSH Plugin 负责导出；
- UI 只展示真正需要的诊断字段。

---

## 七、研发判断

下一阶段 Laoli Workspace 的“个人工作台”不应只有漂亮 UI。

真正能提高研发效率的是：

```text
Project View
+ Artifact View
+ Browser/Evidence View
+ Agent Inspector
```

其中 Agent Inspector 应作为基础设施，而不是后期补丁。

最终目标不是为了监控而监控，而是让出现问题时可以快速回答：

> **问题到底发生在 Prompt、Context、Tool、Agent Lifecycle，还是专业产物质量层。**