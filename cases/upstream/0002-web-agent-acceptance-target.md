# Case 0002: Web Agent 验证了错误的运行目标

## Baseline

来源：DeepSeek Harness postmortem 0003。该事故已解决，本 Case 提炼 model-visible runtime context 与 acceptance target 的诊断模式。

## Symptom

Agent 修改 Web GUI 后报告成功，但用户当前页面没有得到可靠验证；期间 bare Vite 返回 HTTP 200，却缺少完整 host 注入；Agent 又启动第二个 `dsh web` 端口并把替代服务的成功当成原页面成功。

## Root cause

当前 GUI 的 canonical URL、source checkout、serving process 和 runtime mode 没有进入模型可见上下文。模型把 workspace cwd、源码目录、build artifact、HTTP readiness、boot manifest 和用户当前页面混成一个事实集合。

## Why checks missed it

- HTTP 200 只证明 transport ready，不证明应用 ready。
- build success 不证明当前页面加载了新 artifact。
- replacement service 不证明 existing origin 已更新。
- 早期 regression 甚至把 timeout/nonzero exit 当成正确 fail-fast。

## Fix and regression

DSH 将当前 URL 和 runtime mode 变成 model-visible / shell-queryable runtime facts，并对 production refresh、development HMR、same-port static replacement 和真实 browser state 做分层 real-path 验证。

## Reusable diagnostic cue

GUI、服务、预览、长运行进程问题，首先问“**验收对象是谁**”：

- 用户当前使用的 origin/port/process 是什么？
- Agent 看到的是哪个 runtime identity？
- 验证动作是否观察了同一个对象？

不要用“另起一个成功实例”替代对当前实例的验收。

## Source

`deepseek-harness/docs/postmortem/0003-web-agent-gui-feedback-loop.md`
