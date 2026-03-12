# 手动更新新闻指南

## 问题诊断

如果你的网站没有自动更新新闻，可能是以下原因：

1. GitHub Actions 没有运行
2. Vercel 没有正确连接到 GitHub
3. 工作流文件没有正确上传

## 快速检查清单

### 检查1：GitHub Actions 是否启用

1. 打开你的 GitHub 仓库：
   ```
   https://github.com/IllinoisTrash/music-ai-insights-webapp
   ```

2. 点击顶部的 **"Actions"** 标签

3. 你应该看到 **"Daily News Update"** 工作流

4. 如果看到 "This workflow has no runs yet"，说明还没运行过

### 检查2：手动运行工作流

1. 在 Actions 页面，点击 **"Daily News Update"**

2. 点击右侧的 **"Run workflow"** 按钮

3. 再点击绿色的 **"Run workflow"**

4. 等待约1分钟，刷新页面

5. 应该看到一条运行记录，显示：
   - 黄色圆圈 = 正在运行
   - 绿色勾 = 成功
   - 红色叉 = 失败

### 检查3：检查 Vercel 连接

1. 打开 https://vercel.com/dashboard

2. 找到你的项目 `music-ai-insights-webapp`

3. 点击项目进入

4. 点击顶部的 **"Deployments"** 标签

5. 检查最近的部署是否来自 GitHub

## 如果 GitHub Actions 不存在

可能工作流文件没有上传成功。手动创建：

### 步骤1：在 GitHub 创建文件

1. 打开你的 GitHub 仓库

2. 点击 **"Add file"** → **"Create new file"**

3. 文件名输入：
   ```
   .github/workflows/update-news.yml
   ```

4. 复制下面的内容粘贴进去：

```yaml
name: Daily News Update

on:
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:

jobs:
  update-news:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd server && npm ci
      - run: cd server && node services/autoNewsFetcher.js
      - run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add server/data/
          git diff --cached --quiet || (git commit -m "📰 Auto-update news" && git push)
```

5. 点击 **"Commit new file"**

### 步骤2：运行工作流

1. 回到 Actions 标签
2. 点击 "Daily News Update"
3. 点击 "Run workflow" → "Run workflow"

## 验证更新

工作流运行成功后：

1. 检查 `server/data/news.json` 文件是否更新
2. 访问你的网站：https://music-ai-insights-webapp.vercel.app
3. 按 `Ctrl+F5`（Windows）或 `Cmd+Shift+R`（Mac）强制刷新
4. 查看新闻是否更新

## 如果还是不行

可能是 Vercel 没有正确连接 GitHub。检查：

1. 打开 Vercel Dashboard
2. 进入项目设置
3. 检查 Git 部分是否显示你的 GitHub 仓库
4. 如果没有，点击 "Connect Git Repository"

---

**最简单的测试方法**：

直接在浏览器访问：
```
https://github.com/IllinoisTrash/music-ai-insights-webapp/actions
```

看看有没有 "Daily News Update"，然后点击 "Run workflow" 手动运行一次。
