# Context Engineering：让 Agent 在正确时刻看到正确工作集

## 1. DSH 中的三类上下文

至少区分：

1. **稳定系统级指导**：System Prompt sections / persona。
2. **动态运行事实**：Prompt Context、inject、当前 Session 状态。
3. **长期外部事实**：项目文件、durable Session log、业务数据。

不要把三类内容全部塞进一个超长 System Prompt。

## 2. System Prompt 与 Runtime Context 分离

DSH 的 `PromptSection` 与 `PromptContext` 分离很重要：

- Section 适合稳定身份、原则和长期行为指导。
- Context 适合随运行状态变化的模型可见事实。

生产智能体应进一步把大型项目材料留在文件/数据源中，让 Agent 按阶段读取，而不是把全文长期挂在 Prompt 中。

## 3. Context Hygiene

每个阶段问：

- 当前决策真正需要哪些文件？
- 哪些历史输出已经被 authoritative artifact 取代？
- 哪些工具结果只是探索噪声？
- 哪些规则只在某一种工具或阶段有意义？

理想状态是：Agent 需要恢复时能够通过少量 authoritative artifacts 重建工作集。

## 4. Externalized State

对于长周期生产任务，推荐把关键认知落在明确文件/结构中，例如：

```text
project_task
storyline / plan
spec / design contract
current progress
approved decisions
user feedback
```

注意：Externalized State 不是再造数据库。能用少量清晰文件解决的问题，不引入新的存储系统。

## 5. Compaction 的正确定位

DSH 将 compaction 作为独立 capability，而不是 Agent Loop 的天然组成。其作用是减轻 Session surface 压力，而不是替代项目状态管理。

因此：

- 自动压缩可以缓解上下文容量问题。
- 它不能替代 authoritative project artifacts。
- 压缩摘要不是领域状态的唯一来源。
- 关键结构应能在压缩后通过文件或 durable events 重建。

## 6. Fresh Context 与 Continuation 的区别

“fresh”解决污染问题；“continuation”解决责任主体和长期状态连续性问题。两者不是非此即彼。

一个 continuable Agent 可以在重新激活后主动重读 authoritative files，获得近似 fresh working set，同时保持同一 Session 和责任主体。

这通常比不断创建同职 Agent 更适合长期生产任务。

## 7. Context 失稳诊断顺序

出现“后半程质量下降/忘记要求/重复推理”时，依次检查：

1. 是否把过多原始材料长期保留在上下文？
2. 是否缺少 authoritative artifacts？
3. 是否阶段恢复时没有重读关键文件？
4. 是否 System Prompt 混入大量动态项目事实？
5. 是否 Tool 输出过大、探索噪声过多？
6. 是否 compaction 后关键事实无法恢复？
7. 最后才考虑增加新 Memory 系统。
