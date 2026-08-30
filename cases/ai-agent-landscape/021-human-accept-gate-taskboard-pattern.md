# 021 · Human Accept Gate Taskboard Pattern

## 目标

研究 DSH Taskboard 类插件如何把 Agent 工作、人工验收和 Session 执行边界分开。

## 代表案例：DSH-taskboard

该插件采用本地 SQLite 保存项目、任务、评论、关系、附件与工作流，同时明确：Agent Session、Goal、Workspace、工具、权限和对话历史仍由 Harness 管理。

最值得借鉴的是人工验收边界：Agent 可以把已经验证的工作提交到 `in_review`，但只有认证用户才能将任务验收为 `done`。

## 工程价值

这给出一个非常清晰的职责分工：

```text
Harness
负责执行与会话真相

Taskboard
负责任务业务状态

Agent
负责执行和提交审核

Human
负责最终验收
```

## 对 Laoli Workspace 的启发

不需要把所有专业 Agent 强行塞进统一 Workflow。公共层只需要统一：

```text
Task
Session
Artifact
Review State
Human Accept
```

例如 PPT：

```text
制作中
→ Agent 自检完成
→ in_review
→ 用户看先锋页/最终成品
→ done
```

文档方案：

```text
修改中
→ 回读与检查完成
→ in_review
→ 用户确认修改范围与正式稿
→ done
```

## 反模式

- Agent 自己宣布任务 `done`。
- UI 自己维护第二套 Session 状态。
- 为了“项目管理”重做 Harness Runtime。
- 把人工验收变成一个新的 Reviewer Agent。

## 结论

对高价值专业产物，最小有效治理不是增加 Reviewer，而是建立明确的 **Agent Submit → Human Accept** 边界。
