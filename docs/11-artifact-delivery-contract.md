# 11 · Artifact Delivery Contract

## 结论

专业 Agent 的完成条件不能是“文件已经写到 workspace”。

社区 `Inkotake/dsh-rich-artifacts` 提供了一个很有价值的模式：Agent 创建用户产物后显式调用 `publish_artifact`，图片直接在对话中预览，其他文件形成下载卡片，并由独立 artifact storage 持久化。

这暴露了一个我们现有专业 Agent 都需要统一解决的问题：**生成完成（generated）和交付完成（delivered）不是一回事。**

## 建议统一状态

```text
working
→ generated
→ reviewed
→ approved
→ published
```

其中：

- generated：文件真实存在；
- reviewed：完成该专业场景要求的回看；
- approved：必要时经过用户确认；
- published：已经通过 UI/Artifact 层交付，而不是只留下本地路径。

## 对 PPT Production

PPTX 写出不代表完成。

```text
PPTX generated
→ render preview
→ visual review / repair
→ user checkpoint（需要时）
→ publish PPTX + preview
```

这正好解释图片 1:1 转可编辑 PPT 的问题：当前最容易在 `generated` 就结束，缺少 `reviewed`。

## 对公文/方案 Agent

```text
DOCX generated
→ 回读修改段落
→ 检查批注/标黄/格式
→ 用户确认
→ publish final DOCX
```

## 对自媒体 Agent

```text
script / image / video generated
→ platform-specific review
→ publish artifacts
```

不要把“聊天里贴了一段路径”当交付。

## Laoli Workspace 公共层建议

Artifact 至少记录：

```text
Artifact
├── id
├── project_id
├── session_id
├── type
├── source_path
├── preview
├── status
├── review_result
├── created_at
└── published_at
```

专业 Agent 自己决定 review 规则；Workspace 只统一状态与交付。

## 关键原则

**Artifact 是专业 Agent 与工作台之间最稳定的契约之一。**

不要强行统一 PPT、公文、自媒体的内部 Workflow；统一它们的产物生命周期即可。

## 来源

- https://github.com/Inkotake/dsh-rich-artifacts （2026-08-29 检索）
