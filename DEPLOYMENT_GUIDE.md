# Music AI Insights - 部署指南

## 架构概览

本项目采用前后端分离架构，实现每日自动更新的实时新闻功能：

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   前端 (React)   │──────▶│  后端 (Node.js)   │──────▶│  RSS / News API │
│   Netlify托管   │      │  Railway/Render  │      │   新闻源         │
└─────────────────┘      └──────────────────┘      └─────────────────┘
                              │
                              ▼
                        ┌──────────────┐
                        │  data/news.json │
                        │  (JSON存储)   │
                        └──────────────┘
```

## 技术方案说明

### 为什么需要后端服务？

| 问题 | 浏览器端限制 | 后端解决方案 |
|------|-------------|-------------|
| CORS限制 | 浏览器无法直接请求第三方RSS | 服务器端自由抓取任何RSS源 |
| 定时任务 | 页面关闭后无法执行代码 | 使用 node-cron 每日自动运行 |
| API密钥安全 | 前端代码中的密钥可被查看 | 密钥存储在服务器环境变量中 |
| 数据持久化 | 浏览器存储容量有限 | JSON文件/数据库存储 |

### 自动更新机制

1. **定时任务**：每天上午8点自动执行（可配置）
2. **多源抓取**：从7个权威音乐行业RSS源获取新闻
3. **智能分类**：自动识别AI研究、技术创新、行业动态等类别
4. **去重存储**：去除重复文章，保留最近7天的新闻
5. **API提供**：前端通过REST API获取最新数据

## 部署步骤

### 第一步：部署后端服务

推荐使用 **Railway**（免费额度充足，部署简单）

#### 1.1 准备代码

确保 `server/` 目录包含以下文件：
```
server/
├── index.js              # 主入口
├── package.json          # 依赖配置
├── services/
│   ├── newsFetcher.js    # 新闻抓取逻辑
│   └── storage.js        # 数据存储
├── routes/
│   └── news.js           # API路由
├── scripts/
│   └── fetchNews.js      # 手动抓取脚本
├── railway.json          # Railway配置
├── Procfile              # 启动命令
└── .env.example          # 环境变量模板
```

#### 1.2 部署到 Railway

**方法一：通过Railway CLI**

```bash
# 安装Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 进入server目录
cd server

# 初始化项目
railway init

# 部署
railway up
```

**方法二：通过GitHub集成（推荐）**

1. 将代码推送到GitHub仓库
2. 登录 [Railway Dashboard](https://railway.app/dashboard)
3. 点击 "New Project" → "Deploy from GitHub repo"
4. 选择你的仓库
5. Railway会自动检测 `railway.json` 并部署

#### 1.3 配置环境变量

在Railway Dashboard中设置以下环境变量：

```
PORT=3001
NODE_ENV=production
UPDATE_SCHEDULE=0 8 * * *    # 每天上午8点更新
CORS_ORIGINS=https://musicainsight.netlify.app,http://localhost:5173
NEWS_API_KEY=your_key_here   # 可选，从 newsapi.org 获取
```

#### 1.4 获取后端URL

部署成功后，Railway会提供一个URL，例如：
```
https://music-ai-insights-api.up.railway.app
```

### 第二步：更新前端配置

编辑 `.env` 文件，将后端URL添加到前端配置：

```bash
# .env
VITE_BACKEND_URL=https://music-ai-insights-api.up.railway.app
```

### 第三步：重新部署前端

```bash
# 构建前端
npm run build

# 部署到Netlify
netlify deploy --prod --dir=dist
```

## 验证部署

### 1. 检查后端健康状态

访问：`https://your-backend-url/api/health`

应返回：
```json
{
  "status": "ok",
  "timestamp": "2024-03-12T10:00:00.000Z",
  "version": "1.0.0"
}
```

### 2. 检查新闻数据

访问：`https://your-backend-url/api/news`

应返回新闻列表JSON。

### 3. 手动触发新闻抓取（测试用）

```bash
curl -X POST https://your-backend-url/api/admin/fetch-news
```

