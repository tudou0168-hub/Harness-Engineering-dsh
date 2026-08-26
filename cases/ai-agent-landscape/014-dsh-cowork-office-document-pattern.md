# 社区案例 014 · DSH Cowork：Office 文档作为 Agent 一等输入输出

## 结论

DSH Cowork 值得重点关注，不是因为它“又能读 Word/Excel/PPT”，而是因为它把 **Office 文档变成可寻址、可核对、可安全修改的 Agent 对象**。

这对公文、建设方案、可研、报价清单、PPT 等场景非常关键。

## 已验证能力

项目公开说明提供 `doc_read` / `doc_write`：

- 读取 xlsx：按单元格窗口寻址；
- 读取 pdf：按页读取；
- 读取 docx；
- 读取 pptx：可按 shape id 定位；
- 读取 ipynb：按 cell 与 output；
- 写入阶段当前重点支持 xlsx 与 ipynb；
- 提供 zip-bomb 限制、宏格式拒绝、只读模式、hash 校验修改、原子写入和截断提示。

这说明一个成熟文档 Agent 不应只把文档“转成一大段文本”，而应该保留可寻址结构和修改证据。

## 对我们的直接启示

### 1. 长文档不要默认整篇塞进上下文

对于数百页 Word / PDF，推荐结构：

```text
原文件
  ↓
结构化索引
  ↓
页 / 章节 / shape / cell 定位读取
  ↓
Agent 按任务拉取必要片段
```

而不是：

```text
整份文件 → Markdown → 一次性塞入 Prompt
```

后者会导致 token 浪费、上下文漂移和修改定位困难。

### 2. 公文/方案 Agent 的核心不是“读文档工具”

底层读取和写入能力可以复用社区工具；真正应该自研的是上层专业流程：

```text
客户需求 / 变更
→ 理解变更意图
→ 定位影响章节
→ 提出修改范围
→ 用户确认
→ 精确修改
→ 标注变化
→ 再读回核对
→ 交付
```

### 3. PPT 复刻同样适用“对象寻址”思想

图片 1:1 转可编辑 PPT 时，不应只保存“第 5 页有问题”，而应尽量映射到：

```text
P05
├── title_shape
├── process_block_03
├── right_note_02
└── footer_summary
```

这样 Render → Compare → Fix 才容易形成稳定闭环。

## 建议

Laoli Document Agent 不要自己重新发明 Office 解析器。优先研究并复用：

- DSH Cowork
- dsh-office-tool
- dsh-files

自研重点放在：

- 专业写作规则；
- 变更判断；
- 证据与批注；
- 长任务状态；
- 人工确认点。

## 风险

DSH 仍处于 developer preview，插件兼容性需要按具体版本验证；文档工具层尤其应避免依赖未公开内部 API。