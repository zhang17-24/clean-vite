/**
 * JavaScript 转换中间件
 * 
 * 这是 Vite 最核心的功能之一！
 * 
 * 作用：
 * 1. 拦截对 JavaScript 文件的请求
 * 2. 读取文件内容
 * 3. 解析文件中的 import 语句
 * 4. 将裸模块导入（如 import vue from 'vue'）转换为相对路径
 * 5. 返回转换后的代码给浏览器
 * 
 * 为什么需要转换？
 * 浏览器不支持直接导入 npm 包，需要转换为实际的文件路径
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'es-module-lexer';
import { resolvePackage, pathToUrl, parseImportPath } from '../utils/resolve.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..', '..', '..');

/**
 * JavaScript 转换中间件
 * 
 * @param {object} ctx - Koa 上下文对象
 * @param {function} next - 下一个中间件函数
 */
export async function jsTransformMiddleware(ctx, next) {
  // 1. 只处理 .js 文件的请求
  if (!ctx.path.endsWith('.js')) {
    return await next();
  }

  // 2. 构建文件的绝对路径
  const filePath = resolve(__dirname, ctx.path.slice(1));

  // 3. 检查文件是否存在
  if (!existsSync(filePath)) {
    return await next();
  }

  try {
    // 4. 读取 JavaScript 文件内容
    let code = readFileSync(filePath, 'utf-8');

    // 5. 使用 es-module-lexer 解析 ES 模块
    // 这个库可以快速解析 import 和 export 语句
    const [imports] = parse(code);

    // 6. 遍历所有的 import 语句，转换裸模块导入
    // 从后往前遍历（这样替换时不会影响前面的位置）
    for (let i = imports.length - 1; i >= 0; i--) {
      const importStatement = imports[i];

      // 获取导入的路径
      // 例如：import vue from 'vue' 中的 'vue'
      const importPath = code.substring(
        importStatement.s,
        importStatement.e
      );

      // 解析导入路径的类型
      const parsed = parseImportPath(importPath);

      // 只处理裸模块（npm 包）
      if (parsed.type === 'bare') {
        // 解析包的路径
        const packagePath = resolvePackage(parsed.path, __dirname);

        if (packagePath) {
          // 转换为相对 URL 路径
          const urlPath = pathToUrl(packagePath, __dirname);

          // 替换代码中的导入路径
          // 例如：将 'vue' 替换为 '/node_modules/vue/dist/vue.esm-browser.js'
          const before = code.substring(0, importStatement.s);
          const after = code.substring(importStatement.e);
          code =
            before +
            `"${urlPath}"` +
            after;

          // 记录转换信息（用于调试）
          console.log(
            `[转换] ${ctx.path}: ${importPath} -> ${urlPath}`
          );
        } else {
          console.warn(`[警告] 无法解析包: ${importPath} in ${ctx.path}`);
        }
      }
    }

    // 7. 设置响应头
    ctx.type = 'application/javascript';

    // 8. 添加 source map 支持（可选）
    // 这样浏览器可以显示原始文件的错误信息

    // 9. 返回转换后的代码
    ctx.body = code;
  } catch (error) {
    // 如果转换失败，返回原始文件或错误信息
    console.error('JavaScript 转换失败:', error);
    ctx.status = 500;
    ctx.body = `// 转换失败: ${error.message}`;
  }
}

