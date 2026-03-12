import React from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { 
  ArrowLeft, 
  Clock, 
  Eye, 
  Share2, 
  ExternalLink,
  Tag,
  Calendar
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './ArticleDetail.css';

const ArticleDetail = ({ article, onBack, onShare }) => {
  if (!article) return null;

  const {
    title,
    summary,
    content,
    category,
    source,
    publishedAt,
    url,
    tags,
    readTime,
    views
  } = article;

  const getCategoryLabel = (cat) => {
    const labels = {
      'industry-news': '行业动态',
      'ai-research': 'AI研究',
      'trends': '趋势分析',
      'technology': '技术前沿',
    };
    return labels[cat] || '其他';
  };

  const getCategoryColor = (cat) => {
    const colors = {
      'industry-news': '#3b82f6',
      'ai-research': '#8b5cf6',
      'trends': '#10b981',
      'technology': '#f59e0b',
    };
    return colors[cat] || '#6366f1';
  };

  // 生成模拟的详细内容
  const generateFullContent = () => {
    if (content) return content;
    
    return `${summary}

## 详细分析

这项发展标志着音乐行业与人工智能技术融合的重要里程碑。随着技术的不断进步，我们可以看到以下几个关键趋势：

### 1. 技术创新

AI 技术在音乐创作、制作和分发环节的应用越来越广泛。从自动作曲到智能母带处理，AI 正在改变音乐制作的每一个环节。

### 2. 商业模式变革

传统的音乐商业模式正在被重新定义。新的收入来源、版权管理模式以及艺术家与技术的合作方式都在发生变化。

### 3. 用户体验提升

AI 驱动的个性化推荐、智能播放列表生成等功能，正在为用户提供更加个性化的音乐体验。

## 行业影响

这一发展将对整个音乐产业链产生深远影响：

- **对艺术家**：提供了新的创作工具和分发渠道
- **对唱片公司**：需要适应新的商业模式和版权管理方式
- **对平台**：AI 功能成为竞争的关键差异化因素
- **对消费者**：获得更丰富的音乐体验和更便捷的访问方式

## 未来展望

展望未来，我们可以期待：

1. 更先进的 AI 音乐生成技术
2. 更完善的版权保护机制
3. 更个性化的用户体验
4. 更多创新的商业模式

---

*本文内容基于公开信息整理，仅供参考。*`;
  };

  const fullContent = generateFullContent();

  return (
    <div className="article-detail">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={20} />
        <span>返回列表</span>
      </button>

      <article className="article-content">
        <header className="article-header">
          <div className="article-meta-top">
            <span 
              className="article-category"
              style={{ 
                backgroundColor: `${getCategoryColor(category)}20`,
                color: getCategoryColor(category)
              }}
            >
              {getCategoryLabel(category)}
            </span>
            <div className="article-stats">
              <span className="stat-item">
                <Calendar size={14} />
                {format(new Date(publishedAt), 'yyyy年MM月dd日', { locale: zhCN })}
              </span>
              <span className="stat-item">
                <Clock size={14} />
                {readTime || 3} 分钟阅读
              </span>
              <span className="stat-item">
                <Eye size={14} />
                {views || 0} 阅读
              </span>
            </div>
          </div>

          <h1 className="article-title">{title}</h1>

          {tags && tags.length > 0 && (
            <div className="article-tags">
              <Tag size={16} />
              {tags.map((tag, index) => (
                <span key={index} className="article-tag">{tag}</span>
              ))}
            </div>
          )}
        </header>

        <div className="article-body">
          <ReactMarkdown>{fullContent}</ReactMarkdown>
        </div>

        <footer className="article-footer">
          <div className="article-source">
            <span>来源：{source}</span>
            {url && url !== '#' && (
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="source-link"
              >
                查看原文
                <ExternalLink size={14} />
              </a>
            )}
          </div>

          <button className="share-button" onClick={() => onShare(article)}>
            <Share2 size={18} />
            <span>分享文章</span>
          </button>
        </footer>
      </article>
    </div>
  );
};

export default ArticleDetail;
