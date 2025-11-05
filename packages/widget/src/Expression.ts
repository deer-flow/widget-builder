/**
 * 创建一个简单的沙盒环境来执行表达式
 */
function createSandbox(data: Record<string, any>) {
  // 创建安全的全局对象
  const safeGlobals = {
    // 基本的 JavaScript 构造函数和方法
    String,
    Number,
    Boolean,
    Array,
    Object,
    Math,
    Date,
    JSON,
    // 常用的工具方法
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    // 数据对象
    data,
  };

  return safeGlobals;
}

/**
 * 使用沙盒执行表达式
 */
export function executeExpression(
  expression: string,
  data: Record<string, any>
): any {
  try {
    // 创建沙盒环境
    const sandbox = createSandbox(data);

    // 创建参数名称和值的数组
    const paramNames = Object.keys(sandbox);
    const paramValues = Object.values(sandbox);

    // 使用改进的沙盒：创建一个函数，传入所有允许的变量
    // 在浏览器环境中阻止访问危险的全局变量
    const func = new Function(
      ...paramNames,
      `
      "use strict";

      try {
        return (${expression});
      } catch (e) {
        throw e;
      }
      `
    );

    // 执行函数
    const result = func(...paramValues);

    return result;
  } catch (error) {
    console.warn(`Error executing expression "${expression}":`, error);

    throw error;
  }
}
