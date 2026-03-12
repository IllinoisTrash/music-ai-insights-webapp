# GitHub 设置教程（技术小白版）

## 什么是 GitHub？

GitHub 是一个代码托管平台，就像云盘一样，可以存储你的代码。我们的自动更新功能需要用到它。

---

## 第一步：注册 GitHub 账号

1. 打开 https://github.com
2. 点击右上角的 **"Sign up"**（注册）
3. 填写信息：
   - Email（邮箱）
   - Password（密码，至少8位）
   - Username（用户名，如 music-ai-user）
4. 按照提示完成验证
5. 去邮箱点击验证链接

---

## 第二步：创建仓库

仓库就像项目文件夹，用来存放代码。

1. 登录 GitHub 后，点击左上角的 **"+"** 号
2. 选择 **"New repository"**（新建仓库）
3. 填写信息：
   - **Repository name**: `music-ai-insights-webapp`
   - **Description**: 音乐AI洞察网站（可选）
   - **Public**: 选择公开（免费）
   - **Initialize this repository with**: **不要勾选任何选项**
4. 点击底部的 **"Create repository"** 按钮

你会看到一个页面，显示仓库地址：
```
https://github.com/你的用户名/music-ai-insights-webapp
```

---

## 第三步：上传代码到 GitHub

### 3.1 打开终端

**Mac 用户：**
1. 按 `Command + 空格`
2. 输入 `terminal`
3. 按回车打开终端

**Windows 用户：**
1. 按 `Win + R`
2. 输入 `cmd`
3. 按回车打开命令提示符

### 3.2 执行以下命令

**复制粘贴下面的命令到终端，一行一行执行：**

```bash
# 进入项目目录
cd /Users/seanswang/WorkBuddy/20260312100246/music-ai-insights-webapp
```

```bash
# 配置你的Git信息（把引号里的内容换成你的）
git config user.name "你的名字"
git config user.email "你的邮箱@example.com"
```

```bash
# 连接到你的GitHub仓库（把YOUR_USERNAME换成你的用户名）
git remote add origin https://github.com/YOUR_USERNAME/music-ai-insights-webapp.git
```

```bash
# 上传代码
git push -u origin main
```

**如果提示输入用户名和密码：**
- 用户名：你的GitHub用户名
- 密码：不是GitHub密码！需要创建 "Personal Access Token"

### 3.3 创建 Personal Access Token（如果需要）

1. 打开 https://github.com/settings/tokens
2. 点击 **"Generate new token"** → **"Generate new token (classic)"**
3. 输入 Note：`Music AI Website`
4. 勾选 **"repo"**（第一个选项，表示仓库权限）
5. 点击底部 **"Generate token"**
6. **复制生成的 token**（只显示一次！）
7. 在终端粘贴这个 token 作为密码

---

## 第四步：验证代码已上传

1. 打开浏览器，访问：
   ```
   https://github.com/YOUR_USERNAME/music-ai-insights-webapp
   ```
2. 你应该能看到文件列表
3. 点击 `.github/workflows` 文件夹
4. 确认能看到 `update-news.yml` 文件

---

## 第五步：连接 Vercel 到 GitHub

### 5.1 登录 Vercel

1. 打开 https://vercel.com/login
2. 点击 **"Continue with GitHub"**
3. 授权 Vercel 访问你的 GitHub 账号

### 5.2 导入项目

1. 在 Vercel Dashboard，点击 **"Add New..."** → **"Project"**
2. 找到 `music-ai-insights-webapp` 仓库
3. 点击 **"Import"**
4. 配置项目：
   - **Framework Preset**: Vite
   - **Root Directory**: `./`（保持默认）
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 点击 **"Deploy"**

等待部署完成（约2-3分钟），你会看到成功页面和网站链接。

---

## 第六步：验证自动更新

### 6.1 查看 GitHub Actions

1. 打开你的 GitHub 仓库页面
2. 点击顶部的 **"Actions"** 标签
3. 你应该看到 **"Daily News Update"** 工作流
4. 点击它

### 6.2 手动测试自动更新

1. 在 Actions 页面，点击右侧的 **"Run workflow"** 按钮
2. 再点击绿色的 **"Run workflow"**
3. 等待约1分钟
4. 刷新页面，你应该看到运行记录

### 6.3 检查更新结果

1. 点击最新的运行记录
2. 查看日志，确认显示 "✅ Updated X news articles"
3. 回到仓库主页，检查 `server/data/news.json` 文件是否更新

---

## 常见问题

### Q: 提示 "fatal: not a git repository"
**解决**：确保你在正确的目录执行命令：
```bash
cd /Users/seanswang/WorkBuddy/20260312100246/music-ai-insights-webapp
```

### Q: 提示 "remote origin already exists"
**解决**：执行：
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/music-ai-insights-webapp.git
```

### Q: 提示 "Permission denied"
**解决**：使用 Personal Access Token 而不是密码

### Q: Vercel 部署失败
**解决**：检查 Build Command 是否为 `npm run build`

### Q: 网站显示旧内容
**解决**：
1. 按 `Ctrl + F5`（Windows）或 `Cmd + Shift + R`（Mac）强制刷新
2. 或清除浏览器缓存

---

## 完成后的效果

设置完成后：

✅ **每天上午8点**，GitHub Actions 自动运行  
✅ **自动更新**新闻数据  
✅ **自动提交**到GitHub  
✅ **Vercel自动重新部署**网站  
✅ **完全无需人工干预**

---

## 需要帮助？

如果遇到问题：

1. 截图错误信息
2. 描述你执行到哪一步
3. 寻求帮助

**记住**：每个技术高手都曾是小白，遇到问题很正常！
