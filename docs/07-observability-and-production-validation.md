# 可观测性与生产验证

## 1. 先利用 Session Log

DSH 已经把 turn、step、user/message、assistant/message、tool/call、tool/result、request/header 等作为 durable events。

研究生产问题时，第一选择是从 Session 还原真实生命周期，不是马上再建一套 telemetry database。

## 2. 观察什么

生产智能体至少关注：

- 使用了哪个 preset / prompt version。
- 关键用户决策何时进入 Session。
- 每阶段读了哪些 authoritative artifacts。
- 工具调用是否实际执行。
- 失败发生在模型、工具、permission、continuation 还是业务逻辑。
- Context pressure/compaction 前后是否丢失关键工作状态。
- 最终产物是否达到业务目标。

## 3. 结构化验证的边界

验证分三类：

1. **结构正确性**：文件存在、格式可打开、schema 正确。
2. **执行正确性**：工具真的运行、流程真的完成。
3. **业务质量**：最终产物是否好。

前两类适合自动检查；第三类不能被简单 PASS/FAIL 规则完全替代。

## 4. Reviewer 的正确位置

Reviewer 只有在“独立判断本身具有价值”时使用：

- 默认只读。
- 不拥有生产状态。
- 不直接修改生产者工件，除非用户明确设计成修复 Agent。
- 不能因为 Reviewer 存在就让 Producer 放弃自检。

## 5. Observe Before Fix

出现问题先记录跨项目证据：

```text
问题出现次数
共同阶段
共同输入特征
共同 Prompt/Tool 路径
是否可重现
最终质量影响
```

只有重复问题才升级为系统层变更。
