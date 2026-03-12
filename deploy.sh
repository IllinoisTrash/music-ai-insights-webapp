#!/bin/bash

# Music AI Insights - 一键部署脚本
# 这个脚本会帮你自动完成GitHub设置

echo "=========================================="
echo "🎵 Music AI Insights - 一键部署"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ 错误：请在项目根目录运行此脚本${NC}"
    echo "请执行: cd /Users/seanswang/WorkBuddy/20260312100246/music-ai-insights-webapp"
    exit 1
fi

echo "✅ 检查通过，开始部署..."
echo ""

# 步骤1: 配置Git
echo "步骤 1/5: 配置Git信息"
echo "------------------------"

# 检查是否已配置
GIT_NAME=$(git config user.name)
GIT_EMAIL=$(git config user.email)

if [ -z "$GIT_NAME" ]; then
    read -p "请输入你的名字: " GIT_NAME
    git config user.name "$GIT_NAME"
fi

if [ -z "$GIT_EMAIL" ]; then
    read -p "请输入你的邮箱: " GIT_EMAIL
    git config user.email "$GIT_EMAIL"
fi

echo -e "${GREEN}✓ Git配置完成${NC}"
echo "  名字: $GIT_NAME"
echo "  邮箱: $GIT_EMAIL"
echo ""

# 步骤2: 获取GitHub用户名
echo "步骤 2/5: 连接GitHub"
echo "------------------------"

read -p "请输入你的GitHub用户名: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo -e "${RED}❌ 错误：GitHub用户名不能为空${NC}"
    exit 1
fi

# 设置远程仓库
REMOTE_URL="https://github.com/$GITHUB_USERNAME/music-ai-insights-webapp.git"

# 检查是否已有remote
if git remote get-url origin > /dev/null 2>&1; then
    echo "更新远程仓库地址..."
    git remote set-url origin "$REMOTE_URL"
else
    echo "添加远程仓库..."
    git remote add origin "$REMOTE_URL"
fi

echo -e "${GREEN}✓ GitHub连接完成${NC}"
echo "  仓库: $REMOTE_URL"
echo ""

# 步骤3: 提交代码
echo "步骤 3/5: 准备代码"
echo "------------------------"

# 添加所有文件
git add -A

# 检查是否有更改要提交
if git diff --cached --quiet; then
    echo -e "${YELLOW}⚠️ 没有新的更改需要提交${NC}"
else
    git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
    echo -e "${GREEN}✓ 代码已提交${NC}"
fi
echo ""

# 步骤4: 推送到GitHub
echo "步骤 4/5: 上传到GitHub"
echo "------------------------"
echo "正在上传代码到GitHub..."
echo ""
echo -e "${YELLOW}⚠️ 提示：如果要求输入密码，请使用 Personal Access Token${NC}"
echo -e "${YELLOW}   创建Token: https://github.com/settings/tokens${NC}"
echo ""

# 尝试推送
if git push -u origin main; then
    echo -e "${GREEN}✓ 代码上传成功！${NC}"
else
    echo -e "${RED}❌ 上传失败${NC}"
    echo ""
    echo "可能的原因："
    echo "1. GitHub仓库不存在 - 请先创建仓库"
    echo "2. 用户名错误 - 请检查用户名拼写"
    echo "3. 需要Token - 请创建Personal Access Token"
    echo ""
    echo "创建Token步骤："
    echo "1. 访问 https://github.com/settings/tokens"
    echo "2. 点击 'Generate new token (classic)'"
    echo "3. 勾选 'repo' 权限"
    echo "4. 生成并复制Token"
    echo "5. 用Token作为密码"
    exit 1
fi
echo ""

# 步骤5: 完成
echo "步骤 5/5: 完成"
echo "------------------------"
echo ""
echo -e "${GREEN}🎉 部署完成！${NC}"
echo ""
echo "下一步："
echo "1. 访问你的GitHub仓库:"
echo "   https://github.com/$GITHUB_USERNAME/music-ai-insights-webapp"
echo ""
echo "2. 在Vercel连接这个仓库:"
echo "   https://vercel.com/new"
echo ""
echo "3. 查看Actions（自动更新）:"
echo "   https://github.com/$GITHUB_USERNAME/music-ai-insights-webapp/actions"
echo ""
echo "详细教程: SETUP_STEPS.md"
echo ""
