import Parser from 'rss-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { storeNews, getStoredNews } from './storage.js';
import { getBackupNews } from '../data/backupNews.js';

const rssParser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml'
  },
  requestOptions: {
    rejectUnauthorized: false
  }
});

// RSS Sources for Music Industry & AI
// Using reliable RSS feeds with good availability
const RSS_SOURCES = [
  {
    name: 'Music Business Worldwide',
    url: 'https://www.musicbusinessworldwide.com/feed/',
    category: 'industry-news',
    priority: 1
  },
  {
    name: 'Hypebot',
    url: 'https://hypebot.com/feed/',
    category: 'industry-news',
    priority: 2
  },
  {
    name: 'MusicTech',
    url: 'https://musictech.com/feed/',
    category: 'tech-innovation',
    priority: 1
  },
  {
    name: 'Create Digital Music',
    url: 'https://cdm.link/feed/',
    category: 'tech-innovation',
    priority: 2
  },
  {
    name: 'Synthtopia',
    url: 'https://www.synthtopia.com/feed',
    category: 'tech-innovation',
    priority: 2
  },
  {
    name: 'DJ Mag',
    url: 'https://djmag.com/rss.xml',
    category: 'industry-news',
    priority: 2
  }
];

// Keywords for categorization
const CATEGORY_KEYWORDS = {
  'ai-research': ['AI', 'artificial intelligence', 'machine learning', 'neural', 'model', 'algorithm', 'generative', 'ChatGPT', 'LLM'],
  'tech-innovation': ['technology', 'software', 'plugin', 'DAW', 'synthesizer', 'audio', 'production tool', 'innovation'],
  'industry-news': ['streaming', 'Spotify', 'Apple Music', 'revenue', 'record label', 'artist', 'tour', 'concert', 'festival'],
  'trends-analysis': ['trend', 'report', 'analysis', 'data', 'statistics', 'market', 'growth', 'decline']
};

function categorizeArticle(title, content) {
  const text = `${title} ${content}`.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
      return category;
    }
  }
  
  return 'industry-news';
}

function generateSummary(content, maxLength = 200) {
  // Remove HTML tags
  const cleanText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  
  // Try to end at a sentence
  const truncated = cleanText.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastPeriod > maxLength * 0.7) {
    return truncated.substring(0, lastPeriod + 1);
  }
  
  return truncated.substring(0, lastSpace) + '...';
}

function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

async function fetchRSSFeed(source) {
  try {
    console.log(`📡 Fetching: ${source.name}`);
    const feed = await rssParser.parseURL(source.url);
    
    return feed.items.slice(0, 10).map(item => {
      const content = item['content:encoded'] || item.content || item.summary || '';
      const category = categorizeArticle(item.title, content);
      
      return {
        id: `rss-${Buffer.from(item.link || item.guid || '').toString('base64').substring(0, 12)}`,
        title: item.title?.trim() || 'Untitled',
        summary: generateSummary(content, 250),
        category: category,
        source: source.name,
        author: item.creator || item.author || source.name,
        publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
        url: item.link || item.guid || '',
        imageUrl: extractImageUrl(content, item.enclosure),
        tags: extractTags(item.categories, item.title, content),
        readTime: calculateReadTime(content),
        fetchedAt: new Date().toISOString()
      };
    });
  } catch (error) {
    console.error(`❌ Failed to fetch ${source.name}:`, error.message);
    return [];
  }
}

function extractImageUrl(content, enclosure) {
  // Try enclosure first
  if (enclosure?.url && enclosure.type?.startsWith('image/')) {
    return enclosure.url;
  }
  
  // Try to extract from content
  if (content) {
    const $ = cheerio.load(content);
    const img = $('img').first();
    if (img.length) {
      return img.attr('src') || img.attr('data-src');
    }
  }
  
  return null;
}

