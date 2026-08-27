# 10 · DSH Plugin Build Artifact Debugging

## 为什么要单独记录这个问题

社区真实插件开发文档暴露了一个高频故障：开发者修改了仓库中的 `src/`，但 DSH Web 实际加载的可能是 profile 下已安装插件的 `lib/` 或安装时复制出的另一份代码。

于是会出现一种非常危险的假象：

```text
代码已经改了
↓
测试似乎通过
↓
Web UI 完全没变化
```

这时如果误判成“扩展点不工作”，就会继续改 Core、改 patch、重写插件，实际上只是 **改错了运行时真正加载的文件**。

---

## 一、必须先确认的四件事

任何 UI / Plugin 调试前，先回答：

1. 当前 DSH 使用哪个 profile？
2. 当前 profile 安装的是哪一个插件实例？
3. 运行时实际加载路径是什么？
4. 当前加载的是 `src/`、`lib/` 还是打包后的 bundle？

如果这四件事没确认，不要继续排查功能逻辑。

---

## 二、推荐排查顺序

### Step 1 · 确认运行实例

确认当前启动命令与 profile：

```text
dsh web
或
pnpm dsh web
```

以及对应：

```text
~/.dsh/profiles/<profile>/
```

### Step 2 · 确认插件注册

检查当前 profile 的插件注册/patch，确认：

- plugin id
- package name
- 安装位置
- 是否出现重复 id

### Step 3 · 确认真正加载的代码

重点检查：

```text
~/.dsh/profiles/<profile>/node_modules/<plugin>/
```

确认入口最终指向：

- `lib/`
- `dist/`
- `src/`
- 或 bundle artifact

### Step 4 · 修改后必须重新构建

如果 package.json 的入口指向构建产物：

```text
src 修改
→ build
→ 更新安装实例
→ restart dsh web
→ hard refresh
```

不能只改 `src/` 就认为完成。

### Step 5 · 验证当前页面确实来自新版本

最简单的方法是临时加入一个明确可识别的：

- console log
- version string
- UI marker

确认它出现在当前运行环境，再继续调试业务逻辑。

---

## 三、与“插件安装了但 UI 不变”的诊断树合并

遇到 UI 不生效时，推荐顺序调整为：

```text
1. 当前 profile 对吗？
2. 当前 plugin id 对吗？
3. 运行时加载路径对吗？
4. build artifact 是最新的吗？
5. dsh web 重启了吗？
6. 浏览器 hard refresh 了吗？
7. component 注册点才开始查业务代码
```

把“实际加载代码”放到 component / state 之前查，可以节省大量无效调试。

---

## 四、对 Laoli UI 研发的影响

后续开发自定义 UI 时，建议固定两套环境：

```text
laoli-ui-lab
laoli-ui-stable
```

Lab 用本地开发安装并允许频繁 rebuild；Stable 只接受经过真实运行验证的固定版本。

每次验证至少记录：

```text
DSH version
Plugin commit/version
Profile
Node version
Runtime load path
Build timestamp
```

这样以后出现“昨天能用、今天失效”时，能快速确认到底是代码、构建产物、profile 还是 DSH 升级导致。

---

## 五、原则

**不要相信你改了哪个文件，要确认运行时到底加载了哪个文件。**

这是 DSH 插件研发中最便宜、也最值得优先执行的一次检查。
