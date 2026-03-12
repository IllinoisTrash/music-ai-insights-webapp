/**
 * RSS 代理 API
 * 部署为 Serverless Function，绕过 CORS 限制
 */

const RSS_SOURCES = [
  {
    name: 'Music Ally',
    url: 'https://musically.com/feed/',
    category: 'industry-news'
  },
  {
    name: 'Music Business Worldwide',
    url: 'https://www.musicbusinessworldwide.com/feed/',
    category: 'industry-news'
  },
  {
    name: 'Hypebot',
    url: 'https://hypebot.com/feed/',
    category: 'industry-news'
  }
];

export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const allNews = [];

    for (const source of RSS_SOURCES) {
      try {
        const response = await fetch(source.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader)'
          }
        });

        if (!response.ok) continue;

        const xmlText = await response.text();
        const articles = parseRSS(xmlText, source);
        allNews.push(...articles);
      } catch (error) {
        console.error(`Failed to fetch ${source.name}:`, error);
      }
    }

    // 按日期排序
    allNews.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    res.status(200).json({
      success: true,
      count: allNews.length,
      data: allNews.slice(0, 20)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

function parseRSS(xmlText, source) {
  const articles = [];
  
  // 简单的 RSS 解析
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const items = xmlText.match(itemRegex) || [];
  
  items.slice(0, 10).forEach(item => {
    const title = extractTag(item, 'title');
    const description = extractTag(item, 'description');
    const link = extractTag(item, 'link');
    const pubDate = extractTag(item, 'pubDate');
    
    if (title) {
      articles.push({
        id: `rss-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: cleanText(title),
        summary: cleanText(description).substring(0, 200) + '...',
        category: source.category,
        source: source.name,
        publishedAt: new Date(pubDate).toISOString(),
        url: link,
        tags: extractTags(title),
        readTime: Math.ceil(description.length / 200),
        views: 0
      });
    }
  });
  
  return articles;
}

function extractTag(xml, tagName) {
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`);
  const match = xml.match(regex);
  return match ? match[1] : '';
}

function cleanText(text) {
  return text
    .replace(/<![CDATA[|]]>/g, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

function extractTags(title) {
  const keywords = ['AI', 'Spotify', 'Apple', 'Amazon', 'Google', 'YouTube', 'TikTok', 'Universal', 'Sony', 'Warner'];
  return keywords.filter(kw => title.toLowerCase().includes(kw.toLowerCase())).slice(0, 5);
}
