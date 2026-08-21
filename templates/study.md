# {{TITLE}}

## Question

待研究的问题。

## Symptom / Trigger

如果研究来自真实故障，记录用户实际看到的症状、错误文本、运行入口和触发条件；纯机制研究写“机制研究”。

## Baseline

- DSH version:
- Commit:
- OS / Node / runtime:
- Profile / preset / entry:
- Release artifact:
- Source Map:

## Sources

| Level | Source | Symbol / path | Why relevant |
|---|---|---|---|
| E1 |  |  |  |

## Reproduction / Trace

```text
写出能触发目标机制的最小路径；不能复现时明确说明缺口。
```

## Runtime Evidence

记录 Session event、request/header、tool/error code、process/browser evidence、composed config 等权威运行事实。

## Observed Facts

只写已由证据确认的实现事实。

## Competing Explanations

列出仍可能成立的解释和排除证据；没有则写“无”。

## Root Cause / Finding

机制研究写 Finding；故障研究写 Root Cause。不要把第一直觉写成结论。

## Fix / Correct Extension Point

若涉及修复，说明最小改动应该落在哪个 DSH extension point；不需要修复则写“不适用”。

## Regression Evidence

说明什么 unit / boundary fake / snapshot / e2e / real-entry test 能真正失败于该机制并证明结论。

## Reusable Pattern

可以迁移的 Harness Engineering 模式。

## Diagnostic Cue

以后出现什么 symptom/log/config 特征时应该首先想到这个机制。

## Applicability Boundary

明确哪些场景不应套用。

## Production Implication

对生产智能体设计、修正或测试的影响。

## Confidence

- Evidence level:
- Confidence: high / medium / low
- Version scope:

## Promotion

- [ ] 已转化为 `cases/` 真实案例
- [ ] 已加入 `diagnostics/` 症状索引
- [ ] 已形成 `playbooks/` 操作流程
- [ ] 已提升到 `docs/` 稳定结论
- [ ] 已形成 `decisions/` 决策
- [ ] 保留为专项研究，不升级为长期规则
