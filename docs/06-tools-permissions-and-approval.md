# Tools、Permissions 与 Approval

## 1. Tool 是能力，不只是函数

一个生产级 Tool 至少涉及：

- Model-visible schema
- 执行权限
- cancellation
- result 进入 Session 的方式
- UI/presentation
- 是否允许并发
- error semantics

领域项目不要把工具调用当作无副作用 RPC。

## 2. 结构性约束必须在工具层保证

例如：

- 输入 schema。
- 文件/进程访问范围。
- 不支持能力的明确拒绝。
- destructive action 的授权。

Prompt 可以提醒模型正确使用工具，但不能替代工具自身的安全与契约。

## 3. Approval 的核心模式

DSH approval 使用 closed outcomes：

```text
allowed-once
rejected
cancelled
unavailable
```

只有 `allowed-once` 是授权；其余都不能静默放行。

工程模式是：**fail closed + one-shot grant + durable audit**。

## 4. 业务确认与安全 Approval 分离

“用户确认设计方向”与“允许执行危险 shell”不是一种机制。

- 业务确认改变项目方向，应由领域 Orchestrator/Session 流程表达。
- 工具安全授权应由 Approval capability 表达。

混用会导致流程语义混乱。

## 5. 并发默认保守

对有副作用的工具，不应仅因“模型同时调用了多个”就并行。只有工具明确声明并发安全时才并行。

对领域智能体尤其重要：文件生成、最终导出、状态写入、发布等操作通常需要明确序列化。
