# 案例 002 · 个人 AI 工作台 Agent

## 研究方向

个人工作台不是聊天机器人，而是围绕人的长期工作建立：

- 任务管理
- 项目管理
- 知识沉淀
- 会话记忆
- 工具调用
- 工作流自动化

## 核心架构

```text
User
 ↓
Workspace UI
 ↓
Agent Runtime
 ↓
Memory / Knowledge / Tools
 ↓
Project Outputs
```

## 借鉴重点

### UI

重点不是美化，而是让用户知道：

- 当前 Agent 在做什么；
- 当前项目状态；
- 下一步动作；
- 产生了哪些结果。

### 状态

不要只依赖聊天上下文。

需要：

- 项目文件
- 状态文档
- 可恢复任务记录

### 产品方向

适合作为：

Laoli AI Workspace

基础模型：

```text
项目
 ↓
专业 Agent
 ↓
任务执行
 ↓
成果沉淀
```

## DSH 映射

- Plugin：工作台 UI
- Preset：个人工作模式
- Skill：专业能力
- Tool：执行能力
- Session：持续协作
