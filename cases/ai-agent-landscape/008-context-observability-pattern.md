# 008 · Context Observability：专业 Agent 的上下文可观测模式

## 结论先行

`Zhenyu98/dsh-context-doctor` 提供了一个对我们非常有价值的新方向：**不要等 Agent 跑偏以后再靠经验猜 Prompt 问题，而是把上下文注入本身变成可观测对象。**

对于 PPT Production、文档方案 Agent、政务智能体这类长任务，很多“突然不听话”“恢复后变味”“Skill 没生效”“Token 越来越重”的问题，本质上是上下文不可见。

Context Doctor 的意义不在于一个圆环 UI，而在于建立：

```text
Agent 行为异常
   ↓
审计实际注入物
   ↓
指令 / Skill / Tool / MCP 成本与冲突
   ↓
定点修复
```

这比继续堆 Reviewer、门禁和负向规则更适合我们的研发原则。

---

## 1. 它观察什么

该插件把每个请求携带的常驻上下文拆成几类：

- AGENTS.md / CLAUDE.md 指令链；
- Skill catalog 的 name + description；
- 当前 Agent 可见 Tool schema；
- MCP tools；
- 同名 Skill 的 rank shadow；
- 可选 Skill 正文成本。

它还能识别：

- 重复指令块；
- 重复 Skill 描述；
- Skill 名称冲突与遮蔽；
- MCP / Tool 面膨胀。

---

## 2. 为什么这对我们的项目很重要

### 2.1 PPT Production

我们历史上经常遇到：

- Main 与 PPT Master 职责混淆；
- 自定义编排规则与 Skill 原生规则冲突；
- 新会话不知道项目基线；
- Agent 恢复后忘记设计状态；
- Tool / Skill 暴露过多导致偏航。

以前的处理方法容易变成“再补一条规则”。

更好的顺序应是：

```text
出现异常
→ 看实际注入了什么
→ 看谁覆盖了谁
→ 看哪些工具真的可见
→ 再决定是否修改 Prompt / Preset / Skill
```

### 2.2 文档 / 方案 Agent

长文档任务很容易同时加载：

- 文档工程 Skill；
- Office Tool；
- 项目 AGENTS；
- 通用写作 Skill；
- MCP / 文件工具。

如果上下文重复或冲突，模型可能在“格式规范、写作方法、修改纪律”之间来回切换。

上下文审计可以帮助判断：

- 是否 Skill catalog 过大；
- 是否多个技能职责重叠；
- 是否 Project 指令与全局指令冲突。

### 2.3 个性化智能体

以后做多个专业 Agent 后，不能靠“感觉”判断一个 Agent 为什么表现不同。

至少需要看到：

```text
当前 Agent
├── System / Instruction chain
├── Loaded Skills
├── Visible Tools
├── MCP surface
└── Project Context
```

这是 Agent 工作台应该具备的开发者视图。

---

## 3. 我们应该借鉴什么

### 借鉴 1：只读诊断优先

Context Doctor 不写、不删，只观察。

这个设计非常适合我们：

- 诊断工具不要自动修改生产配置；
- 先告诉人根因；
- 再由主 Agent 或用户决定是否修改。

### 借鉴 2：把“上下文成本”拆成来源

不要只展示“当前用了 40k Token”。

更有价值的是：

```text
Instructions: 6k
Skills catalog: 5k
Tool schemas: 12k
MCP: 8k
Conversation: xxk
```

这样才能知道应该减哪里。

### 借鉴 3：冲突检测比分数门禁更有价值

我们的经验已经证明，为了“过检”增加很多 QA 规则容易导致系统造假。

而“同名 Skill 被谁 shadow”“同一规则是否重复注入”是客观事实，属于高价值诊断。

---

## 4. 不应该照抄什么

### 4.1 不需要把 Token 优化变成新的质量门禁

目标是诊断，而不是要求每个 Agent 必须低于某个 Token 数。

专业任务本来就可能需要较大上下文。

### 4.2 不要自动删除 Skill / Tool

上下文成本高不等于无用。

例如 PPT Master 的专业能力即使 token 较大，也可能是质量核心。

### 4.3 不要做成独立大系统

最适合的形态是：

- 一个诊断 Tool；
- 一个开发者 UI 面板；
- 一份标准排查报告。

---

## 5. 建议加入 Laoli Workspace 的“Agent Inspector”

未来 UI 可增加一个开发者模式，不影响普通生产界面。

建议字段：

### Runtime
- Session ID
- 当前 Agent / Preset
- 模型
- Context Window

### Context
- Instruction chain
- Skills
- Tools
- MCP
- Estimated Tokens

### Conflict
- duplicate instructions
- shadowed skills
- overlapping tool surfaces

### Recovery
- 本轮是否为 resume；
- 重读了哪些 externalized state；
- 当前项目关键状态文件。

---

## 6. 推荐的诊断顺序升级

原有诊断树可进一步明确：

### Agent 不按预期工作

旧做法：

```text
Prompt → Skill → Tool → Session
```

升级为：

```text
1. 先抓实际 runtime context
2. 检查 instruction chain
3. 检查 Skill winner / shadow
4. 检查 visible tools
5. 检查 MCP surface
6. 检查 project externalized state
7. 最后才改规则
```

---

## 7. 架构判断

我们后续做专业 Agent 平台时，应该把“可观测性”作为开发能力，而不是额外 Reviewer：

```text
Production Agent
      │
      ├── normal UI
      │
      └── Agent Inspector（只读）
           ├── Context
           ├── Tool
           ├── Skill
           ├── Session
           └── State
```

这更符合“出现问题时快速定位、参考什么、怎么解决”的研究目标。

## 参考

- https://github.com/Zhenyu98/dsh-context-doctor
