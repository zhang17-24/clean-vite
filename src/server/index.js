/**
 * 开发服务器主文件
 * 
 * 这是整个 Vite 开发服务器的核心，负责：
 * 1. 创建 HTTP 服务器
 * 2. 注册中间件（按顺序处理请求）
 * 3. 启动服务器监听端口
 * 
 * 请求处理流程：
 * 1. 用户请求 /src/main.js
 * 2. Vue SFC 中间件检查是否是 .vue 文件，不是则跳过
 * 3. JS 转换中间件处理 .js 文件，转换 import 语句
 * 4. 静态文件中间件读取文件内容
 * 5. 返回响应给浏览器
 */

import Koa from 'koa';
import { vueSfcMiddleware } from '../middleware/vue-sfc.js';
import { jsTransformMiddleware } from '../middleware/js-transform.js';
import { staticMiddleware } from '../middleware/static.js';
import { getHMRClientCode } from '../utils/hmr.js';

/**
 * 创建开发服务器
 * 
 * @param {object} options - 服务器配置选项
 * @param {number} options.port - 服务器端口号，默认 3000
 * @param {string} options.root - 项目根目录，默认当前目录
 * @returns {Koa} Koa 应用实例
 */
export function createServer(options = {}) {
  // 1. 创建 Koa 应用实例
  // Koa 是一个轻量级的 Web 框架，用于构建 HTTP 服务器
  const app = new Koa();

  // 2. 配置选项
  const port = options.port || 3000;
  const root = options.root || process.cwd();

  // 3. 注册中间件（按顺序执行）
  // 注意：中间件的执行顺序很重要！

  // 3.1 错误处理中间件（最外层）
  // 捕获所有中间件的错误，避免服务器崩溃
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      console.error('服务器错误:', error);
      ctx.status = 500;
      ctx.body = `服务器错误: ${error.message}`;
    }
  });

  // 3.2 注入 HMR 客户端代码
  // 当请求 HTML 文件时，注入 HMR 客户端代码
  app.use(async (ctx, next) => {
    await next();
    
    // 如果是 HTML 文件，在 </body> 标签前注入 HMR 代码
    if (ctx.type === 'text/html' && ctx.body) {
      const html = ctx.body.toString();
      const hmrCode = `<script>${getHMRClientCode()}</script>`;
      
      // 在 </body> 前插入 HMR 代码
      if (html.includes('</body>')) {
        ctx.body = html.replace('</body>', `${hmrCode}</body>`);
      } else {
        // 如果没有 </body>，在末尾添加
        ctx.body = html + hmrCode;
      }
    }
  });

  // 3.3 Vue SFC 中间件
  // 处理 .vue 文件的请求，将其编译为 JavaScript
  app.use(vueSfcMiddleware);

  // 3.4 JavaScript 转换中间件
  // 处理 .js 文件的请求，转换 import 语句
  app.use(jsTransformMiddleware);

  // 3.5 静态文件中间件
  // 处理所有其他静态文件（HTML、CSS、图片等）
  app.use(staticMiddleware);

  // 4. 启动服务器
  const server = {
    // 监听方法
    listen: (callback) => {
      app.listen(port, () => {
        console.log(`\n🚀 开发服务器已启动！`);
        console.log(`📍 本地地址: http://localhost:${port}`);
        console.log(`📁 项目根目录: ${root}\n`);
        
        if (callback) {
          callback();
        }
      });
    },
    
    // 关闭服务器方法
    close: () => {
      // 这里可以添加清理逻辑
      console.log('服务器已关闭');
    },
  };

  return server;
}

