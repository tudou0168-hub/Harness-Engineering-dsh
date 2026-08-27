# 016 · Session Workspace + Memory + Artifact Pattern

## 结论

近期社区的 `dsh-workshpace-plugin` 提供了一个非常接近 Laoli Workspace 目标形态的实现：它没有重新实现 Agent Runtime，而是在现有 DSH 会话上增加一个 session-aware Workspace 视图，用于聚合 Agent 实际触碰的文件、产物、Memory 与 Git 变更。

这个方向比“再做一个项目管理系统”更值得借鉴。

---

## 一、它解决的核心问题

Agent 工作过程中会产生大量状态：

- 修改过哪些文件
- 生成了哪些产物
- 当前会话沉淀了哪些事实
- 哪些记忆是模型建议、哪些已确认
- 当前 Git 改了什么

如果这些信息全部塞进聊天区，UI 会变得非常嘈杂；如果另做第二套数据库，又容易与真实 Session 脱节。

该插件采用的是：

```text
Session
  ↓
Workspace Projection
  ├─ Artifacts
  ├─ Memory
  └─ Changes
```

也就是：**执行真相仍在 DSH，会话工作区只负责投影与治理。**

---

## 二、值得借鉴的三个设计

### 1. Artifact 不等于 File

它把 session-created deliverables 单独作为 Artifacts 展示，而不是把所有文件都当作产物。

这对我们的专业 Agent 很重要。

例如 PPT Production：

```text
Sources
- 原始 Word
- 模板 PPT
- 参考图片

Working Files
- storyline.md
- design_spec.md
- SVG
- render PNG

Artifacts
- 最终 PPTX
- PDF
- 讲稿
```

UI 不应该把三类东西混成一个文件列表。

### 2. Memory 需要治理，而不是“自动写入就算完成”

该插件提供 Memory 的：

- verify
- pin
- archive
- forget
- reject

并区分模型建议内容与已确认内容。

这说明未来个性化智能体如果要有长期记忆，正确模式不是：

```text
Agent 说过什么 → 自动永久记忆
```

而应该是：

```text
Agent 提议记忆
→ 用户/规则确认
→ 进入 durable memory
```

这对政务、公文、方案类 Agent 尤其重要，避免把一次项目中的临时事实污染长期知识。

### 3. Changes 必须可回看

插件直接在 Workspace 中展示 working tree / staged changes 和统一 diff。

这类“结果证据”对于研发 Agent 很有价值；对文档/PPT Agent，也应该有等价概念：

```text
Before
After
What changed
Why changed
```

不一定是 Git diff，但必须让用户知道 Agent 实际改了什么。

---

## 三、对 Laoli Workspace 的直接映射

建议 V1 不做复杂门户，先做一个统一右侧 Workspace：

```text
Workspace
├── Artifacts
├── Memory
├── Changes
└── Evidence
```

其中：

### Artifacts
展示当前 Agent 真实交付物。

### Memory
展示当前项目 / 会话新增的可持久事实，并支持确认治理。

### Changes
展示本轮执行修改了哪些源文件、设计文件、配置文件。

### Evidence
用于 Research / 政务方案 / 自媒体 Agent，保存引用网页、截图、时间与支持的结论。

---

## 四、对各专业 Agent 的适配

### PPT Agent

Workspace 重点：
- 当前页 / 当前阶段
- Render
- 参考图
- 最终 PPTX
- 设计文件

### 公文 / 方案 Agent

Workspace 重点：
- 原文
- 修改建议
- 已确认变更
- 修改后文件
- 变更说明

### 自媒体 Agent

Workspace 重点：
- Research Evidence
- 选题卡
- 脚本
- 素材
- 各平台成品

### 研发 Agent

Workspace 重点：
- Git diff
- 测试结果
- 日志
- 构建产物

---

## 五、不要照搬的部分

这个社区插件偏通用开发场景，Laoli Workspace 不应直接复制所有 Memory/Git 界面。

应该借鉴的是其底层原则：

> **Session 是运行真相；Workspace 是对运行结果的业务化投影。**

我们的 UI 应围绕专业产物，而不是围绕文件系统本身。

---

## 六、当前判断

Laoli Workspace 的公共层建议进一步收敛为：

```text
Project
Session
Artifact
Memory
Change
Evidence
Checkpoint
```

PPT、公文、方案、自媒体、Research、研发 Agent 共用这些概念，但内部专业流程不强行统一。
