# 案例 013 · dsh-research：从“插件市场”到“场景化能力市场”

## 为什么值得研究

DSH 社区插件数量正在快速增长。真正的问题已经不再是“有没有插件”，而是：

> **面对大量插件，用户如何知道哪些能力适合自己的工作？**

`dsh-research/dsh-research` 给出的答案不是再造一个通用市场，而是做一个 **Research 场景专用的精选能力市场**。

它只收录与研究有关的插件，例如：

- 文献检索
- 参考文献管理
- 写作
- Review

并直接嵌入 DSH Settings。

---

## 核心模式：通用 Registry + 场景化 Curated Catalog

官方社区市场解决：

```text
有没有这个插件？
```

而 dsh-research 解决：

```text
做研究的人到底该装哪些？
```

这是两个完全不同的问题。

因此能力生态可以分成两层：

```text
DSH Community Registry
        ↓
全量能力发现

Domain Curated Catalog
        ↓
按工作场景筛选
```

---

## 对我们的直接启发

未来 Laoli Workspace 不需要自己开发所有能力，也不应该把所有 DSH 插件都暴露给用户。

更合理的是形成自己的 **专业能力包**：

### Creator Pack

- 内容发现
- 网页研究
- 小红书/抖音/B站数据
- 文案生成
- 图片/视频辅助

### Government Document Pack

- Office
- OCR
- PDF
- 政策检索
- 文档编辑
- 差异审查

### PPT Production Pack

- PPT Master
- Office/PPT preview
- Image understanding
- Browser research
- Artifact review

### Research Pack

- Browser
- Evidence capture
- Literature search
- Citation management
- Long-form writing

---

## 为什么这比“万能 Agent”更合理

如果所有 Tool / Skill / Plugin 都加载到一个 Agent：

- 工具描述占用上下文；
- 能力选择困难；
- Prompt 发生冲突；
- 诊断复杂；
- 用户不知道什么能力正在生效。

场景化能力包则可以做到：

```text
选择工作模式
  ↓
加载对应 Preset
  ↓
加载必要 Plugin / Skill / Tool
  ↓
进入专业工作台
```

这比建立一个超大 system prompt 更符合 DSH 的插件化设计。

---

## 值得借鉴的工程细节

### 1. Catalog 是数据，不是写死在 UI

dsh-research 的网站和 Settings 面板读取同一个 JSON catalog，避免两套数据漂移。

### 2. 安装动作有明确边界

它对安装做了：

- allowlist
- same-origin 限制
- 单任务串行安装
- 使用当前真实 profile

这说明未来如果 Laoli Workspace 提供“安装能力包”，不能只做一个 npm install 按钮，而要明确：

- 安装到哪个 profile
- 哪些包允许安装
- 是否能回滚
- 是否会污染当前工作环境

### 3. 场景市场不等于新的插件生态

它只是精选已有生态，而不是 fork 社区。

这个原则非常重要。

---

## 推荐的 Laoli Capability Center V1

不要现在开发完整市场，只设计最小模型：

```text
Capability Pack
├─ id
├─ name
├─ target scenario
├─ recommended plugins
├─ recommended skills
├─ required tools
├─ compatibility notes
├─ permissions
└─ install / verify / remove instructions
```

第一批只维护四套：

1. PPT Production
2. 政务文档/方案
3. 自媒体内容生产
4. Research / Web Data

---

## 与现有 Harness-Engineering-dsh 的关系

这个项目本身就可以承担“能力筛选层”的知识来源。

研究过程应该固定为：

```text
发现社区项目
→ 源码/README验证
→ 判断能力边界
→ 写案例
→ 归类到场景能力包
→ 再决定是否实际采用
```

也就是说：

> Harness-Engineering-dsh 不只是研究文档库，最终还应该成为 Laoli Workspace 的“能力选型依据”。

---

## 结论

DSH 插件越多，我们越不应该追求“全部安装”。

真正有价值的是：

> **根据业务场景，组合一小组经过验证的 Plugin + Skill + Tool。**

这会成为后续自定义 UI 和个性化智能体产品化时，一个比“万能 Agent”更稳的架构基础。