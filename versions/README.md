# Versions

保存 DeepSeek Harness 版本差异和发布物验证结果。

每个版本至少记录：

- version / tag / source commit
- public package set
- tarball integrity/hash 和 file manifest
- build entry / bundle layout
- Source Map 是否存在；存在时记录 hash 和 mapped source list
- core lifecycle / Session event / config / preset / subagent / permission 等对专家判断有影响的变化
- 与上一研究版本相比：unchanged pattern / changed implementation / removed behavior / new limitation

版本研究的目标不是记录 changelog，而是回答：“旧案例和旧指导在这个版本还能不能用？”

当前 V0 只锁定了 `0.1.0-rc.8` 源码基线；发布 tarball 与 Source Map 证据仍需补齐，因此任何“发布包真实行为”结论暂时不能只由仓库源码推导。
