# Turborepo 集成说明

本项目已成功集成 Turborepo，以提升开发体验和构建效率。

## 🚀 主要优势

### 1. **智能缓存**

Turborepo 会缓存构建结果。如果代码没有改变，后续构建将直接使用缓存，大幅提升速度。

```bash
# 首次构建
pnpm build  # 完整构建，需要 ~12s

# 再次构建（无代码改动）
pnpm build  # 使用缓存，几乎瞬间完成
```

### 2. **并行执行**

Turborepo 会自动分析依赖关系，并行执行可以并行的任务。

例如：

- `@deer-flow/widget` 和 `monaco-jsx-editor` 没有相互依赖，会并行构建
- `@deer-flow/widget-renderer` 依赖 `@deer-flow/widget`，会等待后者完成

### 3. **增量构建**

只构建发生变化的包及其依赖者，节省时间。

## 📦 可用命令

```bash
# 构建所有包
pnpm build

# 开发模式（所有包）
pnpm dev

# 类型检查
pnpm type-check

# 代码检查
pnpm lint

# 自动修复代码问题
pnpm lint:fix

# 运行测试
pnpm test

# 格式化代码
pnpm format
```

## 🎯 针对特定包运行命令

```bash
# 只构建 widget 包
pnpm --filter @deer-flow/widget build

# 只在 app 中运行 dev
pnpm --filter @widget-builder/app dev

# 构建 widget 及其所有依赖者
pnpm --filter @deer-flow/widget... build
```

## ⚙️ 配置文件

### `turbo.json`

定义了所有任务的配置：

- **build**: 有依赖关系 (`dependsOn: ["^build"]`)，会缓存 `dist/` 输出
- **dev**: 持久化任务 (`persistent: true`)，不缓存
- **lint/type-check**: 依赖构建完成，缓存结果
- **test**: 缓存测试结果和覆盖率报告

### `.npmrc`

优化了 pnpm 配置以更好地配合 Turbo：

- 启用共享依赖提升（eslint、prettier、typescript）
- 配置缓存存储位置
- 优化依赖安装性能

## 🔍 查看构建信息

```bash
# 查看任务执行的详细日志
pnpm build --verbose

# 查看任务图
pnpm build --graph

# 强制重新构建（跳过缓存）
pnpm build --force

# 仅构建变更的包
pnpm build --filter=[HEAD^1]
```

## 📊 性能对比

**集成前**（使用 `pnpm -r build`）：

- 每次都完整构建所有包
- 串行执行，效率较低
- 约 15-20s

**集成后**（使用 Turborepo）：

- 首次构建：~12s（并行执行）
- 缓存命中：<1s
- 增量构建：只构建变更部分

## 🛠️ 最佳实践

1. **提交前运行检查**

   ```bash
   pnpm lint && pnpm type-check && pnpm build
   ```

2. **开发时只运行需要的包**

   ```bash
   # 只开发 app
   pnpm --filter @widget-builder/app dev
   ```

3. **清理缓存**（如遇到问题）
   ```bash
   rm -rf .turbo node_modules/.cache
   ```

## 📝 依赖关系图

```
┌─────────────────────────────────────┐
│ @deer-flow/widget                   │
│ (核心 Widget 库)                    │
└────────────┬────────────────────────┘
             │
             ├──────────────────────────────────┐
             │                                  │
             ▼                                  ▼
┌─────────────────────────────┐  ┌──────────────────────────┐
│ @deer-flow/widget-renderer  │  │ monaco-jsx-editor        │
│ (Widget 渲染器)             │  │ (独立包)                 │
└────────────┬────────────────┘  └────────┬─────────────────┘
             │                            │
             └──────────┬─────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │ @widget-builder/app   │
            │ (主应用)              │
            └───────────────────────┘
```

## 🔗 相关资源

- [Turborepo 文档](https://turbo.build/repo/docs)
- [Turborepo 缓存策略](https://turbo.build/repo/docs/core-concepts/caching)
- [任务依赖配置](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)

---

如有任何问题或建议，请提交 Issue。