### 4. 检查前端是否正常加载

打开前端页面，查看浏览器控制台：
- 应看到 "🌐 调用后端 API..."
- 应看到 "✅ 从后端获取 X 条新闻"

## 日常运维

### 查看更新日志

在Railway Dashboard中查看部署日志，可以看到：
- 每日定时任务的执行情况
- RSS抓取的成功/失败记录
- 存储的新闻数量统计

### 手动更新新闻

如果需要立即更新新闻（不等待定时任务）：

```bash
curl -X POST https://your-backend-url/api/admin/fetch-news
```

### 监控新闻源

后端会自动从以下RSS源抓取新闻：

| 来源 | 类别 | 优先级 |
|------|------|--------|
| Music Business Worldwide | 行业动态 | ⭐⭐⭐ |
| Billboard - Music Business | 行业动态 | ⭐⭐⭐ |
| Music Ally | 行业动态 | ⭐⭐ |
| Hypebot | 行业动态 | ⭐⭐ |
| MusicTech | 技术创新 | ⭐⭐⭐ |
| Create Digital Music | 技术创新 | ⭐⭐ |
| Google News (AI Music) | AI研究 | ⭐⭐ |

## 故障排查

### 问题：前端显示"后端API调用失败"

**检查步骤：**
1. 确认 `VITE_BACKEND_URL` 配置正确
2. 访问后端健康检查URL，确认服务运行中
3. 检查浏览器控制台的网络请求，查看具体错误
4. 确认CORS配置正确（`CORS_ORIGINS`包含前端域名）

### 问题：新闻数据为空

**检查步骤：**
1. 手动触发抓取：`POST /api/admin/fetch-news`
2. 查看后端日志，检查RSS抓取是否成功
3. 检查 `data/news.json` 文件是否存在且有内容

### 问题：定时任务未执行

**检查步骤：**
1. 确认 `UPDATE_SCHEDULE` 环境变量设置正确
2. 查看Railway日志，搜索 "Running scheduled news fetch"
3. 时区设置：`timezone: 'Asia/Shanghai'`（北京时间）

## 成本估算

### Railway（后端托管）

- **免费额度**：每月 $5 或 500小时运行时间
- **本项目**：轻量级服务，完全在免费额度内
- **预估成本**：$0/月

### Netlify（前端托管）

- **免费额度**：100GB带宽/月
- **本项目**：静态站点，完全免费
- **预估成本**：$0/月

### News API（可选）

- **免费额度**：100请求/天
- **本项目**：每日1次请求，完全免费
- **预估成本**：$0/月

**总计：完全免费运行！**

## 进阶配置

### 使用数据库存储（可选）

如果新闻量增大，可以将JSON文件替换为MongoDB：

```javascript
// 修改 storage.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
// ... 实现MongoDB版本的存储函数
```

### 添加更多RSS源

编辑 `server/services/newsFetcher.js` 中的 `RSS_SOURCES` 数组：

```javascript
const RSS_SOURCES = [
  // ... 现有源
  {
    name: 'Your New Source',
    url: 'https://example.com/feed.xml',
    category: 'industry-news',
    priority: 2
  }
];
```

### 自定义更新频率

修改 `UPDATE_SCHEDULE` 环境变量：

| 表达式 | 含义 |
|--------|------|
| `0 8 * * *` | 每天上午8点 |
| `0 */6 * * *` | 每6小时一次 |
| `0 8,20 * * *` | 每天上午8点和晚上8点 |
| `*/30 * * * *` | 每30分钟一次（测试用） |

## 总结

这套方案的优势：

1. **完全自动化**：设置后无需人工干预，每天自动更新
2. **多源聚合**：从多个权威来源获取新闻，确保全面性
3. **智能处理**：自动分类、去重、生成摘要
4. **成本为零**：使用免费托管服务即可运行
5. **易于扩展**：可随时添加更多RSS源或切换数据库存储

现在你的音乐AI洞察网站可以每天自动获取最新的行业新闻了！
