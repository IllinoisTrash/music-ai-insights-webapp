import { getDailyDigestPrompt } from '../prompts/systemPrompts';

/**
 * 内容生成服务
 * 用于自动生成每日洞察内容
 */

// 模拟内容源 - 实际应用中可以从 RSS、API 等获取
const CONTENT_SOURCES = {
  rss: [
    { name: 'Music Ally', url: 'https://musically.com/feed/' },
    { name: 'Music Business Worldwide', url: 'https://www.musicbusinessworldwide.com/feed/' },
    { name: 'AI Music News', url: 'https://aimusicnews.com/feed' },
  ],
  apis: [
    { name: 'NewsAPI', endpoint: 'https://newsapi.org/v2/everything' },
    { name: 'GNews', endpoint: 'https://gnews.io/api/v4/search' },
  ]
};

// 生成模拟的原始内容
const generateRawContent = () => {
  const topics = [
    {
      title: 'Suno AI 发布 V4 版本，支持更长音频生成',
      source: 'AI Music News',
      summary: 'Suno AI 宣布推出 V4 版本，新功能包括支持生成最长 4 分钟的音频，以及改进的音质和更多音乐风格选项。',
      category: 'ai-research'
    },
    {
      title: '环球音乐集团与 AI 公司达成版权协议',
      source: 'Music Business Worldwide',
      summary: '环球音乐集团宣布与多家 AI 音乐公司签署协议，确保艺术家权益在 AI 训练数据使用中得到保护。',
      category: 'industry-news'
    },
    {
      title: '2024 年 AI 音乐市场规模突破 10 亿美元',
      source: 'Market Research',
      summary: '最新报告显示，全球 AI 音乐市场在过去一年增长迅速，预计 2025 年将达到 15 亿美元。',
      category: 'trends'
    },
    {
      title: 'Spotify 推出 AI 驱动的播放列表封面生成器',
      source: 'TechCrunch',
      summary: 'Spotify 新功能允许用户使用 AI 生成个性化的播放列表封面图片，提升用户体验。',
      category: 'technology'
    }
  ];

  // 随机选择 3-5 个话题
  const shuffled = topics.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 3) + 3);
};

/**
 * 生成每日洞察内容
 * @returns {Promise<Array>} 生成的洞察列表
 */
export const generateDailyContent = async () => {
  console.log('🤖 开始生成每日洞察内容...');
  
  // 模拟从各种来源获取原始内容
  const rawContent = generateRawContent();
  
  // 在实际应用中，这里会：
  // 1. 调用 AI 服务对内容进行总结和优化
  // 2. 使用 getDailyDigestPrompt() 生成结构化内容
  // 3. 保存到数据库
  
  // 为生成的内容分配真实的来源链接
  const sourceUrls = {
    'AI Music News': 'https://musically.com/',
    'Music Business Worldwide': 'https://www.musicbusinessworldwide.com/',
    'Market Research': 'https://www.midiaresearch.com/',
    'TechCrunch': 'https://techcrunch.com/category/artificial-intelligence/'
  };

  const insights = rawContent.map((item, index) => ({
    id: `insight-${Date.now()}-${index}`,
    title: item.title,
    summary: item.summary,
    category: item.category,
    source: item.source,
    publishedAt: new Date().toISOString(),
    url: sourceUrls[item.source] || 'https://musically.com/',
    tags: generateTags(item.title, item.category),
    readTime: Math.ceil(item.summary.length / 200), // 估算阅读时间
    views: 0,
    isGenerated: true
  }));

  console.log(`✅ 成功生成 ${insights.length} 条洞察`);
  
  // 保存到本地存储（模拟持久化）
  saveGeneratedContent(insights);
  
  return insights;
};

/**
 * 根据标题和分类生成标签
 */
const generateTags = (title, category) => {
  const tagMap = {
    'ai-research': ['AI', '研究', '技术'],
    'industry-news': ['行业', '新闻', '商业'],
    'trends': ['趋势', '市场', '分析'],
    'technology': ['技术', '产品', '创新']
  };
  
  const baseTags = tagMap[category] || ['音乐', 'AI'];
  
  // 从标题中提取关键词
  const keywords = ['Suno', 'Spotify', '环球音乐', '版权', '市场', '生成'];
  const extractedTags = keywords.filter(kw => title.includes(kw));
  
  return [...new Set([...baseTags, ...extractedTags])].slice(0, 5);
};

/**
 * 保存生成的内容到本地存储
 */
const saveGeneratedContent = (insights) => {
  const existing = JSON.parse(localStorage.getItem('generated_insights') || '[]');
  const combined = [...insights, ...existing];
  
  // 只保留最近 30 天的内容
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const filtered = combined.filter(item => 
    new Date(item.publishedAt) > thirtyDaysAgo
  );
  
  localStorage.setItem('generated_insights', JSON.stringify(filtered));
  localStorage.setItem('last_generated', new Date().toISOString());
};

/**
 * 获取生成的内容
 */
export const getGeneratedContent = () => {
  return JSON.parse(localStorage.getItem('generated_insights') || '[]');
};

/**
 * 检查今天是否已经生成过内容
 */
export const hasGeneratedToday = () => {
  const lastGenerated = localStorage.getItem('last_generated');
  if (!lastGenerated) return false;
  
  const lastDate = new Date(lastGenerated);
  const today = new Date();
  
  return lastDate.toDateString() === today.toDateString();
};

/**
 * 设置定时任务
 * 每天凌晨 6 点自动生成内容
 */
export const scheduleDailyGeneration = () => {
  // 检查是否需要立即生成
  if (!hasGeneratedToday()) {
    generateDailyContent();
  }
  
  // 设置定时检查（每小时检查一次）
  setInterval(() => {
    const now = new Date();
    // 在早上 6 点生成
    if (now.getHours() === 6 && !hasGeneratedToday()) {
      generateDailyContent();
    }
  }, 60 * 60 * 1000); // 每小时检查一次
  
  console.log('⏰ 定时任务已设置，每天凌晨 6 点自动生成内容');
};

/**
 * 手动触发内容生成
 */
export const manualGenerateContent = async () => {
  console.log('🔄 手动触发内容生成...');
  return await generateDailyContent();
};
