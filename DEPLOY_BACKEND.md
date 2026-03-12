# 后端服务部署指南

## 快速部署步骤

### 方案一：Railway（推荐）

1. **访问 Railway Dashboard**
   - 打开 https://railway.app/dashboard
   - 使用 GitHub 账号登录

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 如果未授权，先授权 Railway 访问你的 GitHub

3. **上传代码到 GitHub**
   ```bash
   # 在项目根目录执行
   cd /Users/seanswang/WorkBuddy/20260312100246/music-ai-insights-webapp/server
   
   # 初始化git仓库
   git init
   git add .
   git commit -m "Initial backend service"
   
   # 创建GitHub仓库并推送
   gh repo create music-ai-insights-api --public --source=. --remote=origin --push
   ```

4. **在 Railway 中部署**
   - 选择你刚创建的仓库 `music-ai-insights-api`
   - Railway 会自动检测到 `railway.json` 并部署
   - 等待部署完成（约2-3分钟）

5. **配置环境变量**
   - 在项目页面点击 "Variables"
   - 添加以下变量：
     ```
     PORT=3001
     NODE_ENV=production
     UPDATE_SCHEDULE=0 8 * * *
     CORS_ORIGINS=https://musicainsight.netlify.app,http://localhost:5173
     ```

6. **获取服务URL**
   - 部署完成后，Railway 会提供一个 URL
   - 例如：`https://music-ai-insights-api.up.railway.app`

### 方案二：Render

1. **访问 Render**
   - 打开 https://dashboard.render.com
   - 使用 GitHub 账号登录

2. **创建 Web Service**
   - 点击 "New" → "Web Service"
   - 选择你的 GitHub 仓库

3. **配置服务**
   - Name: `music-ai-insights-api`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `node index.js`
   - 点击 "Create Web Service"

4. **添加环境变量**
   - 在 "Environment" 标签页添加：
     ```
     NODE_ENV=production
     UPDATE_SCHEDULE=0 8 * * *
     CORS_ORIGINS=https://musicainsight.netlify.app
     ```

### 方案三：Vercel Serverless Functions

如果你想使用 Vercel 部署（与前端同一平台）：

1. **创建 API 目录结构**
   ```
   api/
   ├── news.js           # 主API路由
   ├── health.js         # 健康检查
   └── _utils/
       ├── newsFetcher.js
       └── storage.js
   ```

2. **修改存储方式**
   - Vercel 是 serverless，需要使用外部存储（如 Upstash Redis）
   - 或者使用 Vercel KV 存储

3. **部署**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

## 验证部署

部署完成后，测试以下端点：

```bash
# 健康检查
curl https://your-backend-url/api/health

# 获取新闻
curl https://your-backend-url/api/news

# 手动触发抓取
curl -X POST https://your-backend-url/api/admin/fetch-news
```

## 更新前端配置

获取后端URL后，更新前端 `.env`：

```env
VITE_BACKEND_URL=https://your-backend-url
```

然后重新部署前端：
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 故障排查

### RSS 抓取失败
- 检查后端日志中的错误信息
- 某些RSS源可能有访问限制
- 系统会自动使用备用数据

### CORS 错误
- 确保 `CORS_ORIGINS` 包含你的前端域名
- 多个域名用逗号分隔，无空格

### 定时任务不执行
- 检查 `UPDATE_SCHEDULE` 格式是否正确
- 查看 Railway/Render 的日志输出
- 时区默认为 Asia/Shanghai

## 监控和维护

### 查看日志
- Railway: Dashboard → Deployments → View Logs
- Render: Dashboard → Service → Logs

### 手动更新
如果需要立即更新新闻：
```bash
curl -X POST https://your-backend-url/api/admin/fetch-news
```

### 数据备份
新闻数据存储在 `data/news.json`，建议定期备份。

## 费用说明

| 平台 | 免费额度 | 预估费用 |
|------|---------|---------|
| Railway | $5/月 或 500小时 | $0（本项目足够） |
| Render | 750小时/月 | $0 |
| Vercel | 100GB带宽 | $0 |

**总计：完全免费运行！**
