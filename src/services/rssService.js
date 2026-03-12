/**
 * RSS 新闻抓取服务
 * 从真实的音乐行业 RSS 源获取最新资讯
 */

// 真实的 RSS 源配置
const RSS_SOURCES = [
  {
    name: 'Music Ally',
    url: 'https://musically.com/feed/',
    category: 'industry-news',
    enabled: true
  },
  {
    name: 'Music Business Worldwide',
    url: 'https://www.musicbusinessworldwide.com/feed/',
    category: 'industry-news',
    enabled: true
  },
  {
    name: 'Hypebot',
    url: 'https://hypebot.com/feed/',
    category: 'industry-news',
    enabled: true
  },
  {
    name: 'Music Industry News',
    url: 'https://www.musicindustrynews.com/feed/',
    category: 'industry-news',
    enabled: false // 需要验证
  }
];

/**
 * 解析 RSS XML 为 JSON
 */
const parseRSS = async (rssUrl) => {
  try {
    // 使用 RSS 代理服务（因为浏览器有 CORS 限制）
    const proxyUrls = [
      `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`,
      `https://api.codetabs.com/v1/proxy?quest=${rssUrl}`,
    ];
    
    let xmlText = null;
    
    for (const proxyUrl of proxyUrls) {
      try {
        const response = await fetch(proxyUrl, { timeout: 10000 });
        if (response.ok) {
          const data = await response.json();
          xmlText = data.contents || await response.text();
          break;
        }
      } catch (e) {
        console.warn(`Proxy failed: ${proxyUrl}`);
        continue;
      }
    }
    
    if (!xmlText) {
      throw new Error('All proxies failed');
    }
    
    // 解析 XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    const items = xmlDoc.querySelectorAll('item');
    const articles = [];
    
    items.forEach((item, index) => {
      if (index >= 10) return; // 只取前10条
      
      const title = item.querySelector('title')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      
      // 清理 HTML 标签
      const cleanDescription = description
        .replace(/<[^>]*>/g, '')
        .substring(0, 200) + '...';
      
      articles.push({
        title,
        summary: cleanDescription,
        url: link,
        publishedAt: new Date(pubDate).toISOString(),
        source: rssUrl
      });
    });
    
    return articles;
  } catch (error) {
    console.error(`Failed to parse RSS: ${rssUrl}`, error);
    return [];
  }
};

/**
 * 从所有 RSS 源获取新闻
 */
export const fetchRSSNews = async () => {
  console.log('📡 开始抓取 RSS 新闻...');
  
  const allNews = [];
  const enabledSources = RSS_SOURCES.filter(s => s.enabled);
  
  for (const source of enabledSources) {
    try {
      console.log(`📰 正在抓取: ${source.name}`);
      const articles = await parseRSS(source.url);
      
      articles.forEach(article => {
        allNews.push({
          ...article,
          category: source.category,
          source: source.name,
          id: `rss-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          tags: extractTags(article.title),
          readTime: Math.ceil(article.summary.length / 200),
          views: 0
        });
      });
      
      console.log(`✅ ${source.name}: 获取 ${articles.length} 条`);
    } catch (error) {
      console.error(`❌ ${source.name} 抓取失败:`, error);
    }
  }
  
  // 按日期排序
  allNews.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  
  console.log(`📊 总共获取 ${allNews.length} 条新闻`);
  return allNews;
};

/**
 * 从标题提取标签
 */
const extractTags = (title) => {
  const keywords = [
    'AI', 'Spotify', 'Apple', 'Amazon', 'Google', 'YouTube',
    'TikTok', 'Universal', 'Sony', 'Warner', '版权', '版权',
    'streaming', 'stream', 'artist', 'label'
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
 * 获取最新的几条新闻
 */
export const getLatestNews = async (count = 10) => {
  const allNews = await fetchRSSNews();
  return allNews.slice(0, count);
};

/**
 * 搜索 RSS 新闻
 */
export const searchRSSNews = async (query) => {
  const allNews = await fetchRSSNews();
  const lowerQuery = query.toLowerCase();
  
  return allNews.filter(news => 
    news.title.toLowerCase().includes(lowerQuery) ||
    news.summary.toLowerCase().includes(lowerQuery)
  );
};
