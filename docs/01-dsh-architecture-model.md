# DSH 架构模型：可组合 Agent Harness，而不是固定 Agent 产品

## 1. 总体判断

DeepSeek Harness 的核心不是一个不可修改的 Agent Loop，而是 Cordis 上的插件树。Session、System Prompt、Tools、Agent、Agent Loop、LLM Adapter、Preset、Subagent、Compaction、Approval 等分别由不同 package/能力拥有。

这意味着领域智能体最重要的架构问题不是“怎么改 Loop”，而是“把需求放到正确的扩展点”。

## 2. 核心 spine

当前 `0.1.0-rc.8` 的主链可以抽象为：

```text
Session (事实源)
   ↑
Agent / Inbox
   ↓
Agent Loop
   ↓
System Prompt + Runtime Context + Tool Schemas
   ↓
LLM Adapter
   ↓
Assistant Output
   ↓
Tool Pipeline
   ↓
Session append
```

关键事实：

- `Session` 是 append-only typed event log。
- 模型 history 由 Session log 派生，而不是维护另一份“对话状态”。
- `request/header` 记录模型请求所需的 system prompt、tool schemas、model config，使请求可重建。
- `Agent` 暴露 inbox、followup、steer、inject、cancel、whenIdle 等统一运行接口。
- `agent-loop` 是 `Agent` 的具体默认实现，但扩展插件应依赖 `agent`，不是直接依赖 loop。

## 3. 插件优先于 Loop 修改

DSH 根 `AGENTS.md` 明确要求：新增行为应挂在文档化的 extension point；修改 `agent-loop` 是高门槛行为。

对生产智能体的含义：

- 新工具 → `ctx.tools`
- 新模型能力 → LLM adapter
- 单 Session 不同能力组合 → agent preset
- 运行时模型上下文 → prompt context / inject
- 拦截请求或工具 → `agent/*` / `tools/*` events
- 长任务子执行 → subagent capability
- 长上下文处理 → compaction capability
- 用户许可 → approval capability

如果一个领域项目重新实现这些机制，通常说明分层位置错了。

## 4. Scope 是领域智能体隔离的基础

DSH 的 per-agent scope 让同一进程中的不同 Agent 拥有不同 Prompt、Tool 和局部能力，同时共享进程级设施。

这比“为每个业务智能体起一套完整 Runtime”更轻，也更符合 Harness Engineering：共享稳定基础，按 Agent 组合差异。

## 5. Capability Seam 思维

DSH 把可替换能力拆成：

- Service Definition
- Service Provider
- Consumer

这适合真正需要替换实现的结构性能力，例如 shell、subagent、compaction。

领域业务逻辑不应为了“架构漂亮”滥用 seam。只有当多个实现确实需要在同一模型契约下切换时，才值得形成 capability seam。

## 6. 对生产智能体的首要指导

优先判断需求属于哪一层：

```text
行为方法        → Prompt / Skill
每会话组合      → Preset
动态事实        → Runtime Context / inject / durable project files
模型能力        → Tool / Adapter
生命周期        → Agent / Session / Subagent continuation
权限            → Approval / policy
长上下文        → Compaction / externalized state
跨阶段业务流程  → 薄 Orchestrator，调用上述原生能力
```

只有找不到合适扩展点时，才考虑修改 DSH Core。
