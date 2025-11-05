<!--
  Vue 单文件组件（SFC）示例
  
  一个 .vue 文件包含三部分：
  1. <template> - HTML 模板（必选）
  2. <script> - JavaScript 逻辑（可选）
  3. <style> - CSS 样式（可选）
  
  这个组件会被 Vue 编译器编译为 JavaScript 代码
-->

<template>
  <!-- 模板部分：定义组件的 HTML 结构 -->
  <div class="app">
    <h1>🎉 欢迎使用精简版 Vite！</h1>
    
    <div class="info">
      <h2>项目信息</h2>
      <p>这是一个用于学习 Vite 核心工作原理的精简版实现。</p>
      
      <div class="features">
        <h3>核心功能：</h3>
        <ul>
          <li>✅ ES 模块解析和转换</li>
          <li>✅ 裸模块导入转换（node_modules）</li>
          <li>✅ Vue 单文件组件支持</li>
          <li>✅ 热模块替换（HMR）基础</li>
        </ul>
      </div>
      
      <div class="counter">
        <h3>计数器示例：</h3>
        <p>当前计数：<strong>{{ count }}</strong></p>
        <button @click="increment">点击增加</button>
        <button @click="decrement">点击减少</button>
        <button @click="reset">重置</button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 脚本部分：定义组件的逻辑
 * 
 * 在 Vue 3 中，可以使用两种方式编写组件：
 * 1. Options API（选项式 API）- 使用 data、methods 等选项
 * 2. Composition API（组合式 API）- 使用 setup 函数
 * 
 * 这里使用 Options API，更简单易懂
 */
export default {
  // 组件名称（可选，用于调试）
  name: 'App',
  
  // data 函数：返回组件的响应式数据
  // 注意：必须是函数，不能是对象
  data() {
    return {
      count: 0, // 计数器初始值
    };
  },
  
  // methods：定义组件的方法
  methods: {
    // 增加计数
    increment() {
      this.count++;
      console.log('计数增加:', this.count);
    },
    
    // 减少计数
    decrement() {
      this.count--;
      console.log('计数减少:', this.count);
    },
    
    // 重置计数
    reset() {
      this.count = 0;
      console.log('计数已重置');
    },
  },
};
</script>

<style scoped>
/**
 * 样式部分：定义组件的 CSS 样式
 * 
 * scoped 属性表示样式只作用于当前组件
 * 不会影响其他组件
 */

.app {
  text-align: center;
}

h1 {
  color: #667eea;
  margin-bottom: 30px;
  font-size: 2.5em;
}

.info {
  text-align: left;
  line-height: 1.6;
}

h2 {
  color: #764ba2;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

h3 {
  color: #555;
  margin-top: 25px;
}

.features ul {
  list-style: none;
  padding-left: 0;
}

.features li {
  padding: 8px 0;
  color: #666;
}

.counter {
  margin-top: 30px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.counter strong {
  color: #667eea;
  font-size: 1.5em;
}

button {
  margin: 5px;
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

button:hover {
  background: #764ba2;
}

button:active {
  transform: scale(0.98);
}
</style>

