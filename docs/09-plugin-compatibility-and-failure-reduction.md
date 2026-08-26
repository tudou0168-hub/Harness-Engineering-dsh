# 09 · Plugin Compatibility & Failure Reduction

## 为什么现在必须加这一章

DSH 仍处于 Developer Preview，官方明确说明会发生破坏兼容性的变化。与此同时，社区插件数量迅速增长，插件的安装成功并不代表运行期一定兼容。

2026-08-25 社区出现 Upstream Radar：专门持续验证“具体插件发布物 × 具体 DSH 版本 × Node/profile × 依赖图”的真实可装载关系。另有 dsh-plugin-reducer 用于寻找能够复现故障的最小插件集合。

这说明：**插件兼容性已经从偶发问题变成正式工程问题。**

---

## 一、不要把“能安装”当作“兼容”

插件至少要经过四层验证：

```text
Install
→ Register
→ Load
→ Real Tool / UI Execution
```

很多问题只在最后一步出现。

典型情况：第三方插件依赖某个 DSH 内部包，引入第二份模块实例，最终让所有 Tool call 在 Agent Loop 中崩溃。此类故障可能发生在“插件甚至还没真正加载业务逻辑”之前。

因此排障时不要默认：

> 装了 A 插件以后坏了 = A 插件业务代码有 bug。

还可能是：
- 包依赖重复；
- peer dependency 范围；
- profile 不一致；
- bundle 装载顺序；
- DSH rc 版本变化；
- Node / pnpm 行为。

---

## 二、我们应该采用的插件引入流程

以后 Laoli Workspace / PPT Production / Document Agent 引入社区插件时，统一按以下流程：

### Step 1 · 记录精确版本

记录：

```text
DSH version / commit
Plugin version / commit
Node version
Profile
OS
```

### Step 2 · 隔离测试

不要直接安装到生产 profile。

使用独立测试 profile：

```text
web-lab
ppt-lab
document-lab
research-lab
```

### Step 3 · 验证真实链路

不是只看启动日志。

至少验证：
- plugin 是否注册；
- model 是否看见 Tool；
- Tool 是否真实调用成功；
- UI extension 是否真实显示；
- Session 恢复后是否仍正常。

### Step 4 · 保留回滚路径

记录：
- 安装命令；
- 删除命令；
- patch 变化；
- package-lock / pnpm-lock 变化。

---

## 三、故障时使用“最小插件集合”方法

当一个 profile 安装十几个插件后出现问题，不要靠猜。

正确办法类似 delta debugging：

```text
全部插件失败
↓
去掉一半
↓
是否仍失败？
↓
继续二分
↓
得到最小复现集合
```

最终目标：

```text
DSH + Plugin A + Plugin B = fail
DSH + A = pass
DSH + B = pass
```

这种证据比“感觉是某插件冲突”有价值。

---

## 四、对我们的实际项目的影响

### PPT Production

不要把新 UI / Office / Preview / Browser 插件直接塞入当前稳定生产 profile。

建议：

```text
ppt-production-stable
ppt-production-lab
```

stable 只保留已验证能力；lab 用于每日研究和试验。

### Document Agent

Office 文件插件变化快，特别是：
- OfficeCLI
- dsh-cowork
- dsh-office-tool
- dsh-files

建议先在 document-lab 验证读取、修改、保存、回读，再进入生产。

### Laoli Workspace

工作台未来会挂多个 Capability Pack，因此更需要 profile / bundle 隔离。

不要形成一个装 100 个插件的“万能 profile”。

---

## 五、推荐的能力包版本清单

未来每个 Capability Pack 都维护简单 manifest：

```yaml
name: ppt-production
verified:
  dsh: 0.1.0-rc.x
  node: 24.x
plugins:
  - name: xxx
    version: x.x.x
    status: verified
```

不需要复杂依赖平台；一个版本化 YAML 已足够解决大量问题。

---

## 六、快速诊断顺序

如果“昨天还能用，今天升级后坏了”：

1. DSH 是否升级；
2. Plugin 是否升级；
3. Lockfile 是否变化；
4. 是否出现重复 `@deepseek-ai/*` 包实例；
5. Profile patch 是否变化；
6. 用最小 profile 重现；
7. 再看业务代码。

---

## 结论

下一阶段 DSH 工程研究不能只研究“有什么插件”，还必须记录：

> **这个插件在什么版本组合下被真实验证过。**

对我们而言，最值得建立的不是大型插件市场，而是一个小型、可信、场景化、带版本证据的 Capability Pack 清单。