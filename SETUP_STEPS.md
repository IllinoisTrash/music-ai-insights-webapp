# 每日自动更新设置 - 图文步骤

## 📋 准备工作

你需要：
- 一个邮箱（用于注册GitHub）
- 记住你的GitHub用户名和密码
- 约15分钟时间

---

## 步骤 1：注册 GitHub（2分钟）

### 1.1 打开网站
在浏览器输入：
```
https://github.com
```

### 1.2 点击注册
找到页面上的 **"Sign up"** 按钮，点击它

### 1.3 填写信息
- **Email**: 输入你的邮箱
- **Password**: 设置密码（至少8位，包含字母和数字）
- **Username**: 设置用户名（如：music-ai-user）

### 1.4 验证
- 完成拼图验证
- 去邮箱点击验证链接

✅ **完成后**：你能登录 GitHub 了

---

## 步骤 2：创建代码仓库（2分钟）

### 2.1 登录 GitHub
打开 https://github.com/login 登录

### 2.2 创建新仓库
1. 点击左上角 **"+"** 号
2. 选择 **"New repository"**

### 2.3 填写仓库信息
按下图填写：

```
Repository name: music-ai-insights-webapp
Description: 音乐AI洞察网站（可选）
☑️ Public (选中)
❌ Add a README (不选)
❌ Add .gitignore (不选)
❌ Choose a license (不选)
```

### 2.4 创建
点击绿色按钮 **"Create repository"**

✅ **完成后**：你看到一个页面，显示仓库地址

---

## 步骤 3：打开终端（1分钟）

### Mac 用户：
1. 同时按下 `Command + 空格`
2. 输入 `terminal`
3. 按回车

### Windows 用户：
1. 同时按下 `Win + R`
2. 输入 `cmd`
3. 按回车

✅ **完成后**：看到一个黑窗口（终端）

---

## 步骤 4：执行命令（5分钟）

**重要：逐行复制粘贴执行**

### 4.1 进入项目目录
```bash
cd /Users/seanswang/WorkBuddy/20260312100246/music-ai-insights-webapp
```
粘贴后按回车

### 4.2 配置你的名字和邮箱
```bash
git config user.name "你的名字"
```
把"你的名字"换成真实名字，比如：
```bash
git config user.name "张三"
```

```bash
git config user.email "你的邮箱@example.com"
```
换成你的真实邮箱

### 4.3 连接 GitHub
**把 YOUR_USERNAME 换成你的GitHub用户名**

```bash
git remote add origin https://github.com/YOUR_USERNAME/music-ai-insights-webapp.git
```

例如：
```bash
git remote add origin https://github.com/music-ai-user/music-ai-insights-webapp.git
```

### 4.4 上传代码
```bash
git push -u origin main
```

**如果提示输入密码：**
- 用户名：你的GitHub用户名
- 密码：看下面的"创建Token"步骤

✅ **完成后**：代码上传到GitHub了

---

## 步骤 5：创建 Token（如果需要密码）（3分钟）

如果上一步提示输入密码，按下面操作：

### 5.1 打开 Token 页面
在浏览器打开：
```
https://github.com/settings/tokens
```

### 5.2 生成新 Token
1. 点击 **"Generate new token"**
2. 选择 **"Generate new token (classic)"**
3. 可能需要输入密码验证

### 5.3 配置 Token
- **Note**: 输入 `Music AI Website`
- **Expiration**: 选择 `No expiration`（永不过期）
- **Scopes**: 勾选 **repo**（第一个选项）

### 5.4 生成
点击底部 **"Generate token"**

### 5.5 复制 Token
**⚠️ 重要：Token只显示一次！**

1. 点击复制按钮
2. 粘贴到终端作为密码

✅ **完成后**：代码成功上传

---

## 步骤 6：验证上传成功（1分钟）

1. 打开浏览器
2. 访问：
   ```
   https://github.com/YOUR_USERNAME/music-ai-insights-webapp
   ```
3. 把 YOUR_USERNAME 换成你的用户名

**你应该看到文件列表，包括：**
- api/
- server/
- src/
- .github/workflows/

✅ **完成后**：代码在GitHub上了

---

## 步骤 7：连接 Vercel（3分钟）

### 7.1 登录 Vercel
1. 打开 https://vercel.com/login
2. 点击 **"Continue with GitHub"**
3. 授权 Vercel 访问

### 7.2 导入项目
1. 点击 **"Add New..."** → **"Project"**
2. 找到 `music-ai-insights-webapp`
3. 点击 **"Import"**

### 7.3 配置
确认以下设置：
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

### 7.4 部署
点击 **"Deploy"**

等待2-3分钟...

✅ **完成后**：看到绿色的 "Congratulations!" 页面

---

## 步骤 8：测试自动更新（2分钟）

### 8.1 打开 GitHub Actions
1. 打开你的 GitHub 仓库
2. 点击顶部的 **"Actions"** 标签

### 8.2 运行工作流
1. 点击 **"Daily News Update"**
2. 点击右侧 **"Run workflow"**
3. 再点击 **"Run workflow"**

### 8.3 等待完成
等待约1分钟，看到绿色的勾 ✅

✅ **完成后**：自动更新功能生效了！

---

## 🎉 完成！

现在你的网站会：
- ✅ 每天上午8点自动更新新闻
- ✅ 自动重新部署
- ✅ 完全不需要你操作

---

## 🔗 重要链接

| 用途 | 链接 |
|------|------|
| 你的网站 | https://music-ai-insights-webapp.vercel.app |
| GitHub 仓库 | https://github.com/YOUR_USERNAME/music-ai-insights-webapp |
| Vercel 控制台 | https://vercel.com/dashboard |

---

## ❓ 遇到问题？

### 问题1：命令执行失败
**解决**：检查是否复制完整，是否有空格

### 问题2：提示 "Permission denied"
**解决**：使用 Token 而不是密码

### 问题3：找不到仓库
**解决**：确认仓库名是 `music-ai-insights-webapp`

### 问题4：Vercel 部署失败
**解决**：检查 Framework Preset 是不是 Vite

---

**记住**：慢慢来，每一步都确认成功再进行下一步！
