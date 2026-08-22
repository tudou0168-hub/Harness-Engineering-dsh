# 公文 / 方案 / Office 文档智能体：能力层应该怎么拆

## 结论先行

DSH 社区正在快速补齐 Office 文档能力，但当前多数项目解决的是“能读、能写、能预览”，并没有解决“如何高质量地写政务公文、建设方案、可研方案”。

这恰好说明我们的差异化方向：

```text
底层 Office 能力
+
专业文档工程 Skill
+
项目级修改流程
+
可视化预览 / 批注
```

而不是重新造一套 Office 解析器。

## 案例 A：dsh-office-tool

项目：`rong-coder/dsh-office-tool`

核心能力：
- docx / xlsx / pptx 创建、读取、查询、编辑
- 通过 OfficeCLI 执行
- 结构化 JSON 返回
- better-sidebar 高保真预览
- live watch 预览
- headless 与 Web UI 都可用

### 最值得借鉴的点

#### 1. Tool 和 UI 分层

工具负责真实文档操作，UI 只负责预览。

这是非常好的边界：

```text
Agent
 ↓
Office Tool
 ↓
真实文件

UI
 ↓
预览真实文件
```

而不是在前端维护一份“伪文档状态”。

#### 2. 结构化错误返回给 Agent

错误不仅返回失败，还带 error code + suggestion。

这对于长文档工程很重要，因为 Agent 需要能自修复，而不是遇到一次 Office 操作异常就重来。

#### 3. 文件预览是生产闭环的一部分

公文 / 方案 Agent 如果只能输出 DOCX，没有实时预览，用户就只能反复下载检查。

未来我们的文档工作台应直接看到：
- 当前 Word
- 修改位置
- 批注
- 高亮改动
- 最终版

## 案例 B：dsh-docs / dsh-document

这类项目主要解决多格式“读懂”：
- PDF
- Word
- Excel
- PowerPoint
- 图片
- OCR

其中有两个值得吸收的设计：

### 分页读取

大文档不应该一次性塞入上下文。应该：
- 转换为 Markdown / structured text
- offset / limit 分页
- 需要时再深入读取

### 本地处理

政务材料、企业内部材料特别适合 local-first：
- 文档不出本机
- OCR 本地
- 解析本地

## 对我们的公文 / 方案 Agent 的架构建议

### Layer 1：Document IO

复用社区工具，解决：
- 读取
- 编辑
- 预览
- 批注 / 高亮
- 导出

### Layer 2：Document Engineer Skill

这是我们的核心价值。

负责：
- 先理解客户变更 / 监理意见
- 判断修改范围
- 提出修改方案
- 用户确认后再改
- 保持原章节体系、语气、术语
- 标注新增 / 二开 / 变更内容

### Layer 3：Domain Skill

例如：
- 政务建设方案
- 可研
- 项目申报
- 汇报材料

专业知识不应该混进 Office Tool。

### Layer 4：Workspace UI

至少展示：
- 原材料
- 当前版本
- 变更要求
- 修改范围
- 待确认事项
- 当前输出物

## 一个关键判断

目前不应该研发“通用 Word 编辑器”。

社区 Office 工具已经说明底层能力会迅速成熟。我们的资源应该放在：

> 如何让 Agent 像一个真正的方案工程师，而不是一个会调用 docx API 的机器人。

## 研究来源

- https://github.com/rong-coder/dsh-office-tool
- https://github.com/Sqhao-O/dsh-docs
- https://github.com/jiaoqsh/dsh-document
- https://github.com/omdsh-dev/dsh-office
