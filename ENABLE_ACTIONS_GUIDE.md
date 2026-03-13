# 启用 GitHub Actions 指南

## 问题
你看到 "There are no workflow runs yet"，这是因为 GitHub Actions 在你的仓库中还没有启用。

## 解决方法

### 步骤 1：启用 GitHub Actions

1. 打开你的 GitHub 仓库页面：
   https://github.com/IllinoisTrash/music-ai-insights-webapp

2. 点击顶部菜单的 **"Actions"**

3. 你应该会看到一个绿色的提示框，写着：
   > "Workflows aren't being run on this forked repository"
   
   点击 **"I understand my workflows, go ahead and enable them"**

4. 如果没有看到绿色提示框，点击页面上的 **"Enable Actions"** 按钮

### 步骤 2：手动运行一次工作流

启用 Actions 后，你需要手动运行一次：

1. 在 Actions 页面，点击左侧的 **"Daily News Update"**

2. 点击右侧的 **"Run workflow"** 按钮

3. 在弹出的对话框中，再次点击 **"Run workflow"**

4. 等待工作流完成（大约 1-2 分钟）

### 步骤 3：验证运行结果

1. 刷新 Actions 页面
2. 你应该能看到一个正在运行或已完成的工作流
3. 点击工作流名称查看详细日志
4. 如果显示绿色勾选，说明更新成功

### 步骤 4：检查网站更新

1. 等待 2-3 分钟（Vercel 需要时间重新部署）
2. 访问 https://music-ai-insights-webapp.vercel.app
3. 查看新闻是否为最新

## 如果仍然看不到 "Run workflow" 按钮

可能是因为工作流文件还没有推送到仓库。让我检查一下：

1. 打开 https://github.com/IllinoisTrash/music-ai-insights-webapp/tree/main/.github/workflows
2. 确认能看到 `update-news.yml` 文件
3. 如果看不到，说明文件还没有推送成功

## 备用方案：本地运行更新

如果 GitHub Actions 无法启用，你可以在本地运行更新脚本：

```bash
# 1. 进入项目目录
cd music-ai-insights-webapp

# 2. 运行新闻抓取脚本
cd server
node services/autoNewsFetcher.js

# 3. 提交并推送
cd ..
git add server/data/
git commit -m "Update: 手动更新新闻数据"
git push
```

## 定时任务说明

启用 Actions 后，工作流会：
- **每天自动运行**：北京时间 8:00（UTC 00:00）
- **自动抓取新闻**：从 RSS 源获取最新音乐/AI 新闻
- **自动提交更新**：推送到 GitHub 并触发 Vercel 重新部署

你不需要每天手动操作，只需要确保 Actions 已启用即可。
