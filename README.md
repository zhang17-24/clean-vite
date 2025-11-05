# 精简版 Vite 学习项目

## 项目简介

这是一个精简版的 Vite 打包工具实现，用于学习 Vite 的核心工作原理。本项目保留了 Vite 最核心的关键功能，代码包含详尽的注释，适合前端初学者学习。

## 核心功能

### 1. 开发服务器
- 创建 HTTP 服务器，提供静态文件服务
- 支持 JavaScript 模块的实时转换和提供

### 2. ES 模块解析
- 解析和转换 ES 模块导入
- 处理 node_modules 中的包（裸模块导入）
- 将裸模块（如 `import vue from 'vue'`）转换为相对路径

### 3. Vue 单文件组件（SFC）支持
- 解析 `.vue` 文件
- 将单文件组件拆分为 template、script、style 三部分
- 编译和转换 Vue 组件

### 4. 热模块替换（HMR）基础
- 实现基础的 HMR 通信机制
- 支持模块更新通知

## 项目结构

```
clean-vite/
├── src/
│   ├── server/          # 服务器相关代码
│   │   └── index.js     # 开发服务器主文件
│   ├── middleware/      # 中间件
│   │   ├── static.js    # 静态文件中间件
│   │   ├── js-transform.js  # JavaScript 转换中间件
│   │   └── vue-sfc.js   # Vue SFC 处理中间件
│   ├── utils/           # 工具函数
│   │   ├── resolve.js   # 模块路径解析
│   │   └── hmr.js       # HMR 工具函数
│   └── compiler/        # 编译器
│       └── vue.js       # Vue 编译器
├── package.json
├── index.js             # 入口文件
└── README.md
```

## 安装依赖

```bash
npm install
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

这会安装以下依赖：
- `koa`: Web 服务器框架
- `@vue/compiler-sfc`: Vue 单文件组件编译器
- `es-module-lexer`: ES 模块语法解析器

### 2. 安装 Vue（示例项目需要）

```bash
npm install vue@next
```

### 3. 启动开发服务器

```bash
npm run dev
```

或者：

```bash
node index.js
```

服务器默认运行在 `http://localhost:3000`

### 4. 访问示例项目

打开浏览器，访问 `http://localhost:3000`

你应该能看到一个漂亮的页面，包含：
- 项目介绍信息
- 一个可交互的计数器示例

### 5. 尝试修改代码

1. 修改 `src/App.vue` 中的内容
2. 保存文件
3. 刷新浏览器，查看变化

## 示例项目结构

项目已经包含了一个完整的示例项目：

```
clean-vite/
├── index.html          # HTML 入口文件
├── src/
│   ├── main.js        # JavaScript 入口文件
│   └── App.vue        # Vue 根组件
└── ...
```

你可以直接使用这些文件作为起点，开始学习和实验。

## 核心概念说明

### 什么是 Vite？

Vite 是一个前端构建工具，它的核心特点是：
- **开发时**：使用浏览器原生的 ES 模块，无需打包，启动极快
- **构建时**：使用 Rollup 进行生产构建

### 裸模块导入（Bare Imports）

在 ES 模块中，直接导入 npm 包的方式：
```javascript
import vue from 'vue'  // 这就是"裸模块导入"
```

浏览器不支持这种方式，需要转换为：
```javascript
import vue from '/node_modules/vue/dist/vue.esm-browser.js'
```

### 模块解析流程

1. 浏览器请求 `/src/main.js`
2. 服务器读取文件内容
3. 解析文件中的 `import` 语句
4. 将裸模块转换为相对路径
5. 返回转换后的代码给浏览器

### 热模块替换（HMR）

当文件修改时，浏览器自动更新模块，无需刷新页面。

## 技术栈

- **Koa**: Web 服务器框架
- **@vue/compiler-sfc**: Vue 单文件组件编译器
- **es-module-lexer**: ES 模块语法解析

## 📚 学习资源

### 快速开始

如果你是第一次接触这个项目，建议按以下顺序：

1. **阅读 README.md**（本文件）- 了解项目概况
2. **阅读 LEARNING_GUIDE.md** - 详细的学习指南，包含完整的学习路线
3. **按照学习指南实践** - 动手操作，加深理解

### 学习指南

**强烈推荐阅读 `LEARNING_GUIDE.md`！**

这个学习指南专为前端小白设计，包含：
- 📖 基础知识入门（什么是打包工具、ES 模块等）
- 🔍 Vite 核心概念详解
- 🗺️ 详细的代码学习路线（分阶段、有步骤）
- 🎯 实践练习和检查清单
- ❓ 常见困惑解答

**学习路径：**
1. 先阅读 `LEARNING_GUIDE.md` 的前半部分（基础知识）
2. 然后按照学习指南的步骤，逐个文件学习
3. 完成实践练习，巩固理解

### 代码阅读顺序（快速参考）

如果你想快速浏览代码，按以下顺序：

1. `index.js` - 项目入口
2. `src/server/index.js` - 服务器启动
3. `src/middleware/static.js` - 静态文件服务
4. `src/utils/resolve.js` - 模块解析
5. `src/middleware/js-transform.js` - 代码转换（核心）
6. `src/compiler/vue.js` - Vue 编译
7. `src/middleware/vue-sfc.js` - Vue 文件处理

### 代码阅读技巧

- **关注注释**：每个文件都有详细的注释，解释每一步的作用
- **追踪数据流**：从浏览器请求开始，追踪数据如何在服务器中流转
- **理解中间件链**：理解请求如何依次经过各个中间件
- **动手实验**：修改代码，观察效果，加深理解

## 注意事项

- 这是精简版实现，主要用于学习，不适用于生产环境
- 只处理了核心功能，没有处理所有边界情况
- 代码中包含大量注释，方便理解每一步的作用

## 常见问题

### Q: 为什么需要将裸模块转换为相对路径？

A: 浏览器原生的 ES 模块不支持直接导入 npm 包（如 `import vue from 'vue'`）。我们需要将这些导入转换为实际的文件路径，浏览器才能正确加载。

### Q: Vue 编译器生成的代码中的 import 会被转换吗？

A: Vue 编译器通常不会在生成的代码中包含需要转换的 import 语句。如果遇到问题，可以手动处理编译后的代码中的 import。

### Q: 为什么服务器启动后无法访问页面？

A: 请检查：
1. 确保 `index.html` 文件在项目根目录
2. 确保已安装 Vue：`npm install vue@next`
3. 检查浏览器控制台是否有错误信息

### Q: 如何调试模块解析问题？

A: 查看服务器控制台输出，会显示所有模块转换的日志：
```
[转换] /src/main.js: vue -> /node_modules/vue/dist/vue.esm-browser.js
```

## 后续改进方向

1. 添加 CSS 预处理器支持（Less、Sass）
2. 完善 HMR 功能（WebSocket 通信）
3. 添加生产构建功能（打包和优化）
4. 支持更多文件类型（TypeScript、JSX）
5. 优化错误处理和提示
6. 支持 CSS 模块和样式注入
7. 添加路径别名支持（如 `@/components`）

