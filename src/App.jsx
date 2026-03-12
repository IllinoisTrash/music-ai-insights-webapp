import React, { useState, useEffect } from 'react';
import InsightCard from './components/InsightCard/InsightCard';
import DailyDigest from './components/DailyDigest/DailyDigest';
import Navigation from './components/Navigation/Navigation';
import SearchBar from './components/SearchBar/SearchBar';
import CategoryFilter from './components/CategoryFilter/CategoryFilter';
import ArticleDetail from './components/ArticleDetail/ArticleDetail';
import ShareModal from './components/ShareModal/ShareModal';
import { fetchDailyInsights, searchInsights } from './services/dataService';
import { generateDailyContent, scheduleDailyGeneration, getGeneratedContent } from './services/contentGenerator';
import { Music, Sparkles, TrendingUp, RefreshCw } from 'lucide-react';
import './styles/app.css';

function App() {
  const [activeTab, setActiveTab] = useState('digest');
  const [insights, setInsights] = useState([]);
  const [filteredInsights, setFilteredInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [shareArticle, setShareArticle] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadInsights();
    // 设置定时任务
    scheduleDailyGeneration();
  }, []);

  useEffect(() => {
    filterInsights();
  }, [insights, searchQuery, activeCategory]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      // 合并生成的内容和模拟数据
      const generatedContent = getGeneratedContent();
      const mockData = await fetchDailyInsights();
      const combined = [...generatedContent, ...mockData];
      
      // 去重并按时间排序
      const unique = combined.filter((item, index, self) => 
        index === self.findIndex((t) => t.title === item.title)
      );
      const sorted = unique.sort((a, b) => 
        new Date(b.publishedAt) - new Date(a.publishedAt)
      );
      
      setInsights(sorted);
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterInsights = () => {
    let filtered = [...insights];

    // 搜索筛选
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(insight => 
        insight.title.toLowerCase().includes(lowerQuery) ||
        insight.summary.toLowerCase().includes(lowerQuery) ||
        insight.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }

    // 分类筛选
    if (activeCategory !== 'all') {
      filtered = filtered.filter(insight => insight.category === activeCategory);
    }

    setFilteredInsights(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    // 增加阅读次数
    const updated = insights.map(item => 
      item.id === article.id ? { ...item, views: (item.views || 0) + 1 } : item
    );
    setInsights(updated);
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  const handleShare = (article) => {
    setShareArticle(article);
  };

  const handleCloseShare = () => {
    setShareArticle(null);
  };

  const handleManualGenerate = async () => {
    setIsGenerating(true);
    try {
      const newContent = await generateDailyContent();
      setInsights(prev => [...newContent, ...prev]);
    } catch (error) {
      console.error('Failed to generate content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderContent = () => {
    if (selectedArticle) {
      return (
        <ArticleDetail 
          article={selectedArticle} 
          onBack={handleBackToList}
          onShare={handleShare}
        />
      );
    }

    switch (activeTab) {
      case 'digest':
        return (
          <div className="content-section">
            <div className="section-header">
              <TrendingUp className="section-icon" />
              <h2>今日洞察</h2>
              <button 
                className="generate-button"
                onClick={handleManualGenerate}
                disabled={isGenerating}
              >
                <RefreshCw className={isGenerating ? 'spin' : ''} size={18} />
                {isGenerating ? '生成中...' : '生成新内容'}
              </button>
            </div>
            
            <div className="data-source-notice">
              <span>📰 数据来源于 Music Business Worldwide、Music Ally、Billboard 等权威音乐行业媒体</span>
            </div>
            
            <div className="filters-section">
              <SearchBar onSearch={handleSearch} />
              <CategoryFilter 
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>

            {loading ? (
              <div className="loading">
                <RefreshCw className="spin" size={24} />
                <p>正在加载音乐行业资讯...</p>
              </div>
            ) : filteredInsights.length === 0 ? (
              <div className="empty-state">
                <p>没有找到相关内容</p>
              </div>
            ) : (
              <div className="insights-grid">
                {filteredInsights.map((insight, index) => (
                  <div key={insight.id || index} onClick={() => handleArticleClick(insight)}>
                    <InsightCard insight={insight} />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'daily':
        return <DailyDigest />;
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <Music className="logo-icon" />
          <div className="logo-text">
            <h1>Music AI Insights</h1>
            <span className="tagline">
              <Sparkles size={14} />
              每日音乐与AI洞察
            </span>
          </div>
        </div>
      </header>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="app-main">
        {renderContent()}
      </main>

      <footer className="app-footer">
        <p>Powered by CodeBuddy Chat Web SDK</p>
      </footer>

      <ShareModal 
        isOpen={!!shareArticle}
        onClose={handleCloseShare}
        article={shareArticle}
      />
    </div>
  );
}

export default App;
