#!/bin/bash

# Music AI Insights 部署脚本
# 支持多种部署平台

echo "🚀 Music AI Insights 部署脚本"
echo "=============================="

# 检查构建文件
if [ ! -d "dist" ]; then
    echo "📦 正在构建项目..."
    npm run build
fi

# 选择部署平台
echo ""
echo "请选择部署平台："
echo "1) Vercel (推荐)"
echo "2) Netlify"
echo "3) 腾讯云 COS"
echo "4) GitHub Pages"
echo ""
read -p "请输入选项 (1-4): " choice

case $choice in
    1)
        echo "🌐 部署到 Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "正在安装 Vercel CLI..."
            npm i -g vercel
        fi
        vercel --prod
        ;;
    2)
        echo "🌐 部署到 Netlify..."
        if ! command -v netlify &> /dev/null; then
            echo "正在安装 Netlify CLI..."
            npm i -g netlify-cli
        fi
        netlify deploy --prod --dir=dist
        ;;
    3)
        echo "☁️ 部署到腾讯云 COS..."
        echo "请确保已配置 COS 密钥"
        # 需要配置 COS 密钥
        ;;
    4)
        echo "📄 部署到 GitHub Pages..."
        echo "请确保已配置 GitHub 仓库"
        # 需要配置 GitHub
        ;;
    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac

echo ""
echo "✅ 部署完成！"
