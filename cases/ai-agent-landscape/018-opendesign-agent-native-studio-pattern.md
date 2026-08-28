# 018 · OpenDesign：Agent-native Studio 对自定义 UI、PPT 与内容生产工作台的启示

## 结论

OpenDesign 是目前很值得关注的“Agent 原生设计工作台”案例。它的价值不只是会生成 UI 或 PPT，而是把：

```text
Brief
→ Design System
→ Agent Runtime
→ Live Preview
→ Critique / Iterate
→ Export
```

放进同一个 Studio。

项目：

- https://github.com/nexu-io/open-design
- https://open-design.ai/

其 README 已明确将 DeepSeek Harness 作为原生 Runtime 支持，并支持 structured thinking、tool calls、model discovery、cancellation、session resume；生成文件继续留在 OpenDesign 工作流中做 live preview 和交付。

---

## 一、它真正解决的问题

传统 Agent UI 往往是：

```text
Chat
→ Agent 生成文件
→ 用户自己去文件夹找
```

OpenDesign 改成：

```text
Conversation
+ Generated Files
+ Live Artifact Preview
+ Design System
+ Next Actions
```

在同一个项目 Studio 中协同。

这非常接近我们后续 Laoli Workspace 的目标。

---

## 二、它与普通 Chat UI 的核心区别

### 1. Artifact 是一等公民

它支持的产物类型包括：

- Prototype
- Deck
- Mobile App
- Image
- Document
- HyperFrame / Motion Graphics

用户不是只看聊天文本，而是在工作台中直接看到产物。

这说明我们后续自定义 UI 的核心页面不应该围绕“消息”设计，而应该围绕：

```text
Project
Session
Artifact
Preview
Review
```

设计。

---

### 2. Design System 是项目契约，而不是一次 Prompt

OpenDesign 把 `DESIGN.md` 类设计系统作为品牌 / 视觉约束，让 Agent 在多个 artifact 之间复用。

这个模式对 PPT Production 很重要。

图片复刻、企业模板、政务蓝模板、PPT Master template extraction，都不应该每一次重新把几十条视觉规则塞进 Prompt。

更合理的是：

```text
Template / Reference
→ Extract Design System
→ Project-level Design Contract
→ 每页继承
```

这和我们之前提出的 `Reconstruction DNA` 是同一类思想。

---

### 3. Preview 和 Agent 迭代在同一个地方

OpenDesign 的 Studio 不是“生成完再打开另一个工具看结果”。

它强调：

```text
Generate
→ Preview
→ Inspect
→ Iterate
```

用户对 artifact 的视觉反馈能立即回到 Agent。

对 PPT 图片 1:1 可编辑复刻而言，这个模式比继续加 Prompt 更关键：

```text
Reference Image
→ Editable Reconstruction
→ Render Preview
→ Visual Compare
→ Repair
→ Re-render
```

因此我们后续做 PPT Workspace 时，应该优先把“参考图 + 当前 Render + 修复入口”放到同一个 Review 界面，而不是只做一个生成按钮。

---

## 三、对 Laoli Workspace UI 的直接启示

建议未来页面结构采用：

```text
┌──────────────┬────────────────────────────┬──────────────────┐
│ Project      │ Main Workspace             │ Inspector        │
│              │                            │                  │
│ Sessions     │ Conversation / Workflow    │ Current Stage    │
│ Files        │                            │ Artifact         │
│ Agents       │ Live Artifact Preview      │ Evidence         │
│              │                            │ Issues           │
└──────────────┴────────────────────────────┴──────────────────┘
```

其中中间区域应该允许根据 Agent 类型切换：

### PPT Agent

```text
Slide thumbnails
+ reference image
+ current render
```

### 公文 / 方案 Agent

```text
Document preview
+ changed sections
+ comments / proposed modifications
```

### 自媒体 Agent

```text
Research board
+ script
+ image/video artifact
+ platform versions
```

### Research Agent

```text
Sources
+ Evidence
+ Notes
+ Final report
```

---

## 四、对 PPT Production 的具体借鉴

OpenDesign 值得借鉴的不是替换 PPT Master，而是 UI/生产闭环。

### PPT Master 继续负责

- 内容导演
- 视觉导演
- 可编辑页面制作
- 视觉修复

### Workspace 负责

- 参考图管理
- 页面状态
- Render
- Preview
- User feedback
- Artifact version
- Export

所以正确边界是：

```text
PPT Master = 专业设计引擎
Workspace = 生产控制台
```

不要让 Workspace 自己再变成第二个 PPT 设计系统。

---

## 五、对自媒体内容生产的借鉴

OpenDesign 同一 Studio 支持 image、video、document、deck 等不同 artifact，这对内容生产很有价值。

未来一个选题可以成为一个 Project：

```text
Topic
├── Research Evidence
├── Long-form Article
├── Short-video Script
├── Cover Image
├── Social Card
├── Motion Graphic
└── Published Versions
```

不同 Agent 处理不同 artifact，但用户始终在同一个项目中工作。

这比“分别开 ChatGPT / 图片工具 / 视频工具 / 文件夹”更接近真正的个人内容 OS。

---

## 六、不应该照抄的地方

### 1. 不要先复制整个 Figma/Design Studio

OpenDesign 产品面很大，但我们的第一阶段目标不是做通用设计软件。

### 2. 不要统一所有 artifact 的内部流程

PPT、Word、Research、Video 的专业流程不同。

统一的应该只是：

```text
Project
Session
Artifact
Preview
Review
Version
```

### 3. 不要让 UI 抢走 Agent 的专业职责

UI 提供：

- 看见
- 选择
- 比较
- 确认
- 继续

专业判断仍由对应 Agent / Skill / Tool 负责。

---

## 七、建议进入 Laoli Workspace V1 的能力

优先借鉴四项：

1. **Artifact-first UI**：产物不是聊天附件，而是核心对象；
2. **Live Preview**：产物生成后原位查看；
3. **Project-level Design / Capability Contract**：项目级视觉或专业约束；
4. **Session Resume 与产物不分离**：恢复会话时能继续看到之前产物和状态。

暂不做：

- 通用设计编辑器；
- 大型插件市场；
- 全类型 artifact 编辑能力；
- 自己重写 DSH Runtime。

---

## 最终判断

OpenDesign 给我们的最大启发是：

> **未来的 Agent 产品界面，不应该只是“更漂亮的聊天框”，而应该是围绕真实产物组织的 Studio。**

对 Laoli Workspace 来说，UI 研发的第一原则应该从 `Chat-first` 改成 `Artifact-first`。