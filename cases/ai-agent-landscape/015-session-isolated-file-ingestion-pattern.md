# 社区案例 015 · dsh-files：会话隔离文件入口模式

## 结论

dsh-files 解决的是一个很基础但极关键的问题：**用户上传的文档如何成为当前 Agent 会话可控、可隔离、可读取的输入。**

它提供 GUI 拖拽上传 + 模型工具读取，并按 Session 隔离文件，支持 PDF / Word / Excel 解析。

## 为什么这个案例重要

很多“专业 Agent”真正落地失败，不是模型能力不够，而是输入入口混乱：

- 文件到底属于哪个项目？
- 属于哪个会话？
- 新会话能不能看到旧会话文件？
- 是否会串文件？
- Agent 是否知道文件已上传？

如果这些边界不清，后面的公文、方案、PPT、Research 工作台都会不稳定。

## 建议的三层对象模型

```text
Workspace / Project
      ↓
Session
      ↓
File Attachment / Artifact
```

三者不要混为一谈。

### Project
长期业务容器，例如：
- 某建设方案
- 某 PPT 项目
- 某自媒体选题研究

### Session
一次 Agent 执行上下文。

### File
当前任务的输入或产物。

## 对 Laoli Workspace 的直接启示

未来 UI 中建议明确展示：

```text
项目文件
会话附件
Agent 产物
```

三类东西分别管理。

不要只做一个“文件列表”。

### 公文 / 方案 Agent
用户上传：原方案、客户变更意见、参考材料。

Agent 应知道：
- 哪个是基线文件；
- 哪个是增量需求；
- 哪个是参考证据。

### PPT Agent
用户上传：
- 原始 Word
- 模板 PPT
- 参考图片

三类材料用途完全不同，UI 和 Agent context 都应明确标记角色。

### 自媒体 Research Agent
抓取的网页、截图、转录文本不要混进上传文件区，应进入 Evidence / Research Artifact。

## 推荐设计

Laoli Workspace 文件层建议至少有 metadata：

```text
file_id
project_id
session_id
role: source | template | reference | evidence | output
mime_type
created_at
source
```

不需要一开始上数据库；早期可以通过项目目录 + manifest.json 实现。

## 不建议做的事

- 所有上传文件自动放进所有 Session；
- 把文件正文全部注入 system prompt；
- 依赖文件名猜用途；
- UI 只显示路径、不显示文件角色。

## 研究结论

会话隔离文件不是“上传功能”，而是专业 Agent 的**输入边界机制**。

如果未来要做个人工作台，这一层应早于复杂 Workflow。