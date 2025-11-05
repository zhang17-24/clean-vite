/**
 * 模块路径解析工具
 * 
 * 这个文件的核心功能是：将裸模块导入（如 import vue from 'vue'）
 * 转换为浏览器可以理解的相对路径（如 /node_modules/vue/dist/vue.esm-browser.js）
 */

import { resolve as resolvePath } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readFileSync } from 'fs';

// 获取当前文件的目录路径（ES模块中使用 import.meta.url）
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolvePath(__filename, '..', '..', '..');

/**
 * 解析 npm 包的入口文件路径
 * 
 * @param {string} packageName - 包名，如 'vue'
 * @param {string} rootDir - 项目根目录
 * @returns {string|null} 返回包的入口文件路径，如果找不到返回 null
 */
export function resolvePackage(packageName, rootDir = __dirname) {
  // 1. 构建 node_modules 路径
  // 例如：/project/node_modules/vue
  const packageDir = resolvePath(rootDir, 'node_modules', packageName);

  // 2. 读取包的 package.json 文件
  // package.json 中包含了包的入口文件信息
  const packageJsonPath = resolvePath(packageDir, 'package.json');

  if (!existsSync(packageJsonPath)) {
    console.warn(`找不到包: ${packageName}`);
    return null;
  }

  try {
    // 3. 解析 package.json，获取入口文件
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

    // 4. 优先使用 module 字段（ES模块），其次使用 main 字段（CommonJS）
    // 这是 npm 包的标准约定
    let entryFile = packageJson.module || packageJson.main || 'index.js';

    // 5. 构建完整的文件路径
    const fullPath = resolvePath(packageDir, entryFile);

    if (!existsSync(fullPath)) {
      // 如果找不到入口文件，尝试 index.js
      const indexPath = resolvePath(packageDir, 'index.js');
      if (existsSync(indexPath)) {
        return indexPath;
      }
      return null;
    }

    return fullPath;
  } catch (error) {
    console.error(`解析包 ${packageName} 时出错:`, error);
    return null;
  }
}

/**
 * 将绝对路径转换为相对于项目根目录的 URL 路径
 * 
 * @param {string} absolutePath - 绝对文件路径
 * @param {string} rootDir - 项目根目录
 * @returns {string} 相对 URL 路径，如 /node_modules/vue/dist/vue.esm-browser.js
 */
export function pathToUrl(absolutePath, rootDir = __dirname) {
  // 将绝对路径转换为相对路径
  const relativePath = absolutePath.replace(rootDir, '');

  // Windows 系统路径分隔符是 \，需要转换为 /
  return relativePath.replace(/\\/g, '/');
}

/**
 * 解析导入路径
 * 
 * 判断一个导入路径是：
 * - 相对路径（如 './utils.js'）
 * - 绝对路径（如 '/src/main.js'）
 * - 裸模块（如 'vue'）
 * 
 * @param {string} importPath - 导入路径
 * @returns {object} { type: 'relative'|'absolute'|'bare', path: string }
 */
export function parseImportPath(importPath) {
  // 以 ./ 或 ../ 开头的是相对路径
  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    return { type: 'relative', path: importPath };
  }

  // 以 / 开头的是绝对路径
  if (importPath.startsWith('/')) {
    return { type: 'absolute', path: importPath };
  }

  // 其他情况都是裸模块（npm 包）
  return { type: 'bare', path: importPath };
}

