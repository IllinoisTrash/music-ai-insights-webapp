# GitHub 自动更新设置指南

## 概述

我已经为你创建了 GitHub Actions 工作流，可以实现每天自动更新新闻数据。

## 设置步骤

### 1. 创建 GitHub 仓库

访问 https://github.com/new 创建一个新仓库：
- Repository name: `music-ai-insights-webapp`
- Visibility: Public（或 Private）
- 不要初始化 README（我们已经有了）

### 2. 推送代码到 GitHub

在终端执行：

```bash
cd /Users/seanswang/WorkBuddy/20260312100246/music-ai-insights-webapp

# 配置Git用户信息（如果还没配置）
git config user.name "Your Name"
git config user.email "your.email@example.com"

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/music-ai-insights-webapp.git

# 推送代码
git push -u origin main
```

### 3. 配置 Vercel 与 GitHub 集成

1. 登录 https://vercel.com/dashboard
2. 找到你的项目 `music-ai-insights-webapp`
3. 进入 Settings → Git
4. 点击 "Connect Git Repository"
5. 选择你的 GitHub 仓库

### 4. 验证自动更新

推送代码后，GitHub Actions 会自动运行：

1. 访问你的 GitHub 仓库
2. 点击 "Actions" 标签
3. 你应该看到 "Daily News Update" 工作流
4. 点击 "Run workflow" 可以手动测试

### 5. 自动更新机制

配置完成后：

- **每天上午8点**（北京时间），GitHub Actions 会自动运行
- 运行 `autoNewsFetcher.js` 更新新闻数据
- 如果有更新，会自动提交到仓库
- Vercel 检测到提交后会自动重新部署
- **整个过程完全自动化，无需人工干预**

## 工作流文件

工作流文件位于 `.github/workflows/update-news.yml`：

```yaml
name: Daily News Update
on:
  schedule:
    - cron: '0 0 * * *'  # 每天 UTC 00:00 (北京时间 8:00)
  workflow_dispatch:      # 支持手动触发
```

## 手动触发更新

如果需要立即更新新闻：

1. 进入 GitHub 仓库
2. 点击 "Actions" → "Daily News Update"
3. 点击 "Run workflow" → "Run workflow"

## 监控更新状态

- **GitHub Actions 日志**: 查看每次更新的详细日志
- **Vercel 部署日志**: 查看前端重新部署状态
- **网站内容**: 访问网站查看新闻是否已更新

## 更新频率

默认每天更新一次。如需修改：

编辑 `.github/workflows/update-news.yml`：

```yaml
schedule:
  - cron: '0 0 * * *'     # 每天一次
  - cron: '0 */6 * * *'   # 每6小时一次
  - cron: '0 0,12 * * *'  # 每天两次（0点和12点）
```

Cron 表达式格式：`分 时 日 月 星期`

## 故障排查

### 工作流没有运行

1. 检查 GitHub Actions 是否启用（Settings → Actions → General）
2. 检查是否有足够的 GitHub Actions 额度（免费账户足够）

### 更新后网站没有变化

1. 检查 Vercel 是否成功部署（查看 Vercel Dashboard）
2. 检查浏览器缓存（按 Ctrl+F5 强制刷新）

### 新闻数据没有更新

1. 查看 GitHub Actions 日志中的错误信息
2. 检查 `server/data/news.json` 是否有变化

## 成本

- **GitHub Actions**: 免费账户每月 2000 分钟，本项目每月约 30 分钟
- **Vercel**: 免费额度完全够用
- **总计**: $0/月

---

设置完成后，你的网站将每天自动更新新闻内容！
