# DSH Agent Engineering Playbook

## 定位

本项目研究目标不是复述 Harness 理论，而是提炼基于 DSH 的真实工程方法：如何构建专业 Agent、如何选择扩展层、如何定位问题。

## 能力分层

### Prompt
负责角色、方法、行为规则。

### Preset
负责装配专业模式、工具和上下文策略。

### Skill
负责可复用专业知识和标准流程。

### Tool
负责真实执行能力。

### Plugin/UI
负责工作台、状态展示、交互入口。

### Workflow
仅在真实存在长任务阶段、确认点、恢复需求时增加。

## Agent 开发原则

1. 先完成无 UI 最小闭环。
2. 再抽取 Skill/Tool。
3. 最后设计 UI 工作台。
4. 不因为单次失败直接增加 Agent、状态机或复杂系统。

## 对 Laoli 项目的方向

优先建设：

- PPT Agent
- 文档方案 Agent
- 企业知识工作台
- 研发协作 Agent

核心目标：把 DSH 变成可扩展 AI 工作平台。