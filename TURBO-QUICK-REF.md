# Turborepo 快速参考

## ⚡ 常用命令

| 命令              | 说明       | 缓存 |
| ----------------- | ---------- | ---- |
| `pnpm build`      | 构建所有包 | ✅   |
| `pnpm dev`        | 开发模式   | ❌   |
| `pnpm lint`       | 代码检查   | ✅   |
| `pnpm type-check` | 类型检查   | ✅   |
| `pnpm test`       | 运行测试   | ✅   |

## 🎯 过滤器使用

```bash
# 单个包
pnpm --filter @deer-flow/widget build

# 包及其依赖
pnpm --filter ...@deer-flow/widget build

# 包及其依赖者
pnpm --filter @deer-flow/widget... build

# 多个包
pnpm --filter @deer-flow/widget --filter monaco-jsx-editor build
```

## 🔧 Turbo 参数

```bash
# 查看详细日志
pnpm build --verbose

# 查看任务图
pnpm build --graph

# 强制重建（跳过缓存）
pnpm build --force

# 并行度控制
pnpm build --concurrency=4

# 继续执行（即使有错误）
pnpm build --continue

# 只显示错误
pnpm build --output-logs=errors-only
```

## 📊 缓存管理

```bash
# 查看缓存统计
turbo run build --summarize

# 清理 Turbo 缓存
rm -rf .turbo

# 清理所有构建产物
pnpm -r exec rm -rf dist
```

## 🚀 性能对比

**无缓存（首次构建）**:

```
Tasks:    4 successful
Time:     ~12s
```

**完全缓存**:

```
Tasks:    4 successful
Cached:   4 cached
Time:     240ms >>> FULL TURBO
```

**性能提升**: ~50x ⚡

## 🎨 开发技巧

### 1. 只开发需要的包

```bash
# 只运行 app 的开发服务器
pnpm --filter @widget-builder/app dev
```

### 2. 增量构建

```bash
# 只构建自上次 commit 以来改变的包
pnpm build --filter=[HEAD^1]
```

### 3. 依赖图可视化

```bash
# 生成依赖关系图
pnpm build --dry-run --graph=graph.html
```

### 4. 本地开发工作流

```bash
# 1. 安装依赖
pnpm install

# 2. 构建依赖包
pnpm --filter @deer-flow/widget build
pnpm --filter monaco-jsx-editor build

# 3. 启动 app
pnpm --filter @widget-builder/app dev
```

## 🐛 故障排除

### 缓存不一致

```bash
# 清理并重建
rm -rf .turbo node_modules/.cache
pnpm build --force
```

### TypeScript 错误

```bash
# 清理 TS 构建信息
pnpm -r exec rm -rf tsconfig.tsbuildinfo
pnpm type-check
```

### 依赖问题

```bash
# 重新安装依赖
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 📝 配置文件位置

- **Turbo 配置**: `turbo.json`
- **pnpm 配置**: `.npmrc`
- **工作区配置**: `pnpm-workspace.yaml`
- **忽略文件**: `.gitignore` (含 `.turbo`)

## 🔗 相关链接

- [Turborepo 文档](https://turbo.build/repo/docs)
- [pnpm 文档](https://pnpm.io/)
- [完整说明](./TURBOREPO.md)
