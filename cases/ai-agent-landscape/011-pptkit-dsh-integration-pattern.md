# 案例 011 · PPTKit：PPT Agent 在 DSH 中应把“技能注册、预览、导出、构建报告”拆开

## 结论先行

PPTKit Presentation 是一个值得对照 PPT Production 的社区案例。

它的价值不在于页面质量一定优于 PPT Master，而在于它把 PPT 生产拆成了几个很清楚的工程层：

```text
DSH Plugin Bundle
    ↓
注册 PPT Skill
    ↓
隔离 Node 项目
    ↓
Source Extraction
    ↓
Deck Brief / Deck Spec
    ↓
Build
    ↓
Preview / Review
    ↓
Explicit Export
    ↓
PPTX + Build Reports + Source/Asset Reports
```

这套“产物链”非常适合我们借鉴。

## 一、它怎么接入 DSH

PPTKit 没有修改 DSH Core，而是提供 `dsh-plugin-pptkit-presentation` bundle，把 `pptkit-presentation` 注册进 DSH 的 Skill Catalog。

同时也保留原生 Skill Copy 方式：直接复制到 DSH 的 skill root。

这个设计说明：

> **如果专业能力本身已经成熟，接入 DSH 最小方式应该是 Skill / Plugin Bundle，而不是再造一套 Runtime。**

## 二、它的生产过程有什么值得借鉴

### 1. 先做决策，再生成

PPTKit 会先收集缺失决策，并要求用户确认视觉方向与页级大纲。

这与 PPT Production 的 Strategist / Pioneer Checkpoint 思路一致：

- 先锁方向；
- 再制作；
- 高价值视觉产物必须保留用户确认点。

### 2. 每次生产都有结构化中间产物

它会保留：

- `deck-brief.md`
- `src/deck-spec.ts`
- `content/sources.json`
- `content/assets.json`
- `build-report.json`
- `runtime-decision.json`

这比“聊天里说我已经理解了”可靠得多。

对我们 PPT Production 的启发：

```text
storyline.md
spec_lock.md
page_plan.md
professional prompt
rendered previews
qa report
```

这些文件应该继续作为事实来源，而不是被简化掉。

### 3. Export 是显式动作

PPTKit 强调 preview/review 与 export 分离。

这条原则非常重要：

```text
完成设计 ≠ 完成交付
```

应该：

```text
设计完成
→ 预览 / QA
→ 用户确认
→ 导出最终 PPTX
```

这与我们当前 PPT Production 方向一致。

## 三、一个值得警惕的差异：DSH 原生没有 Browser Preview Tool

PPTKit 在 DSH 环境下检测到没有 in-app browser tool 时，会走 Node fallback，并记录 `host-no-browser` 运行证据。

但 DSH 社区现在已经出现多种 Browser Plugin。

这产生一个新的研发机会：

> PPT Production 的 Preview / QA 不一定必须由 PPT Skill 自己内置浏览器；可以把 Browser / Preview 能力作为独立插件层组合进去。

建议未来架构：

```text
PPT Agent
  ↓
PPT Master / PPT Engine
  ↓
Render Service
  ↓
Preview UI / Browser Plugin
  ↓
Human Review
```

这样 PPT Skill 不需要承担所有 UI 能力。

## 四、与 PPT Master 2.8 的互补关系

PPTKit 更值得借鉴的是工程流程；PPT Master 更值得保留的是设计能力。

不要错误地做成：

```text
为了流程更清楚，换掉 PPT Master
```

更合理：

```text
PPT Master 负责：
内容导演 / 视觉导演 / 页面制作 / 视觉修复

DSH Production Layer 负责：
任务状态 / Checkpoint / Preview / Artifact / Delivery
```

## 五、针对“图片 1:1 转可编辑 PPT”的新判断

最近图片复刻任务暴露的问题不是“生成不了可编辑对象”，而是：

```text
Image → Editable Objects
```

之后缺少：

```text
Render → Compare → Fix → Render Again
```

PPTKit 的 preview-first 思路再次证明：

> **视觉产物需要独立 review surface，不能把“build 成功”当作“页面完成”。**

后续可以把图片复刻定义成标准 recipe：

```text
Reference Image
→ Layout/Style Analysis
→ Editable Reconstruction
→ Render
→ Visual Comparison
→ Local Fix
→ Re-render
→ Approve
→ Export
```

## 六、不应照抄的地方

PPTKit 当前 DSH 路径更多是 Skill + Node 构建流程，它并不能直接证明复杂政府汇报、模板继承和高质量视觉导演能力。

因此：

- 不应因为工程流程清楚就假设视觉质量更高；
- 不应因为有 build report 就把审美问题误当成可程序化质量门禁；
- 不应重新引入过重 Reviewer / Gate 系统。

## 七、对 Laoli PPT Workspace 的直接建议

未来 UI 可以明确展示：

```text
Project
├─ Sources
├─ Professional Prompt
├─ Strategy / Storyline
├─ Design Spec
├─ Current Page / Stage
├─ Preview
├─ Review Notes
└─ Deliverables
```

用户看到的是生产状态与产物，不需要看到复杂内部 Runtime。

## 八、判断

PPTKit 是一个高价值“工程流程参考案例”，但不是替代 PPT Master 的候选。

最值得吸收的是三条：

1. **专业能力通过 Skill / Plugin Bundle 接入 DSH；**
2. **中间产物结构化、可审计；**
3. **Preview / Review / Export 三者严格分开。**

这三条可直接增强现有 PPT Production，而不会破坏当前高质量设计链。