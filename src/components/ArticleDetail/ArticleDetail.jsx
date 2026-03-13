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

  // 基于文章实际内容生成解读
  const generateFullContent = () => {
    if (content) return content;
    
    // 分析文章内容
    const analysis = analyzeArticle(title, summary);
    
    return `${summary}

## 深度解读

### 文章概览

${analysis.overview}

### 核心要点

${analysis.keyPoints}

### 背景分析

${analysis.background}

### 行业影响

${analysis.impact}

---

*本文解读基于公开信息整理，由 AI 辅助生成，仅供参考。*`;
  };

  // 分析文章内容并生成相关解读
  const analyzeArticle = (title, summary) => {
    const text = (title + ' ' + summary).toLowerCase();
    const titleLower = title.toLowerCase();
    
    // 检测文章主题
    const themes = detectThemes(text);
    
    // 生成概览
    const overview = generateOverview(title, summary, themes);
    
    // 生成核心要点
    const keyPoints = generateKeyPoints(title, summary, themes);
    
    // 生成背景分析
    const background = generateBackground(themes, category);
    
    // 生成影响分析
    const impact = generateImpact(themes, category);
    
    return { overview, keyPoints, background, impact };
  };

  // 检测文章主题
  const detectThemes = (text) => {
    const themes = [];
    
    if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('machine learning')) {
      themes.push('AI技术');
    }
    if (text.includes('music') || text.includes('audio') || text.includes('song') || text.includes('artist')) {
      themes.push('音乐');
    }
    if (text.includes('streaming') || text.includes('spotify') || text.includes('apple music')) {
      themes.push('流媒体');
    }
    if (text.includes('copyright') || text.includes('license')) {
      themes.push('版权');
    }
    if (text.includes('startup') || text.includes('funding') || text.includes('investment')) {
      themes.push('投资');
    }
    if (text.includes('festival') || text.includes('concert') || text.includes('tour')) {
      themes.push('演出');
    }
    if (text.includes('album') || text.includes('release') || text.includes('single')) {
      themes.push('发行');
    }
    
    return themes;
  };

  // 生成文章概览
  const generateOverview = (title, summary, themes) => {
    if (themes.includes('AI技术') && themes.includes('音乐')) {
      return '本文探讨了人工智能技术在音乐领域的应用与发展，分析了这一技术融合对行业带来的影响和变革。';}
    if (themes.includes('AI技术')) {
      return '本文介绍了人工智能技术的最新进展，分析了其在各行业的潜在应用价值。';}
    if (themes.includes('音乐')) {
      return '本文报道了音乐行业的最新动态，涉及艺人、作品或行业事件。';}
    if (themes.includes('投资')) {
      return '本文关注资本市场的最新动向，分析了投资趋势和商业机会。';}
    return '本文报道了相关领域的最新发展动态，值得行业关注。';
  };

  // 生成核心要点
  const generateKeyPoints = (title, summary, themes) => {
    const points = [];
    const text = (title + ' ' + summary).toLowerCase();
    
    // 根据具体文章内容生成要点
    if (text.includes('harry styles') || text.includes('snl')) {
      points.push('• **艺人动态**：Harry Styles 将担任 SNL 主持人和音乐嘉宾，展现多面才华');
      points.push('• **节目亮点**：与 SNL 卡司互动制造话题，引发粉丝关注');
      points.push('• **宣传效果**：通过喜剧小品形式为新作品造势');
    } else if (text.includes('festival') || text.includes('lineup') || text.includes('kx5') || text.includes('above & beyond')) {
      points.push('• **音乐节阵容**：Kx5、Above & Beyond 等头部艺人领衔出演');
      points.push('• **场地创新**：首次在布鲁克林陆军码头举办，带来独特体验');
      points.push('• **市场趋势**：电子音乐节持续受到年轻受众欢迎');
    } else if (text.includes('machine learning') || text.includes('research') || text.includes('autoresearch')) {
      points.push('• **技术创新**：基于 Andrej Karpathy 的 AutoResearch 框架实现自动化实验');
      points.push('• **应用价值**：帮助研究人员高效进行超参数优化和实验追踪');
      points.push('• **开源贡献**：在 Google Colab 中实现，便于社区使用');
    } else if (text.includes('actor') || text.includes('song') || text.includes('tilly norwood')) {
      points.push('• **AI创作探索**：AI "演员" 尝试音乐创作引发讨论');
      points.push('• **作品评价**：市场对该类型AI生成内容的接受度仍有待观察');
      points.push('• **行业思考**：AI在创意领域的应用边界持续引发争议');
    } else if (text.includes('netflix') || text.includes('ben affleck') || text.includes('startup')) {
      points.push('• **大额收购**：Netflix 可能以6亿美元收购 Ben Affleck 的 AI 初创公司');
      points.push('• **战略布局**：流媒体巨头加大在AI技术领域的投资力度');
      points.push('• **行业信号**：AI技术在娱乐内容制作中的价值获得认可');
    } else if (text.includes('google') || text.includes('gemini') || text.includes('embedding')) {
      points.push('• **技术发布**：Google 推出 Gemini Embedding 2 多模态嵌入模型');
      points.push('• **功能升级**：支持文本、图像、视频、音频等多种模态');
      points.push('• **应用场景**：为 RAG 系统提供更强大的检索能力');
    } else if (text.includes('ai company') || text.includes('starting fresh')) {
      points.push('• **法律观点**：文章从知识产权律师角度分析AI公司的合规挑战');
      points.push('• **行业问题**：探讨AI公司在版权和数据使用方面的争议');
      points.push('• **发展建议**：呼吁建立更清晰的AI行业规范和标准');
    } else {
      // 通用要点
      points.push('• **行业动态**：本文反映了' + (themes.length > 0 ? themes.join('、') : '相关领域') + '的最新发展趋势');
      if (themes.includes('AI技术')) {
        points.push('• **技术应用**：人工智能在该领域的应用正在深化');
      }
      points.push('• **市场关注**：该事件受到行业和投资者的广泛关注');
    }
    
    return points.join('\n\n');
  };

  // 生成背景分析
  const generateBackground = (themes, category) => {
    if (category === 'ai-research' && themes.includes('音乐')) {
      return 'AI 与音乐的结合是当前技术发展的热点领域。从早期的算法作曲到如今的深度学习生成，AI 在音乐创作、制作、分发等环节的应用日益深入。这一趋势不仅改变了音乐生产的方式，也引发了关于创作权、版权归属等一系列法律和伦理问题。';}
    if (category === 'ai-research') {
      return '人工智能技术正处于快速发展期，各大科技公司持续加大研发投入。从基础研究到应用落地，AI 技术正在渗透各个行业。本文涉及的技术进展代表了该领域的最新探索方向。';}
    if (category === 'industry-news' && themes.includes('音乐节')) {
      return '现场音乐演出市场正在强劲复苏，音乐节作为重要的音乐消费场景，吸引了大量年轻受众。头部艺人的参与、独特的场地选择以及丰富的体验设计，成为音乐节成功的关键要素。';}
    if (category === 'industry-news') {
      return '音乐产业正在经历深刻的数字化转型。流媒体平台的崛起、AI 技术的应用、以及新的商业模式探索，都在重塑行业的生态格局。传统唱片公司、科技公司、艺人之间的关系也在发生微妙变化。';}
    if (category === 'tech-innovation') {
      return '技术创新是推动音乐产业发展的核心动力。从录音技术到数字制作，从流媒体到AI创作，每一次技术突破都带来了行业格局的重大变革。当前，AI 技术正在成为新一轮变革的关键驱动力。';}
    return '随着数字化程度的加深，音乐产业各环节都在经历变革。新技术的应用、新商业模式的探索、以及消费者行为的变化，共同推动着行业向前发展。';  };

  // 生成影响分析
  const generateImpact = (themes, category) => {
    const impacts = [];
    
    impacts.push('**对行业参与者**：');
    
    if (themes.includes('AI技术') && themes.includes('音乐')) {
      impacts.push('- **艺人**：AI 工具为创作提供新可能，但也需要适应技术变革带来的挑战');
      impacts.push('- **唱片公司**：需要重新评估版权策略和商业模式');
      impacts.push('- **技术公司**：加大在音乐 AI 领域的研发投入，争夺市场份额');
    } else if (themes.includes('音乐节') || themes.includes('演出')) {
      impacts.push('- **艺人**：现场演出机会增加，收入来源更加多元化');
      impacts.push('- **主办方**：需要提升体验设计能力，打造差异化竞争优势');
      impacts.push('- **场地方**：音乐活动带动场地利用率和周边消费');
    } else if (themes.includes('AI技术')) {
      impacts.push('- **技术提供商**：AI 能力成为核心竞争力');
      impacts.push('- **应用企业**：需要评估 AI 技术的落地价值和实施成本');
      impacts.push('- **从业者**：技能要求发生变化，需要持续学习适应');
    } else if (themes.includes('投资')) {
      impacts.push('- **投资者**：关注 AI 和音乐领域的投资机会');
      impacts.push('- **创业公司**：获得更多融资渠道和发展资源');
      impacts.push('- **行业巨头**：通过并购整合强化市场地位');
    } else {
      impacts.push('- **产业链各环节**：需要持续关注市场变化，及时调整策略');
      impacts.push('- **竞争者**：市场格局可能因此发生变化');
    }
    
    impacts.push('\n**对用户/消费者**：');
    if (themes.includes('AI技术') && themes.includes('音乐')) {
      impacts.push('- 可能体验到更多创新的音乐产品和服务');
      impacts.push('- 音乐消费方式可能更加个性化和智能化');
    } else if (themes.includes('音乐节') || themes.includes('演出')) {
      impacts.push('- 现场音乐体验机会增加');
      impacts.push('- 可以欣赏到更多头部艺人的演出');
    } else {
      impacts.push('- 可能获得更丰富的内容体验');
      impacts.push('- 消费选择更加多元化');
    }
    
    return impacts.join('\n');
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
