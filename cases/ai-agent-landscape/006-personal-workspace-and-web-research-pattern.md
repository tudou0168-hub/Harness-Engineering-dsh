# 个人工作台 + 联网研究 Agent：今天最值得借鉴的组合

## 结论先行

DSH 社区已经把“个人工作台”和“浏览器研究”拆成了两个相对清晰的能力层：

- 工作台：任务、项目、会话、状态、审阅；
- 浏览器：读取 JS 页面、截图、点击、输入与页面自动化。

这比做一个“大而全个人助手”更合理。

## 案例 A：dsh-taskboard / dsh-task-board

社区已出现多种任务看板插件。

典型能力包括：
- Kanban / List / Gantt / Workflow / Dashboard
- 任务与真实 DSH Session 绑定
- 每个任务可创建 Agent 会话
- 状态回写
- 审阅、通过、退回、follow-up
- 本地持久化

### 最重要的启发

#### 1. Task 不应该等同于 Chat

真正的个人工作台应该有独立任务对象：

```text
Task
├── title
├── goal
├── acceptance criteria
├── workspace
├── agent preset
├── status
├── output
└── linked session
```

聊天只是任务的执行轨迹之一。

#### 2. Session 应该作为执行载体，而不是唯一数据源

任务状态、验收条件、输出物应有独立权威状态；Session 负责执行和追溯。

这一点对 PPT、文档、研发项目都适用。

#### 3. Browser UI 是投影，不应该成为权威状态

优秀实现强调 Host-authoritative ledger：关闭浏览器并不会让任务状态丢失。

这对未来 Laoli Workspace 很关键。

## 案例 B：dsh-plugin-browser

项目：`xu1132/dsh-plugin-browser`

它用 Playwright 给 DSH 增加：
- browser_navigate
- browser_snapshot
- browser_click
- browser_type
- browser_screenshot
- browser_close

价值在于弥补纯 HTTP fetch 对 JS 渲染页面、交互页面的不足。

### 对“网上抓数据”的启发

抓数据能力至少应分三级：

#### Level 1：Search / Fetch

适合：
- 新闻
- 政策
- 普通公开网页

#### Level 2：Headless Browser

适合：
- JS 渲染
- 翻页
- 登录后页面
- 表单
- 需要点击才能出现的数据

#### Level 3：平台专用 Skill / API

适合：
- 小红书
- 抖音
- B站
- 微博

不要所有网站都用浏览器硬爬。平台专用数据能力稳定性和结构化程度通常更高。

## 对 Laoli Workspace 的建议

第一版不要做“智能桌面”。

建议只做五个区：

```text
① 项目
② 任务
③ Agent / Session
④ 文件与产物
⑤ 研究与执行日志
```

具体界面：

### 左侧
- 项目
- 常用 Agent

### 中间
- 当前任务 / 当前会话

### 右侧
- 任务状态
- 输入材料
- 输出文件
- 待确认事项

### 底部或抽屉
- 工具调用
- 浏览器研究记录
- Token / 耗时

## 与现有项目的映射

### PPT Production

Task = 一次 PPT 项目
Session = 同一 continuable ppt_master_agent
Artifacts = storyline / design spec / pilot / pptx
Checkpoint = 用户确认

### 建设方案 Agent

Task = 一次方案编制或变更
Artifacts = 原稿 / 修改范围 / 当前稿 / 最终稿
Checkpoint = 修改范围确认

### 自媒体 Agent

Task = 一条内容
Artifacts = 数据证据 / 选题 / 脚本 / 封面 / 成片
Checkpoint = 选题 / 成稿确认

因此，**个人工作台真正值得统一的是 Task / Artifact / Checkpoint / Session 的展示模型，而不是统一所有 Agent 的内部工作流。**

## 研究来源

- https://github.com/ttmouse/dsh-taskboard
- https://github.com/scwlkq/dsh-task-board
- https://github.com/Ericwong5021/dsh-kanban
- https://github.com/xu1132/dsh-plugin-browser
- https://github.com/Uddoo/dsh-dashboard
