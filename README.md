# Widget Builder Monorepo

一个基于 React 和 TypeScript 的可视化 Widget 构建器项目，采用 Turborepo 管理的 monorepo 架构。

## 📦 项目结构

```
widget-builder/
├── apps/
│   └── widget-builder/        # 主应用 - Widget 可视化构建器
├── packages/
│   ├── widget/                # 核心 Widget 库
│   ├── widget-renderer/       # Widget 渲染引擎
│   └── monaco-jsx-editor/     # Monaco 编辑器 JSX 支持
└── config/
    ├── eslint-config/         # 共享 ESLint 配置
    └── ts-config/             # 共享 TypeScript 配置
```

## 🚀 快速开始

### 环境要求

- Node.js >= 20.19 或 >= 22.12
- pnpm >= 10.11.1

### 安装依赖

```bash
pnpm install
```

### 开发

```bash
# 启动所有包的开发模式
pnpm dev

# 只启动主应用
pnpm --filter @widget-builder/app dev
```

### 构建

```bash
# 构建所有包（使用 Turborepo 并行构建和缓存）
pnpm build

# 构建特定包
pnpm --filter @deer-flow/widget build
```

### 代码质量

```bash
# 类型检查
pnpm type-check

# 代码检查
pnpm lint

# 自动修复
pnpm lint:fix

# 格式化代码
pnpm format
```

### 测试

```bash
# 运行所有测试
pnpm test

# 运行测试（单次）
pnpm test:run
```

## ⚡ Turborepo 集成

本项目使用 Turborepo 提供：

- **🚄 智能缓存**: 构建结果自动缓存，未改动的包跳过构建
- **⚙️ 并行执行**: 自动分析依赖关系，最大化并行执行
- **📈 增量构建**: 只构建发生变化的包及其依赖者

**性能提升**:

- 首次构建: ~12s
- 缓存命中: <1s
- 增量构建: 仅构建变更部分

详见 [Turborepo 集成说明](./TURBOREPO.md)

## 📚 包说明

### @widget-builder/app

可视化 Widget 构建器主应用，提供：

- 可视化组件拖拽界面
- 实时预览
- JSX 代码编辑器
- Widget 库管理

### @deer-flow/widget

核心 Widget 库，提供：

- Widget 定义和管理
- 表达式系统
- 状态管理工具
- JSX Schema 支持

### @deer-flow/widget-renderer

Widget 渲染引擎，负责：

- 将 Widget 配置渲染为 React 组件
- 处理动态表达式
- 管理组件状态

### monaco-jsx-editor

Monaco 编辑器 JSX/TSX 支持包，提供：

- JSX 语法高亮
- TypeScript 类型提示
- React 组件智能补全

## 🛠️ 技术栈

- **框架**: React 19
- **语言**: TypeScript 5.9
- **构建工具**: Vite 7 + Turborepo 2
- **包管理**: pnpm 10
- **编辑器**: Monaco Editor
- **UI 组件**: Radix UI + Tailwind CSS 4
- **测试**: Vitest

## 🔧 开发工具

### 针对特定包运行命令

```bash
# 构建 widget 及其所有依赖者
pnpm --filter @deer-flow/widget... build

# 在 widget 中运行测试
pnpm --filter @deer-flow/widget test

# 清理所有构建产物
pnpm -r exec rm -rf dist
```

### 查看构建信息

```bash
# 详细日志
pnpm build --verbose

# 查看任务依赖图
pnpm build --graph

# 强制重新构建
pnpm build --force
```

## 📄 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

更多信息请参考各包的 README 文档。
