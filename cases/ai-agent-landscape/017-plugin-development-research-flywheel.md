# 017 · DSH 插件研发闭环：Experience Memory × Explorer × Cordis Sub-Agent

## 结论

这是目前最值得纳入 `Harness-Engineering-dsh` 自研机制的社区模式之一。

它解决的不是某个业务功能，而是一个更底层的问题：**如何让 DSH 插件研发从“每次重新摸索”变成“经验可复用、源码可核验、实现可验收”的持续研发闭环。**

社区项目：

- https://github.com/ganfabo123-cmyk/dsh-experience-memory
- https://github.com/ganfabo123-cmyk/dsh-explorer-agent
- https://github.com/ganfabo123-cmyk/dsh-cordis-sub-agent
- 相关官方社区讨论：https://github.com/deepseek-ai/deepseek-harness/discussions/4582

---

## 一、三个能力分别解决什么

### 1. Experience Memory：保存“值得复用的经验”

它明确区分：

```text
Session = 发生过什么
Experience Memory = 哪些经验以后值得重复使用
```

核心工具：

- `memory_search`
- `memory_get`
- `memory_record`

关键设计不是“自动把所有历史塞进 Prompt”，而是：

```text
关键词搜索轻量候选
→ 只加载真正有用的一条经验
→ 当前任务产生新结论后，再记录可复用经验
```

这对我们非常重要，因为 PPT Production、DSH Plugin、文档 Agent 的问题经常重复出现：

- 某个 profile 的坑；
- 某个 Tool schema 的坑；
- Windows/macOS 差异；
- build artifact 没刷新；
- 某类提示词导致 Agent 跑偏；
- 某种修复已经验证过。

这些内容不应该永远藏在旧 Session 里。

社区项目给出的真实对照数据显示，在其一次真实插件研发工作流里，引入 Experience Memory 后模型调用、输入/输出 token、reasoning token、Tool 调用均明显下降。这个结果不能直接外推到所有场景，但足以证明“经验蒸馏而不是原始会话回放”是值得验证的方向。

---

### 2. Explorer：以“当前源码”为准，而不是靠记忆猜

Explorer 的角色是：

```text
我要知道 DSH 当前版本到底怎么实现
→ 去当前 checkout 查源码
→ 返回路径和事实
```

这是 DSH Developer Preview 阶段非常关键的能力。

因为官方和社区变化快，昨天正确的 API / package / extension point，今天可能已经变化。

所以研发时不应该只依赖：

- 模型知识；
- 老的 README；
- 旧 Session；
- 旧 Experience Memory。

正确顺序应该是：

```text
Memory 提供历史经验候选
→ Explorer 用当前源码核验
→ 再实施
```

这避免了“把旧经验当事实”的问题。

---

### 3. Cordis Sub-Agent：负责研发生命周期，而不是替代主 Agent 写代码

这个项目目前的完整流程是：

```text
submit_plugin_metadata
→ prepare_plugin_reading
→ Main Agent 按 reading plan 查看源码并实现
→ document_development
→ verify_development
→ fresh-runtime acceptance
→ permanent integration
```

它最值得借鉴的不是工具名，而是三个工程原则。

#### 原则 A：读取、实现、文档职责分开

- Read Agent：只调查和形成 reading plan；
- Main Agent：实现、修复、运行本地命令；
- Documentation Agent：只允许改 README 类文档。

这种职责边界比“再多加几个 Reviewer Agent”更有价值。

#### 原则 B：Build 通过不等于行为正确

项目明确把：

```text
Typecheck / Build / Test
```

和：

```text
fresh DSH runtime acceptance
```

分开。

这是我们当前 Harness Engineering 项目应该直接吸收的规则：

> **工程验证是证据，但不是运行时行为证明。**

#### 原则 C：失败后继续修同一个工作目录

Acceptance 失败时，不重新生成整个插件，而是保留同一个 pluginRoot：

```text
失败
→ Main Agent 修复
→ 再 verify
→ 再 acceptance
```

这和 PPT Production 的正确闭环很像：

```text
Render
→ Compare
→ Fix
→ Re-render
```

---

## 二、对 Harness-Engineering-dsh 的直接启示

我们现在已经有每日研究机制，但当前研究成果主要靠人工总结后写进仓库。

未来可以把研究研发流程升级成：

```text
发现问题 / 新插件 / 新源码变化
        ↓
搜索已有 Experience
        ↓
读取官方文档 + 当前源码核验
        ↓
在 lab profile 中做最小实验
        ↓
记录：成功 / 失败 / 兼容边界 / 修复方法
        ↓
写入 Harness-Engineering-dsh
```

注意：**现在不需要立刻把这三个插件全部装进稳定生产环境。**

更合理的是先在独立 `research-lab` profile 中验证。

---

## 三、建议我们吸收，但不要照抄的部分

### 建议吸收

1. 经验与 Session 分离；
2. 旧经验必须由当前源码重新核验；
3. 插件开发必须有 fresh-runtime acceptance；
4. 验证失败继续修同一工作目录；
5. 只记录真正可复用的经验，而不是完整日志。

### 不建议直接照抄

1. 不要马上把所有研发都强制成复杂 metadata 流程；
2. 不要为了“规范”增加大量 Agent；
3. 不要让 Experience Memory 变成另一个无边界知识库；
4. 不要在 stable profile 中直接实验社区插件。

---

## 四、适合我们的最小版本

### Harness Research Loop v1

```text
Question
→ Search Previous Lessons
→ Inspect Current Source / Official Docs
→ Small Lab Experiment
→ Verify Real Runtime
→ Record Reusable Lesson
→ Commit Research Note
```

只增加三个最小对象：

```text
Lesson
Evidence
Experiment
```

其中：

### Lesson
一句可以以后直接复用的结论。

### Evidence
源码路径、官方文档、真实运行输出。

### Experiment
本次如何验证、结果是什么、在哪个版本下有效。

---

## 五、对几个现有项目的价值

### PPT Production
记录真正被验证过的：

- 图片 1:1 复刻的 Render → Compare → Repair 方法；
- 哪类 professional prompt 更稳定；
- 哪些页面质量问题是架构问题，哪些只是视觉问题。

### 文档 / 方案 Agent
记录：

- 长文档如何分段读取；
- Word/PDF 解析插件兼容性；
- 客户变更类任务的正确执行闭环。

### 自媒体 Agent
记录：

- 哪个平台抓取工具实际可用；
- 哪种选题方法真正提高内容质量；
- 哪些自动化动作容易触发平台限制。

### 自定义 UI
记录：

- 当前 DSH UI extension seam；
- plugin 实际加载路径；
- build / reload / cache 类问题；
- DSH 版本升级造成的兼容变化。

---

## 最终判断

这个社区案例最值得借鉴的不是“多 Agent 自动开发插件”，而是一个更简单的思想：

> **历史经验负责减少重复探索，当前源码负责纠正过时经验，真实运行负责证明实现有效。**

这三层组合起来，才是适合 `Harness-Engineering-dsh` 持久研究项目的研发飞轮。