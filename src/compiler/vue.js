/**
 * Vue 单文件组件（SFC）编译器
 * 
 * Vue 单文件组件（.vue 文件）包含三部分：
 * 1. <template> - HTML 模板
 * 2. <script> - JavaScript 逻辑
 * 3. <style> - CSS 样式
 * 
 * 这个编译器的作用是将 .vue 文件转换为浏览器可以执行的 JavaScript 代码
 */

import { compileScript, compileTemplate, parse } from '@vue/compiler-sfc';
import { readFileSync } from 'fs';

/**
 * 编译 Vue 单文件组件
 * 
 * @param {string} filePath - .vue 文件的路径
 * @param {string} id - 组件唯一标识符（用于 HMR）
 * @returns {string} 编译后的 JavaScript 代码
 */
export function compileVueSFC(filePath, id) {
  try {
    // 1. 读取 .vue 文件内容
    const source = readFileSync(filePath, 'utf-8');

    // 2. 解析 Vue 文件，提取 template、script、style
    // parse 函数会解析 .vue 文件，将其拆分为不同的部分
    const { descriptor, errors } = parse(source, {
      filename: filePath,
    });

    // 3. 检查解析错误
    if (errors.length > 0) {
      console.error('Vue 文件解析错误:', errors);
      throw new Error(`解析 Vue 文件失败: ${errors[0].message}`);
    }

    // 4. 编译 <template> 部分（先编译模板）
    // compileTemplate 会将模板编译为渲染函数
    let templateCode = '';
    if (descriptor.template) {
      const templateResult = compileTemplate({
        source: descriptor.template.content,
        filename: filePath,
        id,
        compilerOptions: {
          // 编译选项
          mode: 'module', // 使用 ES 模块模式
        },
      });

      templateCode = templateResult.code;
    }

    // 5. 编译 <script> 部分
    // compileScript 会将 <script> 中的代码编译为可执行的 JavaScript
    const scriptResult = compileScript(descriptor, {
      id, // 组件 ID，用于样式隔离和 HMR
    });

    // 6. 处理 <style> 部分
    // 这里我们简化处理，只提取样式内容
    // 实际项目中，还可以处理 scoped、CSS 预处理器等
    let styleCode = '';
    if (descriptor.styles.length > 0) {
      styleCode = descriptor.styles
        .map((style) => style.content)
        .join('\n');
    }

    // 7. 组装最终的代码
    // 将编译后的代码组装成一个完整的 JavaScript 模块
    // Vue 编译器会生成一个包含 __sfc_main 和 render 函数的模块
    const compiledCode = `
      ${templateCode}
      ${scriptResult.content}
      export default __sfc_main;
    `;

    return compiledCode;
  } catch (error) {
    console.error('编译 Vue 文件失败:', error);
    throw error;
  }
}

/**
 * 检查文件是否是 Vue 单文件组件
 * 
 * @param {string} filePath - 文件路径
 * @returns {boolean} 如果是 .vue 文件返回 true
 */
export function isVueFile(filePath) {
  return filePath.endsWith('.vue');
}

