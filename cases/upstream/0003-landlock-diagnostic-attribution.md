# Case 0003: Landlock 信息提示被误判为 sandbox failure

## Baseline

来源：DeepSeek Harness postmortem 0004。该事故已解决，本 Case 提炼跨进程错误归因和平台差异诊断模式。

## Symptom

旧 Landlock ABI 主机上，正常被 sandbox 执行的 child 只要返回 nonzero，就可能被误报 `SANDBOX_UNAVAILABLE`；filesystem search 还会进一步把结构化 sandbox error 改写成 generic `SEARCH_FAILED`。

## Root cause

runner classification 只用了宽泛的 `landlock-run:` stderr 前缀，再与任意 child nonzero exit 组合，无法区分“partial enforcement informational notice”和真正 launcher failure。上层 adapter 又吞掉了下层 seam 已经拥有的结构化错误类别。

## Why checks missed it

真实 kernel test 会因宿主 ABI 自跳过；fake provider 没有模拟“benign runner notice + child nonzero”组合；filesystem search 测试没有覆盖真实 sandboxed-bash composition 中的结构化错误传播。

## Fix and regression

- failure classification 使用 exit status + fatal evidence + exact informational exclusions 的组合。
- native boundary 使用确定性 fake 覆盖平台差异。
- assembled product path 增加 keyless snapshot/real-path scenario。
- adapter 保留下层 seam 的 structured failure，不改写成最近的 generic category。

## Reusable diagnostic cue

遇到跨 subprocess/sandbox 的错误分类时：

1. 分清 launcher、wrapper、child 各自拥有的 exit/status/stderr。
2. 不用共享字符串前缀充当协议。
3. 检查上层 adapter 是否吞掉下层 structured error。
4. 平台依赖行为需要 deterministic boundary fake + assembled path，两者缺一不可。

## Source

`deepseek-harness/docs/postmortem/0004-landlock-partial-notice-misclassified-child-failures.md`
