# Diagnostics

本目录从“用户看到的症状”进入，而不是从 package 名进入。每个条目最终应指向 Study、Case、上游 source path 和 Playbook。

初始分类：

| Symptom | First subsystem suspects | First evidence |
|---|---|---|
| Agent / session 启动即失败 | profile composition, Loader, inject, agent creation | `dsh --dump-config`, startup error chain, real Loader path |
| resume 后行为与之前不一致 | session persistence, request/header, runtime context, continuation | session log, `session/end-seed`, latest request header/context |
| Tool 配置了但 UNKNOWN_TOOL | profile/preset composition, tool registry, conditional config | composed config, request/header tools, tool/result code |
| Prompt/事实模型没看到 | system-prompt section, runtime context, `agent.inject`, pre-step | request/header system, admitted user/message, prompt scope |
| 子 Agent followup/interrupt 异常 | subagent continuation, Activation, inbox, parent authority | child session descriptor, live Activation, inbox events |
| 上下文爆满或 compact 后失真 | compaction, tool-result pruning, externalized state | compaction events, shadowed seqs, request context window |
| 权限请求异常放行/拒绝 | approval policy, answerer, tool caller | approval asked/decided events, runtime policy snapshot |
| Build 成功但 Web/GUI 不对 | runtime identity, serving mode, artifact/source plane | canonical URL, process, browser state, current artifact |
| Windows/Linux/macOS 单平台失败 | subprocess, fs, sandbox, path/permission | platform boundary, exact exit/status/error cause |
| 报错只有 generic message | diagnostic boundary / cause chain | original thrown cause, durable turn/end, consumer renderer |

诊断文档不直接给“万能修复”。先给最短排除顺序；只有证据确认 root cause 后才链接具体 fix。
