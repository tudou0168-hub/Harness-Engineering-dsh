# 专家级指导能力审计

## 结论

当前 V0 已经足够支撑后续研究，但还不足以作为“DeepSeek Harness 专家级诊断库”。它能回答“应该研究哪一层、不要在哪一层过度工程化”，但遇到真实故障时，还不能稳定完成“症状 → subsystem → lifecycle → source symbol → root cause → minimal fix → regression evidence”的闭环。

研究框架成熟度可评为 85/100；专家诊断成熟度当前约 45/100。差距主要不在架构理论，而在真实案例、运行轨迹、发布物证据、症状索引和版本差异。

## 与 Harness Engineering 对照

《驾驭工程》有三个值得保留的特点：

1. 原则来自前序源码分析，而不是先写原则再找例子。
2. 生产模式绑定明确问题、实现方式、源码证据、适用边界和反模式。
3. 最终用一个可运行代码审查 Agent 验证模式能否跨产品迁移。

本仓库 V0 已经具备第 1、2 点的方法框架，但尚未完成足够多的 DSH 专项源码研究，也没有形成可运行/可重放的 DSH 案例库，因此还不能把外部 Claude Code 案例当成 DSH 专家经验。

## DSH 自身已经提供的反证

DSH 的真实事故说明“理论正确”远远不等于“能诊断生产问题”。

- ACP 事故中，178 个单测和 100% 行覆盖全部通过，但真实 Loader 路径一启动即失败。根因分别是 default export 让 Loader 丢失 `inject`，以及 traceable shadow 下可选 service 的错误读取。只有跑真实入口和 fiber trace 才能区分两个同报错、不同机制的故障。
- Web GUI 事故中，build success、HTTP 200、boot manifest 和用户正在使用的页面被错误地当成同一个验收目标。正确诊断依赖 model-visible runtime identity、真实 URL、运行模式和外部浏览器状态。
- Landlock 事故中，一个共享 stderr 前缀把正常 child nonzero exit 错归因为 sandbox failure，上层又把结构化错误改写成 generic error。根因跨 native boundary、runner classification、tool adapter 和平台 ABI。
- Error cause-chain 修复表明，`fetch failed` 这种表层错误无法支持定位；需要在 TUI、session durable reason、logger 等每个 diagnostic boundary 保留 cause chain。

这些案例应成为本仓库的核心训练材料，而不是只作为参考链接。

## 专家级知识库必须具备的能力

### 1. Mechanism knowledge

对 Agent Loop、Session、System Prompt、Preset、Subagent、Compaction、Approval、Tools、Persistence、Shell/Subprocess/Sandbox 等建立 version-locked source trace：入口、状态拥有者、事件、失败路径、取消/恢复、扩展点。

### 2. Case knowledge

真实案例必须记录：Symptom、Environment、Entry Path、Observed Evidence、Root Cause、Why Existing Tests Missed It、Fix、Regression、Reusable Diagnostic Cue。

### 3. Symptom-first diagnosis

用户通常不会说“我的 Cordis shadow lookup 有问题”，只会说：

- Agent 起不来 / resume 失败
- Tool 明明配置了却 UNKNOWN_TOOL
- Prompt 改了但模型没看到
- 子 Agent interrupt 后不继续
- Session 恢复后状态不对
- Web 页面明明 build 成功却没变化
- Windows/Mac/Linux 只有一个平台失败

专家库必须从这些症状反查 subsystem 和第一批证据，而不是要求用户先知道源码结构。

### 4. Reproduction and regression

运行时结论不能只靠静态阅读。至少要有一个能失败于目标机制的复现路径；修复建议必须说明什么验证能证明问题真的被修复，而不是测试恰好绿了。

### 5. Version awareness

DSH 仍处于快速变化阶段。每条专家建议要绑定版本或 commit；新 release 建立 delta，区分“原则仍成立”“API 改了”“生命周期语义改了”“旧案例已不可复现”。

### 6. Production application evidence

上游案例证明 DSH 自身机制；真实领域项目证明模式能否用于生产智能体。两类证据必须同时存在。领域案例应记录原始问题、选择的 DSH extension point、为什么没有修改 Core、完整生命周期结果和回归结论。

## 推荐知识结构

现有 `docs / studies / evidence / decisions` 保留，再增加四个面向实际使用的层：

```text
cases/        已验证的真实故障与生产案例
diagnostics/  症状 → subsystem → 首查证据 → 已知案例
playbooks/    可执行的诊断/验证流程
versions/     release artifact 与跨版本差异
```

不建立数据库、知识图谱或重型检索 Runtime。Markdown + 明确索引足够支撑当前阶段；先积累真实案例，再决定是否需要机器化索引。

## 专家回答协议

后续用本仓库回答研发问题时，默认按以下顺序：

1. 锁定 DSH 版本、运行入口、OS/Node、profile/preset 和复现条件。
2. 用症状定位可能的 subsystem，不从用户猜测的根因出发。
3. 检查当前 Session/log/config/runtime facts，区分 model-visible、durable 和 live-only 状态。
4. 给出 1~3 个按概率排序的假设，每个假设绑定源码/案例证据。
5. 给最小复现或最短排除步骤，而不是先改代码。
6. 根因确认后，优先使用现有 extension point；只有结构性缺口才建议改 Core。
7. 指定 regression：真实入口、snapshot/e2e/unit 中哪个能证明这个机制。
8. 输出版本适用范围和置信度；证据不足时明确写“未确认”。

## 专家级验收标准

本仓库达到“可作为 DeepSeek Harness 专家级指导库”的最低标准，不以文档数量判断，而以覆盖能力判断：

- 核心 subsystem 全部存在 source-trace Study。
- 高频症状能从 `diagnostics/` 进入，不依赖先知道 package 名。
- 每个高风险 subsystem 至少有真实故障或真实生产案例支撑。
- 关键运行机制有 reproducible trace 或 real-entry validation。
- 至少连续两个 DSH 发布版本完成 artifact/delta 对照。
- 至少两类不同领域生产智能体完成端到端案例验证。
- 用历史真实故障做盲测：只给 symptom/log，能够较快定位到正确 subsystem 和根因层级。

达到这些条件后，这个仓库才从“研究资料”升级为“专家工作台”。

## 当前阶段建议

第一阶段不扩展更多理论章节。优先完成 Agent Loop、Session/Resume、Prompt/Runtime Context、Continuable Subagent、Preset 五个 source-trace Study，同时把 DSH 已有 postmortem、implemented bug-fix Agent Notes 和真实生产项目转化为 Case。每完成一个 Study，都补一个 symptom entry 和至少一个可执行 Playbook，形成知识闭环。
