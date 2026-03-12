/**
 * News API 服务
 * 使用 NewsAPI 获取真实的音乐行业新闻
 * 
 * 注意：需要申请免费的 API Key
 * 网址：https://newsapi.org/
 */

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || '';
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

// 搜索关键词配置
const SEARCH_QUERIES = [
  'music industry AI artificial intelligence',
  'Spotify music streaming technology',
  'AI music generation Suno Udio',
  'music copyright law technology',
  'record label streaming revenue'
];

/**
 * 从 NewsAPI 获取新闻
 */
export const fetchNewsFromAPI = async (query = null) => {
  if (!NEWS_API_KEY || NEWS_API_KEY === 'your_api_key_here') {
    console.warn('⚠️ News API Key 未配置，使用模拟数据');
    return [];
  }
  
  const searchQuery = query || SEARCH_QUERIES[0];
  
  try {
    const params = new URLSearchParams({
      q: searchQuery,
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: '20',
      apiKey: NEWS_API_KEY
    });
    
    const response = await fetch(`${NEWS_API_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error(data.message || 'NewsAPI request failed');
    }
    
    // 转换为应用格式
    const articles = data.articles.map((article, index) => ({
      id: `news-${Date.now()}-${index}`,
      title: article.title,
      summary: article.description?.substring(0, 200) + '...' || '暂无摘要',
      category: categorizeArticle(article.title, article.description),
      source: article.source.name,
      publishedAt: new Date(article.publishedAt).toISOString(),
      url: article.url,
      imageUrl: article.urlToImage,
      tags: extractTags(article.title),
      readTime: Math.ceil((article.description?.length || 200) / 200),
      views: 0
    }));
    
    console.log(`✅ NewsAPI: 获取 ${articles.length} 条新闻`);
    return articles;
    
  } catch (error) {
    console.error('NewsAPI fetch failed:', error);
    return [];
  }
};

/**
 * 批量获取多个关键词的新闻
 */
export const fetchMultipleQueries = async () => {
  const allNews = [];
  
  // 只取前3个关键词，避免请求过多
  for (const query of SEARCH_QUERIES.slice(0, 3)) {
    try {
      const news = await fetchNewsFromAPI(query);
      allNews.push(...news);
      // 延迟避免触发速率限制
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Query failed: ${query}`, error);
    }
  }
  
  // 去重（根据标题）
  const unique = allNews.filter((item, index, self) => 
    index === self.findIndex((t) => t.title === item.title)
  );
  
  // 按日期排序
  unique.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  
  return unique.slice(0, 20); // 只返回最新的20条
};

/**
 * 根据内容分类文章
 */
const categorizeArticle = (title, description) => {
  const text = (title + ' ' + description).toLowerCase();
  
  if (text.includes('ai') || text.includes('artificial intelligence') || 
      text.includes('machine learning') || text.includes('algorithm')) {
    return 'ai-research';
  }
  
  if (text.includes('revenue') || text.includes('market') || 
      text.includes('growth') || text.includes('report')) {
    return 'trends';
  }
  
  if (text.includes('copyright') || text.includes('law') || 
      text.includes('legal') || text.includes('sue')) {
    return 'industry-news';
  }
  
  return 'technology';
};

/**
 * 提取标签
 */
const extractTags = (title) => {
  const keywords = [
    'AI', 'Spotify', 'Apple', 'Amazon', 'YouTube', 'TikTok',
    'Universal', 'Sony', 'Warner', 'AI', 'streaming', '版权'
  ];
  
  const tags = [];
  keywords.forEach(kw => {
    if (title.toLowerCase().includes(kw.toLowerCase())) {
      tags.push(kw);
    }
  });
  
  return tags.slice(0, 5);
};

/**
 * 获取最新新闻（优先使用 API，失败则使用 RSS）
 */
export const getLatestMusicNews = async () => {
  // 先尝试 NewsAPI
  const apiNews = await fetchMultipleQueries();
  
  if (apiNews.length > 0) {
    return apiNews;
  }
  
  // 如果 API 失败，返回空数组（让调用方使用备用方案）
  console.warn('⚠️ 无法获取实时新闻，请检查 API 配置');
  return [];
};
