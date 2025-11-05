/**
 * Vue 单文件组件（SFC）中间件
 * 
 * 这个中间件的作用是：
 * 1. 拦截对 .vue 文件的请求
 * 2. 使用 Vue 编译器编译 .vue 文件
 * 3. 返回编译后的 JavaScript 代码
 * 
 * Vue 单文件组件的编译流程：
 * <template> -> 渲染函数
 * <script> -> JavaScript 代码
 * <style> -> CSS 代码（这里简化处理）
 */

import { existsSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { compileVueSFC, isVueFile } from '../compiler/vue.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..', '..', '..');

/**
 * Vue SFC 中间件
 * 
 * @param {object} ctx - Koa 上下文对象
 * @param {function} next - 下一个中间件函数
 */
export async function vueSfcMiddleware(ctx, next) {
  // 1. 只处理 .vue 文件的请求
  if (!isVueFile(ctx.path)) {
    return await next();
  }

  // 2. 构建文件的绝对路径
  const filePath = resolve(__dirname, ctx.path.slice(1));

  // 3. 检查文件是否存在
  if (!existsSync(filePath)) {
    return await next();
  }

  try {
    // 4. 生成组件唯一 ID（用于样式隔离和 HMR）
    // 使用文件路径的哈希值作为 ID
    const componentId = ctx.path.replace(/[^a-zA-Z0-9]/g, '_');

    // 5. 编译 Vue 单文件组件
    const compiledCode = compileVueSFC(filePath, componentId);

    // 6. 设置响应头
    ctx.type = 'application/javascript';

    // 7. 返回编译后的代码
    // 注意：编译后的代码可能还包含 import 语句
    // 这些 import 语句会被后续的 js-transform 中间件处理
    ctx.body = compiledCode;

    // 8. 注意：编译后的代码可能包含新的 import 语句
    // 这些语句需要再次经过转换处理
    // 在精简版中，我们假设编译后的代码已经是最终形式
  } catch (error) {
    // 编译失败
    console.error('Vue 文件编译失败:', error);
    ctx.status = 500;
    ctx.body = `// Vue 文件编译失败: ${error.message}\nconsole.error(${JSON.stringify(error.message)});`;
  }
}

