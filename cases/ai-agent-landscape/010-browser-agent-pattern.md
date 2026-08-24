# 案例 010 · Browser Agent：网上抓数据不应只有 web_fetch，而要分层使用“读网页”和“操作网页”

## 结论先行

DSH 社区已经出现多种浏览器插件，说明“网上抓数据”正在从单纯 HTTP 获取，升级为可见、可操作、可追踪的 Browser Agent。

对于研究、自媒体、政务材料搜集和企业数据采集，推荐把浏览器能力分成三层：

```text
Layer 1  普通 Web Search / Fetch
Layer 2  JS 页面读取 / 截图
Layer 3  登录态真实浏览器操作
```

不是所有任务都直接启用真实浏览器。

## 一、两类代表实现

### 1. dsh-plugin-browser：Playwright Headless

核心能力：

- 打开 JS 渲染页面；
- 获取页面正文与链接；
- 点击、输入；
- 截图；
- 每个 Agent 独立 Browser Session。

它解决的是内置纯 HTTP 抓取无法处理的动态页面。

适合：

- 新闻/政策网站动态页面；
- 数据列表；
- 需要翻页或点击展开的信息；
- 截图留证。

### 2. dsh-pilot：真实 Chrome/Edge + 人机共驾

它不是只跑无头浏览器，而是通过 CDP 操作用户真实浏览器，同时提供 cockpit UI。

关键特点：

- Agent 读取结构化 DOM Snapshot；
- 点击/输入基于编号 ref，而不是让模型猜 CSS Selector；
- 每 Session 隔离；
- 用户能看到截图、URL、操作记录；
- 用户可以随时接管。

这对需要登录态的网站尤其重要。

## 二、一个关键工程判断：Ref-driven 优于 Selector-driven

传统 Browser Tool 常让模型生成：

```text
#submit-button > div:nth-child(2)
```

这很脆弱。

更稳的方式是：

```text
snapshot
  ↓
[12] 搜索框
[13] 搜索按钮
  ↓
click ref=13
```

优点：

- 减少模型猜测 CSS；
- 页面变化后能显式报“ref 已过期”；
- 更容易审计操作过程。

如果后续自研 Browser Agent，建议优先采用 **snapshot + ref interaction** 模式。

## 三、对“网上抓数据 Agent”的建议架构

不要做成一个“大浏览器工具”。

建议：

```text
Research Agent
    │
    ├── search_web          快速发现来源
    ├── fetch_page          读静态正文
    ├── browser_read        JS/复杂页面
    ├── browser_interact    登录/点击/翻页
    └── capture_evidence    截图/URL/时间/摘要
```

模型按成本和风险逐级升级。

## 四、对政务与方案研究的价值

政务研究常见问题不是搜不到，而是：

- 政策页面需要 JS；
- 附件链接隐藏在页面交互中；
- 地方政府网站结构不统一；
- 需要保留来源证据。

因此建议研究工作流统一生成 Evidence Object：

```text
source_url
page_title
access_time
captured_text
screenshot(optional)
related_file
claim_supported
```

后续写建设方案、可研、政策分析时，Agent 使用证据对象，而不是依赖上下文里一段临时网页内容。

## 五、对自媒体研究的价值

对于小红书、抖音、B站等平台：

- 搜索/推荐页面高度动态；
- 登录态和 Cookie 很重要；
- 纯 HTTP 抓取往往不完整；
- 自动操作存在账号风控。

因此不建议一开始追求“大规模自动爬取”。

更可控的模式：

```text
人工登录
→ Agent 辅助浏览
→ 用户可见操作
→ 抽取选题/标题/评论结构
→ 存入本地内容库
```

优先“半自动研究助手”，后续再根据真实需求扩大自动化。

## 六、安全和工程边界

Browser Agent 的权限明显高于普通 Web Search，应至少区分：

### Read Actions

- navigate
- snapshot
- screenshot

默认可开放。

### Write Actions

- click 提交
- type 表单
- 登录操作
- 上传文件

建议显式权限或用户确认。

社区已有 browser-automation 项目专门加入 approval audit、egress 限制与真实 Harness acceptance，这说明 Browser Agent 后续进入企业/政务场景时，不能只看“能不能点网页”，还要看行为边界和审计。

## 七、Laoli Workspace 建议

未来 Research Workspace 可以设计为：

```text
左侧：研究任务 / 来源
中间：Agent 对话 / 研究笔记
右侧：Browser Cockpit / Evidence
底部：抓取记录 / 文件 / 引用
```

DSH Session 是执行上下文；Browser Session 是工具状态；Evidence 是业务产物。

三者不要混成一份聊天记录。

## 八、判断

Browser Agent 是下一阶段非常高价值的基础能力，但正确路线不是“自己造一个爬虫平台”，而是：

> **复用社区成熟浏览器插件，把研发重点放在 Research Agent 的任务策略、证据模型、来源治理与工作台体验上。**