function extractTags(categories, title, content) {
  const tags = new Set();
  
  // Add RSS categories
  if (categories) {
    const cats = Array.isArray(categories) ? categories : [categories];
    cats.forEach(cat => tags.add(cat.toString().trim()));
  }
  
  // Extract common music/AI keywords
  const text = `${title} ${content}`.toLowerCase();
  const keywords = [
    'Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music',
    'AI', 'Machine Learning', 'Streaming', 'Royalty', 'Copyright',
    'Record Label', 'Independent Artist', 'Tour', 'Festival',
    'Music Production', 'Audio Technology', 'Synthesizer'
  ];
  
  keywords.forEach(keyword => {
    if (text.includes(keyword.toLowerCase())) {
      tags.add(keyword);
    }
  });
  
  return Array.from(tags).slice(0, 5);
}

async function fetchNewsAPI() {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    console.log('ℹ️ No News API key configured, skipping');
    return [];
  }
  
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: '(music AND AI) OR (music technology) OR (streaming music)',
        sortBy: 'publishedAt',
        language: 'en',
        pageSize: 20,
        apiKey: apiKey
      },
      timeout: 10000
    });
    
    return response.data.articles.map(article => ({
      id: `newsapi-${Buffer.from(article.url).toString('base64').substring(0, 12)}`,
      title: article.title,
      summary: article.description || generateSummary(article.content || '', 250),
      category: categorizeArticle(article.title, article.description || ''),
      source: article.source.name,
      author: article.author || article.source.name,
      publishedAt: article.publishedAt,
      url: article.url,
      imageUrl: article.urlToImage,
      tags: extractTags([], article.title, article.description || ''),
      readTime: calculateReadTime(article.content || article.description || ''),
      fetchedAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error('❌ News API fetch failed:', error.message);
    return [];
  }
}

export async function fetchAndStoreNews() {
  console.log('\n🔄 Starting news fetch cycle...');
  console.log(`⏰ ${new Date().toISOString()}`);
  
  const allArticles = [];
  let rssSuccessCount = 0;
  
  // Fetch from RSS sources
  for (const source of RSS_SOURCES) {
    const articles = await fetchRSSFeed(source);
    if (articles.length > 0) {
      allArticles.push(...articles);
      rssSuccessCount++;
    }
    // Small delay to be nice to servers
    await new Promise(resolve => setTimeout(resolve, 800));
  }
  
  // Fetch from News API
  const newsApiArticles = await fetchNewsAPI();
  allArticles.push(...newsApiArticles);
  
  // If RSS fetching mostly failed, use backup data
  if (rssSuccessCount < 2 && allArticles.length < 5) {
    console.log('⚠️ RSS feeds mostly unavailable, using backup news data');
    const backupNews = getBackupNews();
    allArticles.push(...backupNews);
  }
  
  // Remove duplicates based on URL
  const seenUrls = new Set();
  const uniqueArticles = allArticles.filter(article => {
    if (seenUrls.has(article.url)) {
      return false;
    }
    seenUrls.add(article.url);
    return true;
  });
  
  // Sort by date (newest first)
  uniqueArticles.sort((a, b) => 
    new Date(b.publishedAt) - new Date(a.publishedAt)
  );
  
  // Keep only last 30 days of news (extended for backup data)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentArticles = uniqueArticles.filter(article => 
    new Date(article.publishedAt) >= thirtyDaysAgo
  );
  
  // Store the news
  storeNews(recentArticles);
  
  const categoryCounts = recentArticles.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + 1;
    return acc;
  }, {});
  
  console.log(`✅ Fetched ${allArticles.length} articles, ${uniqueArticles.length} unique, ${recentArticles.length} recent`);
  console.log(`📊 Categories:`, categoryCounts);
  
  return {
    totalFetched: allArticles.length,
    uniqueCount: uniqueArticles.length,
    storedCount: recentArticles.length,
    categories: Object.keys(CATEGORY_KEYWORDS),
    categoryCounts,
    lastUpdated: new Date().toISOString(),
    usingBackup: rssSuccessCount < 2
  };
}

// Export for testing
export { RSS_SOURCES, categorizeArticle };
