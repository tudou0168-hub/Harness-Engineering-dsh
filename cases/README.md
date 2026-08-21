# Cases

本目录保存已经发生、能够由证据解释的真实 DSH 故障和生产应用案例。Case 的用途不是讲故事，而是让后续相似症状能够快速匹配机制。

每个 Case 至少记录：

- Baseline / environment
- Symptom
- Real entry path
- Evidence
- Root cause
- Why existing checks missed it
- Fix / chosen extension point
- Regression evidence
- Reusable diagnostic cue
- Version scope

优先来源：DSH postmortem、implemented bug-fix Agent Note、已合并 PR/Issue、真实领域项目。外部 Claude Code 案例只能放 comparison，不进入 DSH case corpus。

首批上游案例：

- `upstream/0001-acp-loader-inject-shadow.md`
- `upstream/0002-web-agent-acceptance-target.md`
- `upstream/0003-landlock-diagnostic-attribution.md`
