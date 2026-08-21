# Agent Lifecycle 与 Continuation

## 1. Agent 不是一次请求

DSH 的 Agent 有独立 identity、Session、Inbox、status 和 scoped context。模型一次调用只是一个 step；一个 turn 可以包含多个 step；一个 Agent 生命周期可以包含很多 turn。

生产智能体设计不要把“Agent = 一次 prompt”。

## 2. Inbox 是唯一输入排队入口

`followup`、`steer`、`inject` 有不同的时序语义：

- `followup`：普通下一 turn。
- `steer`：尽快在最近 step boundary 注入并可唤醒。
- `inject`：模型可见 context，但不主动唤醒 idle Agent。

Orchestrator 应选择正确语义，而不是统一用“发消息”。

## 3. Continuable Subagent

DSH 的 continuable child 核心不是“一次 Task 返回结果”，而是：

```text
persistent child Session
→ optional live Activation
→ retained AgentHandle
→ Inbox 承接多个 turn
```

这特别适合：

- 一个领域专家需要跨多个用户确认继续工作。
- 中间阶段必须暂停，但专业上下文和责任主体不能替换。
- 后续修改应该由原 Agent 继续，而不是新 Agent 猜前人的意图。

## 4. 什么时候 fresh restart

只有当“责任主体对应的核心方向失效”时才 restart，例如：

- 任务目标根本变化。
- 设计/架构方向整体推翻。
- 原 Session 污染到无法可信恢复，且 authoritative artifacts 也不足以重建。

普通局部修订不应该 fresh restart。

## 5. 不要复制生命周期状态机

DSH 已经有 Agent status、Session events、Inbox 和 continuation manager。领域 Orchestrator 只记录业务阶段，不应再复制“running/waiting/settled”等底层执行状态。

## 6. 多 Agent 的判断标准

新增 Agent 必须至少满足一项：

- 独立责任主体。
- 独立权限/工具集。
- 并行收益显著且结果可合并。
- 需要隔离探索噪声。
- 独立验证必须避免生产者修改结果。

如果只是为了“把一个大任务切几个阶段”，优先同一 Agent continuation。
