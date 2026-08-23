# 007 · DSH 桌面工作台案例：从聊天框到个人 AI 操作台

## 结论先行

`vibeinging/deepseek-harness-desktop-app` 是目前最接近“个人 AI 工作台”目标的社区实现之一。它最值得借鉴的不是 Electron 外壳，而是一个架构原则：**不复制第二套 Agent Runtime，而是把 DSH Session、Agent、Tool、Skill、MCP、Profile Bundle 作为运行真相，再在其上组织项目、文件、浏览器、Office 产物与证据视图。**

这对后续自定义 UI 的意义很直接：Laoli Workspace 不应自己再造 Session / Agent / Tool Runtime，而应该围绕 DSH 的既有运行链做产品层投影。

---

## 1. 这个项目真正解决什么问题

它把以下内容放进一个桌面工作空间：

- DSH Session 与对话；
- Agent、Tool、Skill、MCP、Profile Bundle；
- 项目与文件；
- Browser Workspace；
- Git Worktree；
- Canvas / Site；
- Markdown、DOCX、XLSX、PPTX、PDF 等 Office 产物；
- 当前 Session 的完整轨迹、工具输入输出、耗时和 Token。

其 README 明确强调：右侧“结果与证据”直接读取绑定 Session 的 `session.history`，**不维护第二套运行中心**。

这比“做一个新的漂亮聊天 UI”高级得多，因为它先确定了**运行时的单一真相源**。

---

## 2. 最值得借鉴的五个设计

### 2.1 一个项目对话 = 一个 DSH Session

项目、聊天和 Agent 执行不是三套对象，而是显式绑定。

适合我们抽象成：

```text
Project
  └─ Session
      ├─ Agent
      ├─ Tool Calls
      ├─ Artifacts
      └─ Evidence
```

这样以后做 PPT、方案、研究、自媒体内容时，所有结果都能从 Session 追溯。

### 2.2 “结果与证据”来自 Session History

这是非常关键的产品原则。

不要另建一套：

```text
运行记录数据库
任务执行日志数据库
Agent 历史数据库
```

除非真实业务证明必须需要。

优先：

```text
DSH session.history
      ↓
UI projection
      ↓
结果 / 轨迹 / 工具 / Token / 证据
```

这与我们的“做减法”方向高度一致。

### 2.3 产品状态和 Agent 状态分层

该项目没有把所有产品状态塞进 DSH Session。

例如：
- 项目文件权限；
- Browser Workspace；
- Git Worktree；
- 产物版本；

这些属于产品层。

而：
- Agent 执行；
- Tool；
- Skill；
- Session；

属于 DSH Runtime。

这个边界值得直接采用。

### 2.4 Browser 不是普通网页标签，而是 Agent Research Workspace

项目提供多标签浏览、网页快照和“使用此页”。

这提示我们：未来“网上抓数据 / 研究 Agent”不应只是暴露一个 Playwright Tool，还应在 UI 上有可见的：

- 当前研究页面；
- 采集来源；
- 页面快照；
- 证据引用；
- 研究结果。

### 2.5 Office Artifact 是一级对象

项目直接把 Office 产物放在工作台里，不把 PPT / Word 当作对话附件。

这非常适合我们的专业 Agent：

```text
PPT Agent → PPT Artifact
方案 Agent → DOCX Artifact
数据 Agent → XLSX Artifact
研究 Agent → Report Artifact
```

UI 需要围绕“产物”而不是只围绕“消息”。

---

## 3. 哪些东西不应该照抄

### 3.1 不需要马上做桌面壳

Electron / Tauri 只是交付形态，不是核心价值。

第一版 Laoli Workspace 应优先在 DSH Web Plugin / Client UI 层验证业务工作台。

### 3.2 不要一次把 Browser、Canvas、Site、Worktree 全部复制

我们的真实高频场景是：

1. PPT；
2. 公文 / 方案；
3. 研究 / 抓取；
4. 自媒体内容；
5. 项目资料与产物。

优先服务这些场景。

### 3.3 不要重复造 Plugin Center

DSH 自身还在 Developer Preview，插件生态变动很快。自己的工作台可以展示和选择 Profile，但不必马上建立新的插件市场。

---

## 4. 对 Laoli Workspace 的直接方案

建议 V1 固定四区：

### 左侧：Projects

- 项目列表；
- 专业 Agent 类型；
- 最近 Session；
- 状态。

### 中间：Conversation / Work Area

继续使用 DSH 原生会话与运行能力。

### 右侧：Project Inspector

建议 Tab：

- 状态；
- 文件；
- 产物；
- 证据；
- Prompt / Skill；
- 执行记录。

### 底部 / 辅助层：Runtime

展示：
- Agent；
- Tool 调用；
- Token；
- 当前阶段；
- 错误与诊断入口。

---

## 5. 与现有专业 Agent 的映射

### PPT Production

右侧应显示：
- source；
- professional prompt；
- storyline / design spec；
- pioneer；
- 当前页；
- PPTX / PNG / notes 等 Artifact。

### 公文 / 建设方案 Agent

右侧应显示：
- 原文档；
- 客户变更；
- 修改范围；
- 用户确认；
- 修改结果；
- 对比 / 批注。

### 自媒体 Agent

右侧应显示：
- 选题；
- 数据源；
- 引用；
- 脚本；
- 素材；
- 各平台版本；
- 数据复盘。

### Research Agent

右侧应显示：
- 浏览页面；
- 来源；
- 抓取结果；
- 证据；
- 研究笔记；
- 最终结论。

---

## 6. 架构结论

未来自定义 UI 最重要的不是“改成什么视觉风格”，而是保持三个单一真相源：

```text
DSH Session = 执行真相
Project Files / Artifacts = 工作成果真相
UI = 两者的投影与操作入口
```

只要坚持这一点，就能避免重新造一个与 DSH 争夺状态权威的第二套系统。

## 参考

- https://github.com/vibeinging/deepseek-harness-desktop-app
- DeepSeek Harness 官方 extension cookbook（UI plugin 使用 session/event，并通过 agent.followup / agent.steer 驱动输入）
