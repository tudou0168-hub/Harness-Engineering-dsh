# DSH Extension Architecture

## 一、核心判断

DSH 不应被理解为一个聊天工具，而应理解为一个 Agent Runtime。

生产级扩展重点不是修改 Core，而是围绕扩展层建设能力。

## 二、核心扩展层

```
DSH Runtime
 |
 +-- Plugin Layer
 |
 +-- Agent Preset
 |
 +-- Skill System
 |
 +-- Tool System
 |
 +-- UI Extension
 |
 +-- Workflow
```

## 三、开发原则

### 1. 优先 Plugin

不要直接修改 DSH 源码。

原因：

- 保持升级能力
- 降低维护成本
- 方便企业定制

### 2. Agent 个性化组合

一个专业 Agent 应由以下部分组成：

```
Preset
 +
Skill
 +
Tool
 +
Memory
 +
Workflow
 +
UI
```

## 四、未来方向

基于 DSH 构建：

- 企业 AI 工作台
- 专业生产 Agent
- 项目管理 Agent
- PPT Agent
- 文档工程 Agent

重点研究如何把能力工程化，而不是单纯提示词优化。
