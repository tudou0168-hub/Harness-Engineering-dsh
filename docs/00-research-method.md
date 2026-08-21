# 研究方法：从真实实现提炼 Harness Engineering

## 1. 研究对象不是“产品说明”，而是运行机制

本项目不以“DSH 有什么功能”为主线，而以一条真实模型请求如何被构造、执行、记录、继续、压缩、授权和恢复为主线。

核心问题不是“有没有某功能”，而是：

- 谁拥有状态？
- 哪一层可以修改它？
- 哪些信息会进入模型上下文？
- 哪些行为通过 Prompt 控制，哪些必须由代码保证？
- Session 关闭、Agent pause/resume、工具失败、Context overflow 时，系统如何保持一致？

## 2. 五步研究法

### Step A：锁版本

每次研究记录：

- DSH version
- repository commit
- package path
- public package version（如适用）
- artifact hash（如有）

不使用“最新版 DSH 一直如此”这种无版本结论。

### Step B：建立运行路径

优先沿真实路径读取：

```text
User/Input
→ Agent Inbox
→ turn/start
→ agent/pre-step
→ prompt + tools assembly
→ request/header
→ llm stream
→ assistant/message
→ tool/call
→ tools execution
→ tool/result
→ step/end
→ turn/end
```

然后再研究分支能力：Preset、Skill、Subagent、Compaction、Approval、Hooks、Workflow。

### Step C：发布包 / Source Map 对照

当研究的问题涉及“公开发布后模型实际运行的代码”时，不能只看仓库源码。应获取对应版本的发布 tarball，记录文件列表和 hash；如果发布物包含 Source Map，则对关键 bundle 进行映射，确认构建后模块边界、dead-code elimination、入口组合与源码一致性。

如果发布物不包含 Source Map，则只能称为“发布包静态分析”，不能写成“Source Map 还原”。

### Step D：从事实抽象模式

每个实现事实提炼时至少分四层：

1. **Implementation Fact**：DSH 当前怎么做。
2. **Engineering Intent**：这种设计解决什么工程问题。
3. **Reusable Pattern**：可迁移到其他生产智能体的模式。
4. **Applicability Boundary**：何时不该套用。

### Step E：回到真实生产智能体验证

任何模式只有在目标智能体中解决重复问题，才升级成项目规则。

验证顺序：

```text
真实问题
→ 定位属于 Prompt / Context / Tool / Lifecycle / Permission / Product Logic 哪一层
→ 复用 DSH 原生机制
→ 最小改动
→ 完整生命周期回归
→ 观察最终产物
```

## 3. 证据记录格式

建议专项研究附表：

| 字段 | 内容 |
|---|---|
| Baseline | DSH version + commit |
| Primary source | 源码路径 + symbol |
| Runtime artifact | package/tarball/bundle/hash |
| Source map | 有/无；路径/hash |
| Reproduction | 命令或最小运行场景 |
| Finding | 观察到的事实 |
| Pattern | 提炼的工程模式 |
| Boundary | 适用边界 |
| Production impact | 对目标智能体的影响 |

## 4. 研究反模式

- 从 README 直接推导运行时事实。
- 看到一个 class/function 就推断完整生命周期。
- 只研究 happy path，不看 cancel、resume、unload、overflow、permission unavailable。
- 把 Claude Code 的设计直接移植到 DSH。
- 把“我们希望系统如此”写成“DSH 就是如此”。
- 为了研究完整而复制官方文档，而不是建立工程判断。
