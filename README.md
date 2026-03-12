# Music AI Insights - Agent Web 应用

一个基于 CodeBuddy Chat Web SDK 构建的每日音乐行业及AI洞察推送应用。

## 功能特性

- **今日洞察**：浏览最新的音乐行业和AI相关资讯
- **AI对话**：与智能助手交流，获取专业分析和建议
- **每日推送**：订阅每日精选内容，直达邮箱
- **分类浏览**：按行业动态、AI研究、趋势分析等分类查看

## 技术栈

- React 18
- Vite
- CSS3 (自定义设计系统)
- React Markdown
- Lucide React (图标)
- date-fns (日期处理)

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，添加您的 API 密钥
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 构建生产版本

```bash
npm run build
```

## 项目结构

```
src/
├── components/          # UI 组件
│   ├── ChatInterface/   # AI对话界面
│   ├── InsightCard/     # 洞察卡片
│   ├── DailyDigest/     # 每日推送
│   └── Navigation/      # 导航栏
├── services/            # 服务层
│   ├── aiService.js     # AI服务
│   └── dataService.js   # 数据服务
├── prompts/             # AI提示词
│   └── systemPrompts.js # 系统提示词
├── styles/              # 样式文件
│   ├── global.css       # 全局样式
│   └── app.css          # 应用样式
├── config/              # 配置文件
│   └── app.config.js    # 应用配置
└── App.jsx              # 主应用组件
```

## 自定义配置

### 修改应用信息

编辑 `config/app.config.js`：

```javascript
export default {
  app: {
    name: "您的应用名称",
    description: "应用描述",
    // ...
  }
};
```

### 集成 AI 服务

1. 在 `.env` 文件中配置 API 密钥
2. 修改 `src/services/aiService.js` 中的 API 调用逻辑
3. 根据您的 AI 服务提供商调整请求格式

### 添加数据源

编辑 `src/services/dataService.js` 中的 `fetchDailyInsights` 函数：

```javascript
export const fetchDailyInsights = async () => {
  // 添加您的数据获取逻辑
  // 例如：RSS 订阅、API 调用、数据库查询等
};
```

## 部署

### 静态托管

构建后的 `dist` 目录可以部署到任何静态托管服务：

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

### Docker 部署

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

## 自定义主题

编辑 `src/styles/global.css` 中的 CSS 变量：

```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
  --bg-dark: #0f0f23;
  /* ... */
}
```

## 许可证

MIT
