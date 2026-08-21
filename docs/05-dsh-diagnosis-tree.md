# DSH Diagnosis Tree

## 原则

遇到问题先定位层，不直接改 Core。

## UI / Plugin

现象：插件不生效。

排查：
1. Plugin 是否加载。
2. Profile 是否挂载。
3. UI extension point 是否正确。
4. 构建资源是否更新。

## Agent 行为

现象：Agent 不按预期执行。

排查顺序：
1. Prompt
2. Runtime Context
3. Skill 加载
4. Tool 暴露
5. 外部状态文件
6. Session 恢复

## Tool

现象：工具调用异常。

排查：
- schema
- 权限
- 参数
- runtime 环境

## 长任务

现象：继续执行后状态丢失。

排查：
- 是否依赖纯上下文
- 是否有 externalized state
- 是否正确 continuation

## PPT Production

如果成品质量不稳定，优先检查：
- 专业 Prompt
- 原材料
- 设计规范
- 用户确认节点

不要默认归因于 DSH 架构。