# Case 0001: ACP Loader / inject / shadow 双重故障

## Baseline

来源：DeepSeek Harness postmortem 0001。该事故已经在上游解决；本 Case 提炼诊断模式，不把历史实现当作当前版本缺陷。

## Symptom

真实编辑器连接 ACP 后，`session/new` 与 `session/load` 都报类似的 `cannot get property ... without inject`。单测全绿且行覆盖率 100%。

## Evidence path

- Real Loader / stdio entry
- Cordis Loader `unwrapExports`
- plugin fiber / inject set
- traceable shadow service lookup
- `AgentLoop.resume()` optional persistence lookup

## Root cause

两个独立缺陷共享相似错误文本：

1. namespace plugin 同时存在 `export default apply`，Loader 优先解包 default function，导致 sibling named exports 中的 `inject` 被丢弃。
2. 可选 `sessionPersistence` 通过 property proxy 从 foreign shadow 读取时只做 ancestor walk，真实 plugin topology 下找不到 sibling service；top-level test 的 global-store bypass 掩盖了问题。

## Why tests missed it

测试手工 mount plugin，绕开真实 Loader；同时把组件平铺在 root context，绕开真实 shadow topology。key-gated e2e 又没有在 CI 中执行关键路径。

## Fix and regression

- 删除错误 default export。
- optional service 使用适合的 lookup 语义。
- 新增无 key 的真实 Loader/stdin subprocess e2e，直接执行 headline operation。
- 确保 source execution 不被 stale `lib/` 替代。

## Reusable diagnostic cue

出现 `without inject` 时不要立即归因“缺少 inject 配置”。先区分：

- plugin 是否通过真实 Loader 加载；
- module namespace 是否被 default export 解包；
- service 是 declared inject 还是 optional lookup；
- 调用是否经过 traceable shadow；
- 测试拓扑是否与生产拓扑一致。

专家建议应优先要求真实入口 trace，而不是继续增加 unit mock。

## Source

`deepseek-harness/docs/postmortem/0001-acp-default-export-drops-inject.md`
