# 07 · 自定义 UI 架构原则：基于 DSH，而不是包住 DSH

## 目标

为后续 Laoli Workspace、PPT Workspace、政务智能体工作台建立一套最小但稳定的 UI 架构原则。

本文件结合 DeepSeek Harness 官方 Extension Cookbook 与社区 Desktop Workspace 案例，解决一个核心问题：**自定义 UI 到底应该接 DSH 的哪里，哪些状态应该自己管，哪些绝不能再造一套。**

---

## 一、官方已经给出的稳定思路

官方 Extension Cookbook 对 UI Plugin 的描述很清楚：

- UI 从 `session/event` feed 获取运行事件；
- assistant token stream、turn / step 边界、Tool activity 都可以成为 UI 投影来源；
- 用户输入通过 `agent.followup()` / `agent.steer()` 重新进入 Agent 运行链；
- 如果是内置 Web Client 中的业务行 / conversation node，则通过官方 Conversation Node 机制注册。

因此 UI 的角色应该是：

```text
Session / Agent Runtime
       ↓ events
      UI
       ↓ followup / steer
Session / Agent Runtime
```

而不是：

```text
自研 UI
  ↓
自研任务状态机
  ↓
自研 Agent Runtime
  ↓
再调用 DSH
```

后一种架构会把 DSH 降级成一个模型执行器，等于浪费 Harness 本身的价值。

---

## 二、必须坚持的三个单一真相源

### 1. Session 是执行真相

保存：
- 对话；
- 模型输出；
- Tool 调用；
- Turn / Step；
- 运行轨迹。

UI 只投影，不复制。

### 2. Project / Artifact 是业务成果真相

保存：
- 输入资料；
- 外部状态文件；
- 中间产物；
- DOCX / PPTX / XLSX / PNG / Markdown 等成果；
- 项目级配置。

它们不应该全部塞进 Conversation History。

### 3. Profile / Preset / Skill / Tool 是能力配置真相

UI 可以选择和展示这些能力，但不应在前端再复制一份“伪配置”。

---

## 三、自定义 UI 的推荐结构

```text
┌──────────────┬─────────────────────────┬──────────────────┐
│ Project Rail │ Conversation / Work Area│ Project Inspector│
│              │                         │                  │
│ 项目         │ DSH Session             │ 状态             │
│ Agent 类型   │ Agent Runtime           │ 文件             │
│ 最近会话     │ 用户输入                │ 产物             │
│              │                         │ 证据             │
│              │                         │ Agent Inspector  │
└──────────────┴─────────────────────────┴──────────────────┘
```

这比重新设计一个全新的“AI 系统门户”风险低得多，也更容易随着 DSH 升级。

---

## 四、普通用户视图与开发者视图必须分开

### 普通生产视图

只显示：
- 任务；
- 当前阶段；
- 输入；
- 产物；
- 用户确认点；
- 错误提示。

### Developer / Agent Inspector

显示：
- Session；
- Preset；
- Model；
- Skills；
- Tools；
- MCP；
- Context；
- Event / Tool trace；
- externalized state。

这样既能保持工作台简洁，又能满足研发时快速定位。

---

## 五、专业 Agent 不需要统一内部流程

未来 Workspace 可以统一这些产品对象：

```text
Project
Session
Artifact
Checkpoint
Evidence
```

但不能强制所有 Agent 使用同一套 Workflow。

例如：

### PPT Agent

```text
理解 → 内容导演 → 视觉导演 → Pioneer → 用户确认 → 设计 → 导出
```

### 文档方案 Agent

```text
理解原文 → 理解变更 → 给修改意见 → 用户确认 → 编写 / 修改 → 对比交付
```

### Research Agent

```text
问题拆解 → 搜索 → 抓取 → 证据 → 交叉验证 → 结论
```

UI 统一“状态如何展示”，不统一“专业工作怎么做”。

---

## 六、第一版 Laoli Workspace 应该明确砍掉什么

V1 不做：

- 新 Session 引擎；
- 新 Agent Runtime；
- 新插件市场；
- 新数据库状态机；
- 全量多 Agent 编排平台；
- 复杂 RBAC；
- 桌面壳优先。

V1 只验证：

1. DSH Session 能否稳定绑定 Project；
2. Project Inspector 能否展示真实文件 / Artifact；
3. UI 能否显示关键 Agent Runtime 状态；
4. PPT / 文档 / Research 三类 Agent 是否能共用工作台外壳；
5. 用户确认点能否自然呈现。

---

## 七、版本兼容策略

DeepSeek Harness 当前仍明确标记为 Developer Preview，并声明会发生兼容性破坏变化。

因此：

### 应该

- 尽量使用官方 extension seam；
- Profile / Bundle 挂载；
- Session event；
- Agent followup / steer；
- 官方 conversation extension；
- 对社区插件固定版本 / commit 研究。

### 避免

- 深改 Core；
- 依赖未公开内部对象；
- 直接复制官方 UI 源码后长期维护 fork；
- 把业务能力和某一版前端 DOM 结构强绑定。

---

## 八、对我们的最终判断

下一阶段“开发定制自己的 UI”不能理解成美化 DSH。

正确目标是：

> 用 DSH 负责 Agent 运行，用 Laoli Workspace 负责项目、产物、专业流程和可观察性。

这两层边界一旦守住，后续 PPT、公文方案、自媒体、Research、企业知识 Agent 才能在同一个工作台里扩展，而不会再次演化成一个越来越重的自研 Runtime。

## 参考

- DeepSeek Harness Extension Cookbook: https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cookbook/extension-cookbook.md
- DeepSeek Harness: https://github.com/deepseek-ai/deepseek-harness
- Community Desktop Workspace: https://github.com/vibeinging/deepseek-harness-desktop-app
