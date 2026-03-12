/**
 * Automated News Fetcher - Real RSS Feed Version
 * Fetches news from multiple RSS sources with fallback
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { XMLParser } from 'fast-xml-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

// RSS Feed Sources for AI Music News
const RSS_SOURCES = [
  {
    url: 'https://www.musicbusinessworldwide.com/feed/',
    source: 'Music Business Worldwide',
    category: 'industry-news'
  },
  {
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    source: 'TechCrunch AI',
    category: 'ai-research'
  },
  {
    url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
    source: 'The Verge AI',
    category: 'tech-innovation'
  },
  {
    url: 'https://venturebeat.com/category/ai/feed/',
    source: 'VentureBeat AI',
    category: 'ai-research'
  },
  {
    url: 'https://www.billboard.com/feed/',
    source: 'Billboard',
    category: 'industry-news'
  }
];

// Keywords to filter relevant articles
const MUSIC_AI_KEYWORDS = [
  'music', 'audio', 'song', 'artist', 'album', 'streaming', 'spotify', 'apple music',
  'sound', 'musician', 'band', 'record', 'label', 'production', 'mastering',
  'composition', 'generative music', 'ai music', 'music ai', 'audio ai'
];

// Category mapping based on content
function categorizeArticle(title, description) {
  const text = (title + ' ' + description).toLowerCase();
  
  if (text.includes('research') || text.includes('model') || text.includes('algorithm') || 
      text.includes('neural') || text.includes('deep learning') || text.includes('paper')) {
    return 'ai-research';
  }
  if (text.includes('startup') || text.includes('funding') || text.includes('investment') ||
      text.includes('partnership') || text.includes('acquisition') || text.includes('merger')) {
    return 'industry-news';
  }
  if (text.includes('trend') || text.includes('market') || text.includes('growth') ||
      text.includes('report') || text.includes('study') || text.includes('survey')) {
    return 'trends-analysis';
  }
  if (text.includes('new feature') || text.includes('launch') || text.includes('release') ||
      text.includes('update') || text.includes('tool') || text.includes('app')) {
    return 'tech-innovation';
  }
  
  return 'industry-news';
}

// Extract tags from article
function extractTags(title, description) {
  const text = (title + ' ' + description).toLowerCase();
  const tags = [];
  
  const tagKeywords = {
    'Spotify': ['spotify'],
    'Apple Music': ['apple music'],
    'AI': ['ai', 'artificial intelligence'],
    'Machine Learning': ['machine learning', 'ml'],
    'Generative AI': ['generative', 'genai'],
    'Streaming': ['streaming', 'stream'],
    'Production': ['production', 'producing'],
    'Copyright': ['copyright', 'licensing'],
    'Startup': ['startup', 'venture'],
    'Research': ['research', 'study']
  };
  
  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some(kw => text.includes(kw))) {
      tags.push(tag);
    }
  }
  
  return tags.slice(0, 5); // Max 5 tags
}

// Calculate read time
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

// Check if article is relevant to music/AI
function isRelevantArticle(title, description) {
  const text = (title + ' ' + description).toLowerCase();
  return MUSIC_AI_KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()));
}

// Fetch and parse RSS feed
async function fetchRSSFeed(source) {
  try {
    console.log(`  📡 Fetching: ${source.source}`);
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const response = await fetch(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const xml = await response.text();
    
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      parseAttributeValue: true
    });
    
    const result = parser.parse(xml);
    const items = result.rss?.channel?.item || [];
    
    console.log(`  ✅ ${source.source}: ${items.length} articles found`);
    
    return items.map(item => ({
      title: item.title?.replace(/<[^>]*>/g, '') || 'Untitled',
      description: (item.description || item.summary || '')
        .replace(/<[^>]*>/g, '')
        .substring(0, 500),
      link: item.link,
      pubDate: item.pubDate || item.published,
      source: source.source,
      category: source.category
    }));
    
  } catch (error) {
    console.log(`  ❌ ${source.source}: ${error.message}`);
    return [];
  }
}

// Fetch from NewsAPI (if API key available)
async function fetchNewsAPI() {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    console.log('  ℹ️ No NEWS_API_KEY, skipping NewsAPI');
    return [];
  }
  
  try {
    console.log('  📡 Fetching: NewsAPI');
    
    const query = encodeURIComponent('AI music OR artificial intelligence music OR music technology');
    const url = `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&language=en&pageSize=20&apiKey=${apiKey}`;
    
    const response = await fetch(url, { timeout: 10000 });
    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error(data.message || 'API error');
    }
    
    console.log(`  ✅ NewsAPI: ${data.articles?.length || 0} articles found`);
    
    return (data.articles || []).map(article => ({
      title: article.title,
      description: article.description || article.content || '',
      link: article.url,
      pubDate: article.publishedAt,
      source: article.source?.name || 'NewsAPI',
      category: categorizeArticle(article.title, article.description || '')
    }));
    
  } catch (error) {
    console.log(`  ❌ NewsAPI: ${error.message}`);
    return [];
  }
}

// Generate fallback news if no sources work
function generateFallbackNews() {
  const today = new Date();
  
  return [
    {
      id: `fallback-${today.toISOString().split('T')[0]}-1`,
      title: 'AI Music Industry Continues Rapid Growth',
      summary: 'The AI music sector shows continued expansion with new tools and platforms emerging for artists and producers.',
      category: 'trends-analysis',
      source: 'Industry Report',
      author: 'AI News Bot',
      publishedAt: today.toISOString(),
      url: 'https://music-ai-insights-webapp.vercel.app/',
      imageUrl: null,
      tags: ['AI', 'Music', 'Trends'],
      readTime: 5,
      fetchedAt: today.toISOString()
    },
    {
      id: `fallback-${today.toISOString().split('T')[0]}-2`,
      title: 'New AI Music Tools Released This Week',
      summary: 'Several new AI-powered music production tools have been released, offering innovative features for musicians.',
      category: 'tech-innovation',
      source: 'Tech News',
      author: 'AI News Bot',
      publishedAt: today.toISOString(),
      url: 'https://music-ai-insights-webapp.vercel.app/',
      imageUrl: null,
      tags: ['AI', 'Music', 'Technology'],
      readTime: 4,
      fetchedAt: today.toISOString()
    }
  ];
}

// Main fetch function
export async function fetchAndStoreNews() {
  console.log('\n🔄 Starting automated news update...');
  console.log(`⏰ ${new Date().toISOString()}`);
  console.log('');
  
  let allArticles = [];
  
  // Fetch from RSS sources
  console.log('📰 Fetching from RSS feeds...');
  for (const source of RSS_SOURCES) {
    const articles = await fetchRSSFeed(source);
    allArticles = allArticles.concat(articles);
  }
  
  // Fetch from NewsAPI
  console.log('');
  console.log('📰 Fetching from NewsAPI...');
  const newsApiArticles = await fetchNewsAPI();
  allArticles = allArticles.concat(newsApiArticles);
  
  console.log('');
  console.log(`📊 Total articles fetched: ${allArticles.length}`);
  
  // Filter for relevant articles
  const relevantArticles = allArticles.filter(article => 
    isRelevantArticle(article.title, article.description)
  );
  
  console.log(`📊 Relevant articles: ${relevantArticles.length}`);
  
  // Transform to our format
  let newsData = relevantArticles.map((article, index) => {
    const category = categorizeArticle(article.title, article.description);
    const tags = extractTags(article.title, article.description);
    
    return {
      id: `news-${Date.now()}-${index}`,
      title: article.title,
      summary: article.description.substring(0, 300) + (article.description.length > 300 ? '...' : ''),
      category,
      source: article.source,
      author: article.author || 'Unknown',
      publishedAt: article.pubDate ? new Date(article.pubDate).toISOString() : new Date().toISOString(),
      url: article.link || 'https://music-ai-insights-webapp.vercel.app/',
      imageUrl: null,
      tags,
      readTime: calculateReadTime(article.description),
      fetchedAt: new Date().toISOString()
    };
  });
  
  // If no articles fetched, use fallback
  if (newsData.length === 0) {
    console.log('⚠️ No articles fetched, using fallback data');
    newsData = generateFallbackNews();
  }
  
  // Sort by published date (newest first)
  newsData.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  
  // Limit to 20 articles
  newsData = newsData.slice(0, 20);
  
  // Calculate metadata
  const categories = newsData.reduce((acc, article) => {
    acc[article.category] = (acc[article.category] || 0) + 1;
    return acc;
  }, {});
  
  const sources = [...new Set(newsData.map(a => a.source))];
  
  const metadata = {
    lastUpdated: new Date().toISOString(),
    totalArticles: newsData.length,
    categories,
    sources,
    updateSource: 'github-actions-auto'
  };
  
  // Save to files
  const newsPath = join(DATA_DIR, 'news.json');
  const metadataPath = join(DATA_DIR, 'metadata.json');
  
  writeFileSync(newsPath, JSON.stringify(newsData, null, 2));
  writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  
  console.log('');
  console.log(`✅ Saved ${newsData.length} articles`);
  console.log(`📊 Categories:`, categories);
  console.log(`💾 Data saved to: ${newsPath}`);
  
  return {
    success: true,
    totalArticles: newsData.length,
    categories,
    lastUpdated: metadata.lastUpdated
  };
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchAndStoreNews()
    .then(result => {
      console.log('\n✅ Auto-update completed:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Auto-update failed:', error);
      process.exit(1);
    });
}
