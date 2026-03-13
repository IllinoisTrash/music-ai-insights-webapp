# 新闻更新指南

## 自动更新机制

网站配置了 GitHub Actions 每天自动抓取新闻：
- **运行时间**：每天北京时间 8:00（UTC 00:00）
- **工作流程**：`.github/workflows/update-news.yml`

## 为什么 3月13日 没有自动更新？

GitHub Actions 的定时任务（`schedule`）在以下情况下**不会运行**：
1. 仓库 60 天内没有活动
2. 仓库是 fork 的（需要手动启用 Actions）
3. GitHub Actions 服务暂时不可用

## 如何手动更新新闻

### 方法 1：通过 GitHub 网站手动触发（推荐）

1. 打开 GitHub 仓库页面
2. 点击顶部菜单的 **"Actions"**
3. 在左侧选择 **"Daily News Update"**
4. 点击右侧的 **"Run workflow"** 按钮
5. 点击绿色的 **"Run workflow"** 确认
6. 等待 1-2 分钟，工作流会完成并自动推送更新

### 方法 2：本地手动运行并推送

如果你本地有代码：

```bash
# 进入项目目录
cd music-ai-insights-webapp

# 运行新闻抓取脚本
cd server
node services/autoNewsFetcher.js

# 返回根目录并推送
cd ..
git add server/data/
git commit -m "Update: 手动更新新闻数据"
git push
```

### 方法 3：联系我更新

如果你无法操作，可以告诉我，我可以帮你手动运行更新。

## 验证更新是否成功

更新后，打开网站查看：
- 网站地址：https://music-ai-insights-webapp.vercel.app
- 检查新闻的发布日期是否为最新
- 点击新闻查看内容是否已更新

## 注意事项

1. RSS 源可能有时不稳定，如果抓取失败会使用备用数据
2. 新闻去重是基于标题的，相同标题的新闻不会重复显示
3. Vercel 部署可能需要 1-2 分钟，请耐心等待
