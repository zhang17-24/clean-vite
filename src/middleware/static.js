/**
 * 静态文件中间件
 * 
 * 这个中间件的作用是：
 * 1. 处理静态文件请求（如 HTML、CSS、图片等）
 * 2. 读取文件内容并返回给浏览器
 * 3. 设置正确的 Content-Type 响应头
 */

import { readFileSync, existsSync, statSync } from 'fs';
import { resolve, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..', '..', '..');

/**
 * MIME 类型映射表
 * 告诉浏览器如何处理不同类型的文件
 */
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

/**
 * 静态文件中间件
 * 
 * @param {object} ctx - Koa 上下文对象（包含请求和响应信息）
 * @param {function} next - 下一个中间件函数
 */
export async function staticMiddleware(ctx, next) {
  // 1. 获取请求的文件路径
  // 例如：请求 /index.html，path 就是 /index.html
  const path = ctx.path;

  // 2. 构建文件的绝对路径
  // 将 URL 路径转换为文件系统中的实际路径
  const filePath = resolve(__dirname, path.slice(1)); // slice(1) 去掉开头的 /

  // 3. 检查文件是否存在
  if (!existsSync(filePath)) {
    // 文件不存在，交给下一个中间件处理
    return await next();
  }

  // 4. 检查是否是文件（而不是目录）
  const stats = statSync(filePath);
  if (!stats.isFile()) {
    // 是目录，交给下一个中间件处理
    return await next();
  }

  // 5. 读取文件内容
  try {
    const content = readFileSync(filePath, 'utf-8');

    // 6. 根据文件扩展名设置 Content-Type
    const ext = extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    ctx.type = contentType;

    // 7. 设置响应内容
    ctx.body = content;
  } catch (error) {
    // 读取文件失败，交给下一个中间件处理
    console.error('读取文件失败:', error);
    return await next();
  }
}

