# 019 · Browser DOM Bridge Pattern

## 结论

近期社区 `Lum1104/dsh-browser` 给出了一个值得单独记录的浏览器 Agent 路线：**不要默认用截图 + 视觉模型操作网页，而是让 Chrome 扩展把真实浏览器的结构化页面能力桥接给 DSH。**

它的定位是 Chrome sidebar extension，让 DeepSeek Harness 直接操作用户浏览器，并明确强调不依赖视觉能力。

## 为什么重要

我们之前把网上抓数据分为 Search/Fetch、JS Browser、真实登录态 Browser 三档。这个案例进一步说明第三档可以继续细分：

```text
公开静态信息
→ Search / Fetch

JS 动态网页
→ Headless Browser / Playwright

用户真实登录态网页
→ Browser Extension / DOM Bridge

必须依赖视觉判断的网页
→ Screenshot / Vision
```

因此“Browser Agent = Vision Agent”是错误假设。对大量后台、内容平台、管理系统，DOM/结构化交互通常更便宜、更稳定，也更容易记录证据。

## 对自媒体场景的价值

适合研究：
- 已登录内容平台的页面读取；
- 创作者后台数据查看；
- 选题与竞品页面采集；
- 需要复用用户真实浏览器登录态的操作。

但不要直接把它理解为“自动运营工具”。发布、删除、账号设置等高影响操作仍应保持显式确认与权限边界。

## 对政务/方案 Research Agent 的价值

适合把 Browser 输出标准化成 Evidence：

```text
Evidence
├── url
├── title
├── captured_at
├── extracted_content
├── interaction_path
├── screenshot_optional
└── supported_claims
```

Research Agent 消费 Evidence，而不是直接消费一段不可追踪的网页摘要。

## 工程判断

Laoli Workspace 后续不应只提供一个 browser tool，而应实现 Browser Capability Router：

1. 能 Search/Fetch 就不启动浏览器；
2. 需要 JS 才升级到 Playwright；
3. 需要真实登录态才进入浏览器扩展；
4. 只有 DOM 无法表达的信息才调用 Vision。

目标不是功能越多越好，而是用最低成本、最高可追踪性的能力完成任务。

## 来源

- https://github.com/Lum1104/dsh-browser （2026-08-29 检索）
