# 案例 012 · dsh-univer-office：把 Office 生产做成“可预览、可确认、可回滚”的 Agent 工作流

## 为什么值得研究

`dream-num/dsh-univer-office` 不是简单给 DSH 增加 Word/Excel/PPT 的读写能力，而是把 **Office 生产、实时预览、结构校验、版本隔离、人工确认、导出交付** 做成了一条完整生产链。

这对我们的 PPT Production、建设方案 Agent、可研 Agent、政务材料 Agent 很有参考价值。

---

## 核心能力

插件可以在 DSH 中创建、编辑、检查并交付：

- Sheet
- Doc
- Slide
- Base
- Board

并支持导入/导出常见 Office 文件：

- `.xlsx`
- `.docx`
- `.pptx`

它的重点不是“会写 Office 文件”，而是 **每次修改都可被验证、预览、确认或丢弃**。

---

## 关键工程模式 1：Write ≠ Commit

每次写操作先进入隔离 worktree，而不是直接覆盖主文件。

典型流程：

```text
创建/导入文件
  ↓
创建 worktree
  ↓
Agent 修改
  ↓
inspect / lint / screenshot
  ↓
submit for review
  ↓
用户确认
  ↓
merge 或 discard
```

这解决了专业文档生产中的一个关键问题：

> Agent 可以大胆修改，但最终成果仍由用户控制。

### 对我们的启发

PPT Production、方案 Agent、可研 Agent 都可以吸收这个思想：

```text
Working Version
→ Review
→ Approve
→ Promote to Final
```

但不必照搬它的完整 worktree 实现。对我们的场景，保留 **“工作版本 / 用户确认 / 正式版本”** 三态即可。

---

## 关键工程模式 2：结构校验和视觉校验必须分开

Slide 工具同时提供：

- `univer_inspect`：读取结构
- `univer_lint`：检查 off-page / overflow / overlap
- `univer_screenshot`：渲染截图给视觉模型检查

这点对 PPT Master 特别重要。

### 我们当前图片转 PPT 的问题

现在的常见失败是：

```text
对象已经重建
→ 认为任务结束
```

正确流程应该是：

```text
重建对象
→ 结构检查
→ 渲染截图
→ 对照参考图
→ 修复细节
→ 再渲染
→ 确认
```

因此：

> **结构正确不等于视觉正确。**

这应该正式写进 PPT Production 的质量原则。

---

## 关键工程模式 3：UI 只投影状态，不成为第二套 Runtime

插件通过 DSH 的结构化 tool event 恢复 target，UI 只负责：

- Preview card
- Live worktree window
- Review panel

状态和执行真相仍然来自 Host / Tool / Session。

### 对 Laoli Workspace 的启发

未来 UI 应该只显示：

```text
Project
Session
Current Artifact
Current Version
Review State
Preview
Actions
```

不要在前端重新维护另一套任务状态。

---

## 关键工程模式 4：专业 Tool，而不是通用 CLI passthrough

插件没有简单暴露一个“执行 Univer CLI”的万能工具，而是把能力拆成：

- `univer_new`
- `univer_status`
- `univer_worktree`
- `univer_unit`
- `univer_import`
- `univer_inspect`
- `univer_execute`
- `univer_export`
- `univer_lint`
- `univer_compile_svg`
- `univer_screenshot`
- `univer_api`

这种设计让模型更容易理解能力边界，也更方便审计。

### 对我们的启发

PPT / Document Agent 工具也应该优先设计成领域工具：

```text
ppt_render
ppt_inspect
ppt_compare
ppt_repair
ppt_export
```

而不是只暴露：

```text
bash
python
office-cli
```

---

## 不应该照搬的部分

### 1. 不要因为它有 worktree，就给所有 Agent 加 Git 式状态机

我们的 PPT 和政务文档场景如果只需要：

- 当前工作版
- 用户确认
- 正式版

就不要实现复杂的 reopen / merge / discard 生命周期。

### 2. 不要让通用 Office Runtime 替代专业 Agent

Univer Office 能处理 Slide，不代表它能替代 PPT Master 的：

- 内容导演
- 视觉导演
- 政务风格判断
- 图片 1:1 视觉复刻

它更适合作为 **底层可编辑 Office Runtime + Preview/Review 能力**。

---

## 对现有项目的直接落地

### PPT Production

建议正式吸收：

```text
Generate / Rebuild
→ Inspect
→ Render
→ Visual Compare
→ Repair
→ Re-render
→ User Confirm
→ Export
```

### 文档/方案 Agent

建议吸收：

```text
理解需求变更
→ Working Copy
→ 修改
→ Readback
→ 页面预览
→ 用户确认
→ Final
```

### Laoli Workspace

可以增加统一 Artifact Review 区：

```text
Artifact
├─ type
├─ current version
├─ preview
├─ structural status
├─ visual status
└─ approve / revise
```

---

## 结论

这个案例最值得借鉴的不是“一个插件能同时编辑 Word/Excel/PPT”，而是它把专业 Office 产物从一次性生成，提升成：

> **可验证、可预览、可确认、可回滚的生产过程。**

这正是我们 PPT Production 和后续政务文档 Agent 应继续补齐的工程层。