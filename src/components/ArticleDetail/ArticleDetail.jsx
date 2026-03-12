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
      'trends-analysis': '趋势分析',
      'trends': '趋势分析',
      'tech-innovation': '技术前沿',
      'technology': '技术前沿',
    };
    return labels[cat] || '其他';
  };

  const getCategoryColor = (cat) => {
    const colors = {
      'industry-news': '#3b82f6',
      'ai-research': '#8b5cf6',
      'trends-analysis': '#10b981',
      'trends': '#10b981',
      'tech-innovation': '#f59e0b',
      'technology': '#f59e0b',
    };
    return colors[cat] || '#6366f1';
  };

  // 根据文章标题和摘要动态生成解读内容
  const generateFullContent = () => {
    if (content) return content;
    
    // 提取文章关键词
    const keywords = extractKeywords(title, summary);
    
    // 根据分类生成不同的分析角度
    const categoryAnalysis = generateCategoryAnalysis(category, title, summary);
    
    // 生成行业影响分析
    const impactAnalysis = generateImpactAnalysis(title, summary, category);
    
    return `${summary}

## 深度解读

### 核心要点

${generateKeyPoints(title, summary, keywords)}

### 行业背景

${categoryAnalysis}

### 影响分析

${impactAnalysis}

### 相关趋势

${generateRelatedTrends(category, keywords)}

---

*本文解读基于公开信息整理，由 AI 辅助生成，仅供参考。*`;
  };

  // 提取关键词
  const extractKeywords = (title, summary) => {
    const text = (title + ' ' + summary).toLowerCase();
    const keywordMap = {
      'AI': ['ai', '人工智能', 'artificial intelligence'],
      '音乐生成': ['音乐生成', '生成音乐', 'music generation'],
      '版权': ['版权', 'copyright', '授权'],
      '流媒体': ['流媒体', 'streaming', 'spotify', 'apple music'],
      '虚拟艺人': ['虚拟艺人', '虚拟偶像', 'virtual artist'],
      '投资': ['投资', '融资', 'funding', 'investment'],
      '合作': ['合作', '协议', 'partnership', 'deal']
    };
    
    const found = [];
    for (const [keyword, patterns] of Object.entries(keywordMap)) {
      if (patterns.some(p => text.includes(p))) {
        found.push(keyword);
      }
    }
    return found;
  };

  // 根据分类生成分析
  const generateCategoryAnalysis = (category, title, summary) => {
    const analyses = {
      'ai-research': 'AI 技术正在深刻改变音乐创作和制作的方式。从自动作曲到智能混音，AI 工具正在帮助艺术家突破创作瓶颈，同时也引发了关于创意归属和版权的新讨论。',
      'industry-news': '音乐产业正在经历数字化转型的重要阶段。各大唱片公司、流媒体平台和科技公司之间的合作与竞争，正在重塑行业的商业模式和利益分配机制。',
      'trends-analysis': '市场数据显示，AI 在音乐领域的应用正在从实验走向规模化。用户接受度提升、技术成熟度增加、商业模式清晰化，共同推动着这一市场的快速增长。',
      'tech-innovation': '技术创新是音乐产业持续发展的核心驱动力。新功能、新平台和新工具的不断涌现，为艺术家提供了更多表达和变现的途径。'
    };
    
    return analyses[category] || analyses['industry-news'];
  };

  // 生成关键要点
  const generateKeyPoints = (title, summary, keywords) => {
    const points = [];
    
    // 基于标题和摘要生成要点
    if (title.includes('发布') || title.includes('推出')) {
      points.push('• **产品/功能发布**：这标志着相关技术在商业化应用方面取得新进展');
    }
    if (title.includes('合作') || title.includes('协议')) {
      points.push('• **战略合作**：双方资源的整合将产生协同效应，可能改变市场竞争格局');
    }
    if (title.includes('投资') || title.includes('融资')) {
      points.push('• **资本关注**：投资方的进入表明该领域具有较大的增长潜力和商业价值');
    }
    if (keywords.includes('AI')) {
      points.push('• **AI 应用**：人工智能技术的引入将提升效率，但也需要考虑伦理和版权问题');
    }
    if (keywords.includes('版权')) {
      points.push('• **版权议题**：在新技术环境下，版权保护和利益分配机制需要与时俱进');
    }
    
    if (points.length === 0) {
      points.push('• **行业动态**：这一事件反映了音乐产业的最新发展趋势');
      points.push('• **市场影响**：值得持续关注其对行业生态的潜在影响');
    }
    
    return points.join('\n\n');
  };

  // 生成影响分析
  const generateImpactAnalysis = (title, summary, category) => {
    const impacts = [];
    
    impacts.push('**对行业参与者**：');
    if (category === 'ai-research') {
      impacts.push('- 艺术家：获得新的创作工具，但需要适应技术变革');
      impacts.push('- 技术公司：加大研发投入，争夺市场份额');
      impacts.push('- 唱片公司：探索与 AI 技术的合作模式');
    } else if (category === 'industry-news') {
      impacts.push('- 主要玩家：战略调整以适应市场变化');
      impacts.push('- 新兴公司：寻找差异化竞争的机会');
      impacts.push('- 投资者：关注行业整合和增长机会');
    } else {
      impacts.push('- 产业链各环节都将受到不同程度的影响');
      impacts.push('- 需要持续关注后续发展和市场反应');
    }
    
    impacts.push('\n**对用户/消费者**：');
    impacts.push('- 可能获得更丰富的音乐体验');
    impacts.push('- 音乐消费方式可能随之改变');
    
    return impacts.join('\n');
  };

  // 生成相关趋势
  const generateRelatedTrends = (category, keywords) => {
    const trends = [];
    
    if (keywords.includes('AI') || category === 'ai-research') {
      trends.push('1. **AI 音乐生成技术持续进步**：模型能力不断提升，生成质量接近专业水平');
      trends.push('2. **人机协作成为主流**：AI 作为创作辅助工具，而非完全替代人类创作者');
    }
    
    if (keywords.includes('版权')) {
      trends.push('3. **版权法规逐步完善**：各国正在建立适应 AI 时代的版权保护框架');
    }
    
    if (keywords.includes('流媒体')) {
      trends.push('4. **个性化推荐深化**：基于用户行为的精准推荐成为平台核心竞争力');
    }
    
    if (trends.length === 0) {
      trends.push('1. **数字化转型加速**：音乐产业各环节都在经历数字化变革');
      trends.push('2. **用户体验升级**：技术创新为消费者带来更好的音乐体验');
      trends.push('3. **商业模式创新**：新的盈利模式和合作方式不断涌现');
    }
    
    return trends.join('\n\n');
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
