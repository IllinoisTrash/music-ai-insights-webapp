import React from 'react';
import './CategoryFilter.css';

const categories = [
  { id: 'all', label: '全部', color: '#6366f1' },
  { id: 'industry-news', label: '行业动态', color: '#3b82f6' },
  { id: 'ai-research', label: 'AI研究', color: '#8b5cf6' },
  { id: 'trends', label: '趋势分析', color: '#10b981' },
  { id: 'technology', label: '技术前沿', color: '#f59e0b' },
];

const CategoryFilter = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="category-filter">
      <span className="filter-label">分类筛选：</span>
      <div className="category-buttons">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.id)}
            style={{
              '--category-color': category.color
            }}
          >
            <span 
              className="category-dot"
              style={{ backgroundColor: category.color }}
            />
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
