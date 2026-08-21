# 生产智能体设计指南：基于 DSH 的最小正确架构

## 1. 先做问题分类

每次研发先判断问题属于：

- A. Agent 编排
- B. Domain Prompt / Skill
- C. Context
- D. Tool / Capability
- E. Permission / Approval
- F. Continuation / Session
- G. 最终业务质量
- H. 部署 / Portable / 环境

不要把 G 类问题直接改成 A 类系统工程。

## 2. 推荐的通用生产结构

```text
User
↓
Thin Main / Coordinator
↓
Domain Router（可选）
↓
Deterministic Orchestrator（仅在确有阶段流程时）
↓
One domain expert Agent
↓
DSH native tools / session / context / continuation
↓
Domain output
```

可选旁路：只读 Reviewer、独立 Research Agent、特定高风险 Approval。

## 3. Thin Main 原则

Main 负责：

- 接收输入。
- 初始化任务。
- 调用领域路由。
- 推进阶段。
- 展示真正需要人判断的 checkpoint。
- 交付最终产物。

Main 不应该：

- 重新做领域专家判断。
- 自由生成每阶段复杂 Prompt。
- 维护另一份专业状态。
- 直接修改领域工件，除非它本身就是领域执行者。

## 4. Deterministic Orchestrator 的适用边界

适合：

- 有明确业务阶段。
- 某些阶段必须等待用户决定。
- 同一 Agent 需要暂停/继续。
- 每个 action 对应稳定阶段 Prompt。

不适合：

- 为简单单轮任务增加状态机。
- 把专业决策编码进大量 if/else。
- 复制 Agent runtime 状态。

## 5. Single Expert Agent 优先

如果整个产物需要统一专业判断、风格和连续责任，默认一个 continuable domain Agent。

多 Agent 只在独立性和并行收益明确时使用。

## 6. 生产质量改进顺序

当系统已稳定运行但结果不够好：

1. 检查领域内容取舍。
2. 检查 Prompt/Skill 方法。
3. 检查输入材料和 authoritative artifacts。
4. 检查 Context hygiene。
5. 检查工具能力是否限制表达。
6. 检查模板/品牌/专业规则。
7. 只有发现重复的结构性限制，才修改 Harness。

## 7. 何时值得修改 DSH 底层

必须同时满足：

- 问题跨多个真实项目重复。
- 不能通过 Prompt / Preset / Skill / Tool / Event / Context / existing capability 解决。
- 根因属于底层结构性能力。
- 修改后可通过完整生命周期验证。
- 不会生成与已有 DSH 机制平行的第二套事实源。

## 8. 反工程化检查

任何新增模块前问五个问题：

1. DSH 已经有同类能力吗？
2. 这是重复问题还是一次性问题？
3. 能否通过更清晰的 Prompt 或 Context 解决？
4. 新模块会不会产生第二份状态？
5. 删除这个模块，最终质量真的会明显下降吗？

如果第五个问题答不清楚，先不要加。
