import { apiService } from './apiService';
import { getRealMusicNews, getNewsByCategory, searchRealNews } from '../data/realNews';

// Feature flag: Use backend API or local data
const USE_BACKEND_API = true;

// 备用数据（当所有数据源都失败时使用）
const FALLBACK_INSIGHTS = [
  {
    id: 'fallback-001',
    title: 'Suno AI 发布 V3 版本，音乐生成质量大幅提升',
    summary: 'Suno AI 最新发布的 V3 版本在音质和创作多样性方面都有显著提升。新版本支持更多音乐风格，包括古典、爵士、电子等，生成的音乐更加自然流畅。',
    category: 'ai-research',
    source: 'Music Ally',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    url: 'https://musically.com/2024/03/08/suno-ai-v3-music-generation/',
    tags: ['Suno', 'AI音乐生成', 'V3']
  },
  {
    id: 'fallback-002',
    title: 'Spotify 推出 AI DJ 功能，个性化体验再升级',
    summary: 'Spotify 正式向全球用户推出 AI DJ 功能，利用生成式AI技术为用户提供个性化的音乐推荐和解说服务。',
    category: 'industry-news',
    source: 'Music Business Worldwide',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    url: 'https://www.musicbusinessworldwide.com/spotify-ai-dj-global-launch/',
    tags: ['Spotify', 'AI DJ', '个性化推荐']
  },
  {
    id: 'fallback-003',
    title: '2024年全球音乐产业AI应用报告发布',
    summary: '最新报告显示，超过60%的音乐公司已经在创作、制作或分发环节使用AI技术。AI在音乐产业的应用正在从实验阶段走向规模化部署。',
    category: 'trends-analysis',
    source: 'MIDiA Research',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    url: 'https://www.midiaresearch.com/blog/ai-in-music-report-2024/',
    tags: ['行业报告', 'AI应用', '趋势']
  },
  {
    id: 'fallback-004',
    title: 'Google 发布 MusicFX：文本生成音乐的新突破',
    summary: 'Google 实验室推出 MusicFX，一款基于文本提示生成音乐的实验性工具。该工具使用先进的扩散模型，能够生成高质量的音乐片段。',
    category: 'ai-research',
    source: 'Google AI Blog',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    url: 'https://ai.googleblog.com/2024/01/musicfx-text-to-music-generation.html',
    tags: ['Google', 'MusicFX', '扩散模型']
  },
  {
    id: 'fallback-005',
    title: 'AI生成音乐的版权争议持续升温',
    summary: '随着AI音乐生成技术的普及，版权归属问题成为业界关注的焦点。多家唱片公司呼吁建立更明确的AI音乐版权法规。',
    category: 'industry-news',
    source: 'Billboard',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    url: 'https://www.billboard.com/pro/ai-music-copyright-legal-debate-2024/',
    tags: ['版权', '法律', 'AI音乐']
  },
  {
    id: 'fallback-006',
    title: '实时AI音乐协作平台获得新一轮融资',
    summary: '一家专注于实时AI音乐协作的初创公司宣布完成B轮融资，融资金额达1500万美元。该平台允许多位创作者同时使用AI工具进行音乐创作。',
    category: 'trends-analysis',
    source: 'TechCrunch',
    publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    url: 'https://techcrunch.com/2024/03/05/ai-music-collaboration-platform-funding/',
    tags: ['融资', '协作平台', '初创公司']
  }
];

/**
 * Fetch daily insights from backend API
 * Backend handles RSS fetching, categorization, and storage
 */
export const fetchDailyInsights = async (options = {}) => {
  console.log('📰 开始获取每日洞察...');
  
  if (USE_BACKEND_API) {
    try {
      console.log('🌐 调用后端 API...');
      const news = await apiService.getNews(options);
      
      if (news && news.length > 0) {
        console.log(`✅ 从后端获取 ${news.length} 条新闻`);
        return news;
      }
      
      console.warn('⚠️ 后端返回空数据，使用本地数据');
    } catch (error) {
      console.error('❌ 后端 API 调用失败:', error.message);
      console.log('📚 回退到本地数据...');
    }
  }
  
  // Fallback to local data
  try {
    const realNews = getRealMusicNews();
    if (realNews.length > 0) {
      console.log(`✅ 加载 ${realNews.length} 条本地新闻`);
      return realNews;
    }
  } catch (error) {
    console.error('❌ 本地数据加载失败:', error);
  }
  
  console.warn('⚠️ 使用备用数据');
  return FALLBACK_INSIGHTS;
};

/**
 * Fetch insights by category
 */
export const fetchInsightsByCategory = async (category) => {
  if (USE_BACKEND_API) {
    try {
      return await apiService.getNews({ category });
    } catch (error) {
      console.error('Backend category fetch failed:', error);
    }
  }
  return getNewsByCategory(category);
};

/**
 * Search insights
 */
export const searchInsights = async (query) => {
  if (USE_BACKEND_API) {
    try {
      return await apiService.getNews({ search: query });
    } catch (error) {
      console.error('Backend search failed:', error);
    }
  }
  return searchRealNews(query);
};

/**
 * Get trending topics
 */
export const fetchTrendingTopics = async () => {
  try {
    const metadata = await apiService.getMetadata();
    // Convert categories to trending format
    const categories = metadata.categories || {};
    return Object.entries(categories)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  } catch (error) {
    // Return default trending topics
    return [
      { topic: 'AI音乐生成', count: 15 },
      { topic: 'Suno AI', count: 12 },
      { topic: '版权法规', count: 8 },
      { topic: '个性化推荐', count: 7 },
      { topic: '虚拟艺人', count: 6 }
    ];
  }
};

/**
 * Get metadata about news sources
 */
export const fetchNewsMetadata = async () => {
  try {
    return await apiService.getMetadata();
  } catch (error) {
    return {
      lastUpdated: null,
      totalArticles: 0,
      categories: {},
      sources: []
    };
  }
};
