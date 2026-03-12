# Vercel 部署配置指南

## 检查当前部署状态

让我帮你检查 Vercel 是否正确连接 GitHub：

### 步骤1：检查 Vercel 项目

1. 打开 https://vercel.com/dashboard
2. 找到项目 `music-ai-insights-webapp`
3. 点击进入

### 步骤2：检查 Git 连接

1. 在项目页面，点击 **"Settings"** 标签
2. 点击左侧的 **"Git"**
3. 确认显示：
   - **Connected Git Repository**: IllinoisTrash/music-ai-insights-webapp
   - **Production Branch**: main

如果没有显示，点击 **"Connect Git Repository"** 重新连接。

## 如果 GitHub Actions 不工作

我们可以使用 Vercel 的 Cron Jobs 功能（需要付费），或者使用更简单的方法：

### 方案：使用 Vercel + GitHub Actions（推荐）

确保以下文件已上传到 GitHub：

1. `.github/workflows/update-news.yml` - 工作流文件
2. `server/services/autoNewsFetcher.js` - 更新脚本
3. `server/data/news.json` - 新闻数据

### 手动触发更新

如果自动更新不工作，你可以：

1. 修改 `server/data/news.json` 中的任意内容
2. 提交到 GitHub
3. Vercel 会自动重新部署

例如，修改一条新闻的标题，然后提交。

## 最简单的验证方法

1. 打开你的 GitHub 仓库
2. 点击 `server/data/news.json`
3. 点击右上角的铅笔图标编辑
4. 修改任意内容（比如在标题后面加个空格）
5. 点击 "Commit changes"
6. 等待2-3分钟
7. 访问网站，看是否更新

如果这样更新了，说明 Vercel 连接正常，只是 GitHub Actions 需要配置。

---

**请告诉我：**
1. 你能看到 GitHub 仓库里的 `.github/workflows/update-news.yml` 文件吗？
2. Vercel 项目设置里的 Git 部分显示连接了吗？
