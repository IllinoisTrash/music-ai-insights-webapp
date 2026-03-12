# 新闻不更新问题修复说明

## 问题原因

网站不显示最新新闻的根本原因是：

**Vercel Serverless Functions 在构建时静态读取 JSON 数据文件，而不是在每次请求时动态读取。**

这意味着：
1. GitHub Actions 成功更新了 `server/data/news.json` 和 `server/data/metadata.json`
2. 数据已推送到 GitHub 仓库
3. 但 Vercel 的 Serverless Function 仍然使用**构建时**打包的旧数据
4. 除非触发重新部署，否则 API 返回的数据始终是旧的

## 解决方案

修改了所有 API 端点，使其在**每次请求时动态读取**数据文件：

### 修改的文件
1. `api/news.js` - 新闻列表和详情 API
2. `api/categories.js` - 分类统计 API
3. `api/metadata.js` - 元数据 API

### 核心改动
```javascript
// 之前：模块加载时静态读取（只在构建时执行一次）
let newsData = [];
try {
  newsData = JSON.parse(readFileSync(newsPath, 'utf-8'));
} catch (error) {
  newsData = [];
}

// 之后：每次请求时动态读取
function loadData() {
  try {
    const newsData = JSON.parse(readFileSync(newsPath, 'utf-8'));
    return { newsData };
  } catch (error) {
    return { newsData: [] };
  }
}

// 在 handler 中调用
export default function handler(req, res) {
  const { newsData } = loadData(); // 每次请求都读取最新数据
  // ...
}
```

## 更新后的工作流程

1. **GitHub Actions** 每天定时运行（北京时间 8:00）
2. 抓取最新新闻并更新 `server/data/news.json`
3. 提交更改到 GitHub 仓库
4. **Vercel 自动重新部署**（因为代码有更新）
5. 用户访问网站时，API **动态读取**最新的 JSON 数据
6. 网站显示最新新闻

## 验证修复是否成功

1. 访问网站：https://music-ai-insights-webapp.vercel.app
2. 打开浏览器开发者工具（F12）
3. 查看 Network 标签，找到 `/api/news` 请求
4. 检查响应中的 `meta.lastUpdated` 字段
5. 应该显示最新的更新时间（北京时间每天 8:00 左右）

## 手动触发更新

如果需要立即更新新闻，可以手动触发 GitHub Actions：

1. 打开 GitHub 仓库页面
2. 点击 "Actions" 标签
3. 选择 "Daily News Update" 工作流
4. 点击 "Run workflow" 按钮
5. 等待几分钟后刷新网站

## 注意事项

- 动态读取文件会带来轻微的性能开销（每次请求都读取磁盘）
- 但对于新闻网站的数据量来说，这个开销可以忽略不计
- 优点是不需要等待 Vercel 重新部署即可看到最新数据
