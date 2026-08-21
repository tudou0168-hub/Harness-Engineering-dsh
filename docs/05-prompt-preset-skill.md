# Prompt、Preset、Skill：三种不同的控制层

## 1. Prompt：告诉模型怎么工作

适合：

- 角色和专业方法。
- 领域判断原则。
- 工作顺序。
- 输出要求。
- 风格与审美偏好。

不要把权限、durable state、工具真实可用性只写在 Prompt 里。

## 2. Preset：决定一个 Session 由什么组成

DSH Preset 是 per-session agent composition。它可以给某个 Agent 独立的 Tool、Prompt section、persona 和局部插件组合，同时共享进程级基础设施。

Preset 适合定义“这个 Agent 是什么工作环境”，不适合塞具体项目事实。

推荐分离：

```text
Preset = 稳定生产环境
Project Task = 当前项目动态输入
Professional Prompt / Skill = 领域方法
Runtime Context = 当前阶段事实
```

## 3. Skill：可复用的结构化方法知识

DSH Skill capability 把可复用 instructions 暴露给模型，通过 provider-neutral catalog/loader 加载。

Skill 适合：

- 专项方法。
- 稳定的操作流程。
- 可重复使用的领域经验。

Skill 不应演化为第二个 Agent Runtime。

## 4. Prompt Router 的正确职责

如果一个 Router 的任务只是识别“哪套专业方法适合当前项目”，它应该在选择后结束。

反模式：Router 继续做 storyline、planning、execution、review，最终与领域 Agent 职责重叠。

## 5. 稳定 Prompt 与阶段 Prompt

稳定层：身份、最高原则、专业方法、工具使用习惯。

阶段层：当前阶段目标、用户刚确认的方向、需要恢复的文件路径、停止条件。

阶段 Prompt 最好由确定性 Orchestrator 选择固定模板，而不是让 Coordinator 每次自由拼接长 Prompt。
