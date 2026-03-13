/**
 * Automated News Fetcher - Enhanced Version
 * Fetches news from multiple RSS sources with better categorization and HTML decoding
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

// RSS Feed Sources - diversified for better content quality
const RSS_SOURCES = [
  // AI Research sources
  {
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    source: 'TechCrunch AI',
    defaultCategory: 'ai-research',
    priority: 1
  },
  {
    url: 'https://venturebeat.com/category/ai/feed/',
    source: 'VentureBeat AI',
    defaultCategory: 'ai-research',
    priority: 1
  },
  {
    url: 'https://www.marktechpost.com/feed/',
    source: 'MarkTechPost',
    defaultCategory: 'ai-research',
    priority: 1
  },
  
  // Tech Innovation sources
  {
    url: 'https://www.wired.com/feed/tag/ai/latest/rss',
    source: 'Wired AI',
    defaultCategory: 'tech-innovation',
    priority: 1
  },
  
  // Industry News sources - Music specific
  {
    url: 'https://www.musicbusinessworldwide.com/feed/',
    source: 'Music Business Worldwide',
    defaultCategory: 'industry-news',
    priority: 2
  },
  {
    url: 'https://www.billboard.com/feed/',
    source: 'Billboard',
    defaultCategory: 'industry-news',
    priority: 2
  }
];

// Keywords for content filtering - STRICT matching
const MUSIC_AI_KEYWORDS = {
  'ai-research': ['artificial intelligence', 'machine learning', 'deep learning', 'neural network', 'ai model', 'ai algorithm', 'ai research', 'ai study', 'ai paper', 'generative ai', 'large language model', 'llm', 'transformer', 'gpt', 'diffusion model'],
  'tech-innovation': ['ai tool', 'ai platform', 'ai software', 'ai app', 'ai feature', 'ai launch', 'ai release', 'ai update', 'ai product', 'ai service'],
  'industry-news': ['ai partnership', 'ai deal', 'ai acquisition', 'ai funding', 'ai investment', 'ai startup', 'music ai', 'ai music'],
  'trends-analysis': ['ai trend', 'ai market', 'ai growth', 'ai report', 'ai survey', 'ai analysis', 'ai forecast', 'ai outlook']
};

// Music-specific keywords for relevance check
const MUSIC_KEYWORDS = ['music', 'audio', 'song', 'artist', 'musician', 'band', 'album', 'streaming', 'spotify', 'apple music', 'record label', 'publisher', 'composer', 'producer', 'soundtrack', 'concert', 'festival', 'live music', 'music production', 'music industry'];

// AI-specific keywords for relevance check
const AI_KEYWORDS = ['artificial intelligence', 'machine learning', 'deep learning', 'neural network', 'ai ', 'generative ai', 'chatgpt', 'claude', 'llm', 'large language model'];

// Irrelevant keywords to exclude
const EXCLUDE_KEYWORDS = ['f1', 'formula 1', 'formula one', 'racing', 'grand prix', 'race car', 'nascar', 'motorsport', 'soccer', 'football', 'basketball', 'baseball', 'tennis', 'golf', 'olympics', 'world cup'];

// HTML entity decoder
function decodeHtmlEntities(text) {
  if (!text) return '';
  
  const entities = {
    '&#8216;': '\u2018', '&#8217;': '\u2019', '&#8220;': '\u201c', '&#8221;': '\u201d',
    '&#8230;': '\u2026', '&#8211;': '\u2013', '&#8212;': '\u2014', '&#160;': ' ',
    '&#169;': '\u00a9', '&#174;': '\u00ae', '&#8482;': '\u2122', '&#38;': '&',
    '&#60;': '<', '&#62;': '>', '&#39;': "'", '&#34;': '"',
    '&#038;': '&', '&amp;': '&',
    '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'",
    '&nbsp;': ' ', '&mdash;': '\u2014', '&ndash;': '\u2013', '&hellip;': '\u2026',
    '&lsquo;': '\u2018', '&rsquo;': '\u2019', '&ldquo;': '\u201c', '&rdquo;': '\u201d'
  };
  
  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char);
  }
  
  // Handle numeric entities
  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(dec);
  });
  
  // Handle hex entities
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
  
  return decoded;
}

// Check if article should be excluded
function shouldExclude(title, description) {
  const text = (title + ' ' + description).toLowerCase();
  return EXCLUDE_KEYWORDS.some(kw => text.includes(kw));
}

// Relevance check - accepts Music OR AI content, but prioritizes Music+AI overlap
function isRelevantArticle(title, description, sourceName) {
  const text = (title + ' ' + description).toLowerCase();
  
  // First check if it should be excluded (sports, racing, etc.)
  if (shouldExclude(title, description)) {
    console.log(`    🚫 Excluded (sports/racing): ${title.substring(0, 60)}...`);
    return false;
  }
  
  // Check for music relevance
  const hasMusic = MUSIC_KEYWORDS.some(kw => text.includes(kw.toLowerCase()));
  
  // Check for AI relevance
  const hasAI = AI_KEYWORDS.some(kw => text.includes(kw.toLowerCase()));
  
  // For music industry sources (Billboard, MBW), accept music-related content
  const isMusicSource = sourceName && (
    sourceName.includes('Billboard') || 
    sourceName.includes('Music Business Worldwide')
  );
  
  // For AI sources, accept AI-related content
  const isAISource = sourceName && (
    sourceName.includes('TechCrunch') ||
    sourceName.includes('VentureBeat') ||
    sourceName.includes('MarkTechPost') ||
    sourceName.includes('Wired')
  );
  
  // Article is relevant if:
  // 1. It has BOTH music AND AI content (highest priority)
  // 2. It's from a music source AND has music content
  // 3. It's from an AI source AND has AI content
  if (hasMusic && hasAI) {
    return true;
  }
  
  if (isMusicSource && hasMusic) {
    return true;
  }
  
  if (isAISource && hasAI) {
    return true;
  }
  
  console.log(`    🚫 Not relevant: ${title.substring(0, 60)}...`);
  return false;
}

// Smart categorization based on content analysis
function categorizeArticle(title, description, defaultCategory) {
  const text = (title + ' ' + description).toLowerCase();
  
  // Score each category
  const scores = {};
  for (const [category, keywords] of Object.entries(MUSIC_AI_KEYWORDS)) {
    scores[category] = keywords.filter(kw => text.includes(kw)).length;
  }
  
  // Find category with highest score
  let bestCategory = defaultCategory || 'industry-news';
  let maxScore = 0;
  
  for (const [category, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  }
  
  // If no clear match, use source-based default
  if (maxScore === 0) {
    return defaultCategory || 'industry-news';
  }
  
  return bestCategory;
}

// Extract tags from article
function extractTags(title, description) {
  const text = (title + ' ' + description).toLowerCase();
  const tags = [];
  
  const tagKeywords = {
    'Spotify': ['spotify'],
    'Apple Music': ['apple music'],
    'AI': ['ai', 'artificial intelligence'],
    'Machine Learning': ['machine learning'],
    'Generative AI': ['generative ai', 'genai'],
    'Streaming': ['streaming'],
    'Music Production': ['music production', 'audio production'],
    'Copyright': ['copyright', 'licensing'],
    'Startup': ['startup'],
    'Research': ['research', 'study'],
    'Investment': ['funding', 'investment'],
    'Partnership': ['partnership', 'collaboration']
  };
  
  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some(kw => text.includes(kw))) {
      tags.push(tag);
    }
  }
  
  return tags.slice(0, 5);
}

// Calculate read time
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

// Fetch and parse RSS feed
async function fetchRSSFeed(source) {
  try {
    console.log(`  📡 Fetching: ${source.source}`);
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    
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
      parseAttributeValue: true,
      textNodeName: '#text',
      parseTagValue: false
    });
    
    const result = parser.parse(xml);
    const items = result.rss?.channel?.item || [];
    
    console.log(`  ✅ ${source.source}: ${items.length} articles found`);
    
    return items.map(item => {
      const rawTitle = item.title?.replace(/<[^>]*>/g, '') || 'Untitled';
      const rawDescription = (item.description || item.summary || '')
        .replace(/<[^>]*>/g, '')
        .substring(0, 500);
      
      return {
        title: decodeHtmlEntities(rawTitle),
        description: decodeHtmlEntities(rawDescription),
        link: item.link,
        pubDate: item.pubDate || item.published,
        source: source.source,
        defaultCategory: source.defaultCategory
      };
    });
    
  } catch (error) {
    console.log(`  ❌ ${source.source}: ${error.message}`);
    return [];
  }
}

// Main function
async function autoUpdateNews() {
  console.log('\n🔄 Starting automated news update...\n');
  console.log(`⏰ ${new Date().toISOString()}\n`);
  
  const allArticles = [];
  
  // Fetch from RSS feeds
  console.log('📰 Fetching from RSS feeds...');
  for (const source of RSS_SOURCES) {
    const articles = await fetchRSSFeed(source);
    allArticles.push(...articles);
  }
  
  console.log(`\n📊 Total articles fetched: ${allArticles.length}`);
  
  // Filter relevant articles
  const relevantArticles = allArticles.filter(article => 
    isRelevantArticle(article.title, article.description, article.source)
  );
  
  console.log(`📊 Relevant articles: ${relevantArticles.length}`);
  
  // Process and categorize articles
  const processedArticles = relevantArticles.map((article, index) => {
    const category = categorizeArticle(
      article.title, 
      article.description, 
      article.defaultCategory
    );
    
    return {
      id: `news-${Date.now()}-${index}`,
      title: article.title,
      summary: article.description,
      category: category,
      source: article.source,
      author: 'Unknown',
      publishedAt: new Date(article.pubDate || Date.now()).toISOString(),
      url: article.link,
      imageUrl: null,
      tags: extractTags(article.title, article.description),
      readTime: calculateReadTime(article.description),
      fetchedAt: new Date().toISOString()
    };
  });
  
  // Sort by published date (newest first)
  processedArticles.sort((a, b) => 
    new Date(b.publishedAt) - new Date(a.publishedAt)
  );
  
  // Limit to 20 most recent articles
  const finalArticles = processedArticles.slice(0, 20);
  
  // Calculate category distribution
  const categoryCount = finalArticles.reduce((acc, article) => {
    acc[article.category] = (acc[article.category] || 0) + 1;
    return acc;
  }, {});
  
  console.log('\n📊 Category distribution:');
  for (const [cat, count] of Object.entries(categoryCount)) {
    console.log(`  ${cat}: ${count} articles`);
  }
  
  // Get unique sources
  const sources = [...new Set(finalArticles.map(a => a.source))];
  
  // Save to file
  const newsPath = join(DATA_DIR, 'news.json');
  writeFileSync(newsPath, JSON.stringify(finalArticles, null, 2));
  
  // Update metadata
  const metadata = {
    lastUpdated: new Date().toISOString(),
    totalArticles: finalArticles.length,
    categories: categoryCount,
    sources: sources,
    updateSource: 'github-actions-auto'
  };
  
  const metadataPath = join(DATA_DIR, 'metadata.json');
  writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  
  console.log(`\n✅ Saved ${finalArticles.length} articles`);
  console.log(`📊 Categories:`, categoryCount);
  console.log(`💾 Data saved to: ${newsPath}`);
  
  return {
    success: true,
    totalArticles: finalArticles.length,
    categories: categoryCount,
    lastUpdated: metadata.lastUpdated
  };
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  autoUpdateNews()
    .then(result => {
      console.log('\n✅ Auto-update completed:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Auto-update failed:', error);
      process.exit(1);
    });
}

export { autoUpdateNews };
