# Music AI Insights - 部署指南

## 快速部署选项

### 选项 1：Vercel（推荐，最简单）

#### 方法 A：通过网站部署
1. 访问 [vercel.com](https://vercel.com)
2. 点击 "Add New Project"
3. 选择 "Upload" 上传文件夹
4. 选择 `dist` 文件夹上传
5. 等待部署完成，获得在线链接

#### 方法 B：使用 CLI
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

### 选项 2：Netlify

#### 方法 A：拖拽部署
1. 访问 [netlify.com](https://netlify.com)
2. 登录账号
3. 将 `dist` 文件夹拖拽到部署区域
4. 自动获得在线链接

#### 方法 B：使用 CLI
```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 登录
netlify login

# 部署
netlify deploy --prod --dir=dist
```

### 选项 3：腾讯云 EdgeOne Pages

1. 访问 [EdgeOne Pages 控制台](https://console.cloud.tencent.com/edgeone/pages)
2. 点击 "创建项目"
3. 选择 "静态网站"
4. 上传 `dist` 文件夹中的文件
5. 配置域名（可选）

### 选项 4：GitHub Pages

1. 创建 GitHub 仓库
2. 将代码推送到仓库
3. 进入仓库 Settings → Pages
4. 选择分支和文件夹部署

## 构建文件位置

生产构建文件位于：`/Users/seanswang/WorkBuddy/20260312100246/music-ai-insights-webapp/dist/`

包含文件：
- `index.html` - 入口文件
- `assets/` - CSS 和 JS 文件

## 部署前检查清单

- [x] 项目已构建 (`npm run build`)
- [x] `dist` 文件夹存在
- [x] 所有功能正常
- [ ] 选择部署平台
- [ ] 完成部署

## 部署后验证

部署完成后，请验证以下功能：
1. 首页正常加载
2. 搜索功能可用
3. 分类筛选正常
4. 文章详情页可打开
5. 分享功能正常

## 自定义域名（可选）

大多数平台支持自定义域名：
1. 在平台设置中添加域名
2. 配置 DNS 记录
3. 等待 SSL 证书生成

## 需要帮助？

如果遇到问题，请检查：
1. 构建是否成功
2. 文件是否完整上传
3. 平台文档中的故障排除指南
