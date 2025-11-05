# Common Variants System

这个文件提供了一个通用的 variants 系统，用于统一处理所有 widget 组件的样式属性。

## 概览

`variants.ts` 文件包含了：

1. **通用变体定义** (`commonVariants`) - 可重用的样式变体
2. **类型定义** - 通用样式属性的 TypeScript 类型
3. **工具函数** - 处理样式转换的辅助函数
4. **统一处理函数** (`processCommonStylingProps`) - 批量处理所有通用样式属性

## 使用方法

### 在新组件中使用

```tsx
import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  commonVariants,
  processCommonStylingProps,
  type CommonStylingProps,
  type FlexProps,
} from "./variants";

const myComponentVariants = cva("base-classes", {
  variants: {
    // 使用通用的 variants
    padding: commonVariants.padding,
    background: commonVariants.background,
    radius: commonVariants.radius,

    // 添加组件特有的 variants
    variant: {
      primary: "text-primary",
      secondary: "text-secondary",
    },
  },
  defaultVariants: {
    padding: "none",
    background: "none",
    radius: "none",
    variant: "primary",
  },
});

export interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof myComponentVariants>,
    CommonStylingProps,
    FlexProps {
  // 组件特有的 props
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  (
    { className, padding, background, radius, variant, style, ...props },
    ref
  ) => {
    // 使用统一处理函数处理通用样式属性
    const { additionalClasses, inlineStyles, restProps } =
      processCommonStylingProps(props);

    // 合并样式
    const mergedStyles = { ...inlineStyles, ...style };

    return (
      <div
        className={cn(
          myComponentVariants({
            padding:
              typeof padding === "string" &&
              commonVariants.padding.hasOwnProperty(padding)
                ? padding
                : undefined,
            background,
            radius,
            variant,
          }),
          additionalClasses.join(" "),
          className
        )}
        style={Object.keys(mergedStyles).length > 0 ? mergedStyles : undefined}
        ref={ref}
        {...restProps}
      />
    );
  }
);
```

## 支持的通用属性

### 布局属性

- `gap` - 间距 (支持预设值和自定义值)
- `padding` - 内边距 (支持预设值、自定义值和对象形式)
- `margin` - 外边距 (支持预设值、自定义值和对象形式)

### 尺寸属性

- `width`, `height` - 宽度和高度
- `size` - 同时设置宽度和高度的快捷方式
- `minWidth`, `minHeight`, `minSize` - 最小尺寸约束
- `maxWidth`, `maxHeight`, `maxSize` - 最大尺寸约束
- `aspectRatio` - 宽高比

### 样式属性

- `background` - 背景色 (支持主题色标记、原始色标记、CSS 值)
- `border` - 边框 (支持数字像素值和对象形式)
- `radius` - 圆角半径

### Flex 属性 (用于布局组件)

- `align` - 交叉轴对齐
- `justify` - 主轴对齐
- `wrap` - 换行行为
- `flex` - Flex 增长/收缩因子

## 值的处理方式

### 预设值

使用 `commonVariants` 中定义的预设值会生成优化的 Tailwind 类：

```tsx
<Row gap={2} padding="md" />
// 生成: gap-2 p-4

<Col gap={3} align="center" />
// 生成: gap-3 items-center
```

### 自定义值

非预设值会被转换为任意值类：

```tsx
<Row gap="1.5rem" padding={20} />
// 生成: gap-[1.5rem] p-[20px]

<Col height="100vh" width={300} />
// 生成: h-[100vh] w-[300px]
```

### 对象形式 (padding/margin)

支持对象形式的精确控制：

```tsx
<Row margin={{ top: 4, bottom: 8, x: 2 }} />
// 生成: mt-4 mb-8 mx-2

<Col padding={{ y: 6, x: 4 }} />
// 生成: py-6 px-4
```

### 边框对象

支持详细的边框配置：

```tsx
<Row border={{ width: 2, color: "red-500", style: "dashed" }} />
// 生成: border-[2px] border-red-500 border-dashed
```

## 扩展现有组件

要将现有组件迁移到使用通用 variants 系统：

1. 导入必要的类型和函数
2. 用 `commonVariants` 替换重复的变体定义
3. 扩展 props 接口以包含 `CommonStylingProps`
4. 在组件中使用 `processCommonStylingProps` 函数
5. 更新类名生成逻辑

## 优势

1. **代码复用** - 避免在每个组件中重复相同的样式逻辑
2. **一致性** - 所有组件使用相同的样式处理方式
3. **类型安全** - 完整的 TypeScript 类型支持
4. **灵活性** - 支持预设值和自定义值
5. **易于维护** - 样式逻辑集中在一个地方
6. **扩展性** - 易于添加新的通用样式属性

## 示例组件

参考 `Row`、`Col` 和 `Box` 组件的实现，了解如何正确使用这个系统。

### 布局组件对比

```tsx
// Row - 水平布局
<Row gap={4} align="center" justify="between">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
  <Text>Item 3</Text>
</Row>

// Col - 垂直布局
<Col gap={4} align="center" justify="center" height="100vh">
  <Title>Column title</Title>
  <Text>Supporting text below the title.</Text>
</Col>
```
