/**
 * 主入口文件
 * 
 * 这是整个 Vue 应用的入口点
 * 
 * 功能：
 * 1. 导入 Vue 框架
 * 2. 导入根组件（App.vue）
 * 3. 创建 Vue 应用实例
 * 4. 将应用挂载到 DOM 上
 */

// 从 Vue 导入 createApp 函数
// 注意：这里使用的是裸模块导入（bare import）
// Vite 会自动将 'vue' 转换为 '/node_modules/vue/dist/vue.esm-browser.js'
import { createApp } from 'vue';

// 导入根组件
// 注意：.vue 文件会被 vue-sfc 中间件编译为 JavaScript
import App from './App.vue';

// 创建 Vue 应用实例
// createApp 是 Vue 3 的新 API，用于创建应用实例
const app = createApp(App);

// 将应用挂载到页面上
// mount('#app') 会将组件渲染到 id 为 'app' 的 DOM 元素中
app.mount('#app');

// 提示信息
console.log('✅ Vue 应用已启动！');
console.log('📚 这是精简版 Vite 学习项目');

