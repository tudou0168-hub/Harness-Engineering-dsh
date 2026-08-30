# 12 · Role Library vs Capability Pack

## 问题

DSH 社区已经出现包含数百个角色定义的 Skill/Agent 库，例如营销、设计、小红书、抖音、ToG 等角色集合。它们适合快速试验，但不等于生产级专业 Agent。

## 核心区分

### Role Library

主要提供：

- persona
- 任务视角
- 写作或分析习惯
- 领域提示词

优点：启动快、覆盖广。

缺点：

- 不保证工具可执行；
- 不保证状态可恢复；
- 不保证交付物经过检查；
- 不保证来源可信；
- 容易导致大量相似角色并存。

### Capability Pack

生产级能力包应该至少包含：

```text
Preset
+ Skill
+ Tool
+ Evidence / Input contract
+ Artifact contract
+ Review rule
```

例如“自媒体 Agent”不应只是“小红书运营专家”角色，而应包含：

```text
热点/素材发现
→ Evidence
→ 内容策划
→ 脚本生产
→ 平台适配
→ Artifact
→ 发布/复盘
```

“政务方案 Agent”也不应只是“政府 ToG 专家”角色，而应包含权威材料、变更范围判断、正式文档生成和回读确认。

## 对研发方向的约束

后续研究发现角色库时，只把它们视为：

- Prompt 素材
- Persona 参考
- 场景枚举

不要直接把“角色数量”当作 Agent 能力数量。

## 结论

**Role 是界面，Capability 才是生产力。**

Laoli Workspace 后续应建设少量、深度验证的 Capability Packs，而不是维护几百个角色。
