# Playbook: 验证真实入口，而不是验证替身

## 何时使用

适用于以下情况：unit/snapshot 全绿但真实产品失败；手工 mount 正常但 profile/Loader 启动失败；build/HTTP 200 正常但用户实际界面不对；source 修改后测试可能误用旧 `lib/`。

## 步骤

1. **命名真实入口**：CLI/profile、Web、ACP、headless、subagent provider、具体 preset。不要用内部 helper 代替入口。
2. **确认运行平面**：当前执行的是 `src` 还是 built `lib`/bundle；记录版本、commit、cwd、profile patch 和实际 composed config。
3. **运行 headline operation**：例如问题是 `session/new`，测试必须真正执行 `session/new`；问题是当前 GUI，则验证当前 canonical origin，不启动替代端口。
4. **记录权威证据**：Session event、request/header、structured tool/error code、process exit、browser state；不要只看 stdout 文案。
5. **构造反证**：临时恢复已知 bug 或破坏目标机制，验证测试确实会红。不能红的 regression 没有证明力。
6. **分层验证**：低层 unit 证明纯逻辑；boundary fake 证明平台/协议组合；assembled e2e/snapshot 证明真实产品路径。

## 失败判定

以下证据不能单独宣称“真实问题已修复”：

- 行覆盖率 100%。
- snapshot refresh 后全绿。
- HTTP 200。
- build success。
- 手工 `ctx.plugin(...)` mount 成功。
- 新起一个替代实例正常。
- timeout 导致 nonzero exit。

## 关联案例

- `cases/upstream/0001-acp-loader-inject-shadow.md`
- `cases/upstream/0002-web-agent-acceptance-target.md`
- `cases/upstream/0003-landlock-diagnostic-attribution.md`
