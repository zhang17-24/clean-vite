/**
 * 入口文件
 * 
 * 这是整个项目的入口点，用于启动开发服务器
 * 
 * 使用方法：
 * node index.js
 * 
 * 或者：
 * npm run dev
 */

import { createServer } from './src/server/index.js';

// 创建并启动开发服务器
const server = createServer({
  port: 3000, // 服务器端口
  root: process.cwd(), // 项目根目录（当前工作目录）
});

// 启动服务器
server.listen(() => {
  console.log('✅ 服务器运行中...');
  console.log('💡 提示：按 Ctrl+C 停止服务器\n');
});

// 优雅关闭（当用户按 Ctrl+C 时）
process.on('SIGINT', () => {
  console.log('\n\n正在关闭服务器...');
  server.close();
  process.exit(0);
});

