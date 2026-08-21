# Evidence Index

本目录保存研究证据索引，不复制大量上游源码。

## Baseline 2026-08-21

### DeepSeek Harness

- Repository: https://github.com/tudou0168-hub/deepseek-harness
- Upstream: https://github.com/deepseek-ai/deepseek-harness
- Version: `0.1.0-rc.8`
- Baseline commit: `141eb6fef83422698aef7a981029e843e8161534`

Primary paths reviewed in initial baseline:

- `AGENTS.md`
- `docs/architecture.md`
- `docs/subsystems/core.md`
- `docs/subsystems/session.md`
- `docs/subsystems/system-prompt.md`
- `docs/subsystems/subagent.md`
- `docs/subsystems/compaction.md`
- `docs/subsystems/approval.md`
- `packages/core/agent-loop/src/index.ts`
- `packages/preset/README.md`
- `packages/skill/README.md`
- `scripts/release/pack.ts`

### Comparative reference

- Repository: https://github.com/ZhangHanDong/harness-engineering-from-cc-to-ai-coding
- Role: comparative Harness Engineering research based on Claude Code implementation.
- Use policy: inspiration and comparison only; never sole evidence for DSH facts.

## Release artifact track

下一步研究时应针对 DSH 对应版本补充：

- npm package/tarball names
- tarball SHA256
- file manifest
- entry bundles
- Source Map presence
- Source Map hash and mapped source list（如存在）
- repo commit ↔ release artifact correspondence

若公开发布物没有 Source Map，只记录“Source Map unavailable”，不做伪还原。
