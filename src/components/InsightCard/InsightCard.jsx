import React from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ExternalLink, Clock, Tag } from 'lucide-react';
import './InsightCard.css';

const InsightCard = ({ insight }) => {
  const { title, summary, category, source, publishedAt, url, tags } = insight;

  const getCategoryColor = (cat) => {
    const colors = {
      'industry-news': '#3b82f6',
      'ai-research': '#8b5cf6',
      'trends': '#10b981',
      'technology': '#f59e0b',
      'default': '#6366f1'
    };
    return colors[cat] || colors.default;
  };

  const categoryLabels = {
    'industry-news': '行业动态',
    'ai-research': 'AI研究',
    'trends': '趋势分析',
    'technology': '技术前沿',
    'default': '其他'
  };

  return (
    <div className="insight-card">
      <div className="insight-header">
        <span 
          className="insight-category"
          style={{ backgroundColor: `${getCategoryColor(category)}20`, color: getCategoryColor(category) }}
        >
          {categoryLabels[category] || categoryLabels.default}
        </span>
        <div className="insight-meta">
          <Clock size={14} />
          <span>{format(new Date(publishedAt), 'MM月dd日', { locale: zhCN })}</span>
        </div>
      </div>

      <h3 className="insight-title">{title}</h3>
      <p className="insight-summary">{summary}</p>

      {tags && tags.length > 0 && (
        <div className="insight-tags">
          <Tag size={14} />
          {tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="insight-footer">
        <span className="insight-source">来源: {source}</span>
        {url && (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="insight-link"
          >
            阅读更多
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
};

export default InsightCard;
