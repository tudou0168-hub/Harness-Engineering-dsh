# 020 · Government Document Agent Pattern

## 目标

研究 DSH 社区中与公文、政策检索、Office 交付相关的案例，并提炼可复用架构。

## 案例一：dsh-tool-gbt9704

该插件把 Markdown 或 Word 转为 GB/T 9704-2012 党政机关公文格式。它的工程价值在于把格式规范做成独立工具，而不是依赖大模型记住全部排版规则。

建议模式：

```text
内容 Agent
→ 结构化正文
→ 标准格式 Tool
→ 回读复核
→ 交付
```

## 案例二：dknowc-dsh

该插件组合提供政策/标准检索、来源追溯、公文写作和 Word 交付能力。关键思路是把“可信检索”和“专业写作”拆开。

建议模式：

```text
权威检索
→ 来源证据
→ 适用性判断
→ 专业写作
→ Office 交付
```

## 对专业文档 Agent 的启发

建议拆成五层：

1. Evidence：政策、标准、原始材料。
2. Reasoning：判断需求、变更范围和适用性。
3. Drafting：按专业规则组织正文。
4. Document Engineering：Word 格式、批注、目录、编号等。
5. Review / Delivery：回读修改区域并生成正式交付件。

## 结论

专业公文/方案 Agent 的核心不应只是 Prompt，而应是：

**证据来源 + 适用性判断 + 变更治理 + 专业写作 + 标准化 Office 交付。**
