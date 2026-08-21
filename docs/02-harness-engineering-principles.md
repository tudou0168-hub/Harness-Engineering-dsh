# Harness Engineering 核心原则（DSH 版）

这些原则不是照搬 Claude Code，而是基于 DSH 当前实现重新提炼。

## P1：状态归一——一个事实只设一个权威拥有者

DSH 的典型做法是让 Session log 成为交互事实源，模型 history 从它派生；continuable child 用 durable Session identity 表示长期身份。

生产智能体应避免：

- Session 一套状态，Orchestrator 再维护一套近似状态。
- Agent 自己记进度，外部数据库再保存另一份无法严格同步的进度。
- Reviewer 和 Producer 同时拥有“最终设计状态”。

能从权威源派生的状态，不另建第二份。

## P2：Prompt 是行为控制面，代码是结构与安全控制面

适合 Prompt/Skill/Preset 的内容：角色、方法、风格、工作顺序、领域经验、何时调用某技能。

适合代码的内容：权限、身份、durable lifecycle、schema、取消、工具执行、并发安全、不可变事实。

反模式是为每种“不喜欢的模型行为”编写 checker 或 if/else。

## P3：组合优先于修改 Core

DSH 的插件架构与 agent scope 已经允许大量组合。领域项目应先组合原生能力，再考虑新插件，最后才是 Core change。

## P4：上下文是工作集，不是档案馆

模型上下文只应保留当前决策需要的信息。完整事实、项目文件、日志和历史应留在可重读的外部状态中。

长任务正确的问题不是“怎样把所有历史一直留在窗口”，而是“怎样保证 Agent 随时可以恢复正确工作集”。

## P5：Continuation 优先于复制 Agent

当工作本质上属于同一个长期责任主体，优先恢复同一个 durable Agent/Session，而不是为了获得 fresh context 创建多个同职 Agent。

新 Agent 适合：真正独立的调查、隔离任务、不同权限或不同责任主体。

## P6：失败必须可见，降级必须显式

DSH 多个能力使用 fail-loud / fail-closed 思路。生产智能体不应在能力缺失时静默“差不多执行”。

例如：

- 没有必要 Tool → 明确失败或回退人工。
- 无 approval answerer → 不能默认放行。
- 子 Agent provider 不支持某 capability → 启动前拒绝，而不是忽略配置。

## P7：模型可见信息必须可追溯

DSH 强调 model-visible 与 durable log 的对应关系。领域智能体的关键动态输入也应可追溯：用户反馈、阶段确认、关键项目事实、Prompt 版本等不能只存在于瞬时变量中。

## P8：观察重复问题，再升级机制

不要从一次失败推导系统规则。先通过真实任务记录失败模式；只有跨任务重复发生，才决定修改 Prompt、Preset、Tool 或底层能力。

## P9：人类确认是业务控制点，不是装饰性 QA

如果人的判断真正改变方向、风险或最终业务结果，就应该是正式生产步骤；否则不要为了“看起来可靠”增加确认。

## P10：领域专家拥有专业决策，Orchestrator 只拥有阶段推进

Orchestrator 最容易膨胀。它一旦开始替领域 Agent 做内容判断、视觉判断、代码设计或业务取舍，就会形成第二套专家系统。

正确模式是：Orchestrator 决定“何时进入哪一步”，领域 Agent 决定“这一步专业上怎么做”。
