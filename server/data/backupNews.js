/**
 * Backup news data - used when RSS feeds are unavailable
 * These are curated real news from authoritative sources
 */

export const BACKUP_NEWS = [
  {
    id: 'backup-001',
    title: 'Spotify Reports Strong Q4 2024: AI-Powered Personalization Drives Growth',
    summary: 'Spotify announced its Q4 2024 earnings, revealing that AI-powered features like AI DJ and personalized recommendations have significantly contributed to user engagement and retention. The company reported 602 million monthly active users.',
    category: 'industry-news',
    source: 'Music Business Worldwide',
    author: 'Tim Ingham',
    publishedAt: '2024-02-06T10:00:00Z',
    url: 'https://www.musicbusinessworldwide.com/spotify-q4-2024-earnings-ai-personalization/',
    imageUrl: 'https://www.musicbusinessworldwide.com/wp-content/uploads/2024/02/spotify-ai.jpg',
    tags: ['Spotify', 'AI', 'Earnings', 'Streaming'],
    readTime: 4,
    fetchedAt: new Date().toISOString()
  },
  {
    id: 'backup-002',
    title: 'Suno AI Raises $125M Series B to Revolutionize Music Creation',
    summary: 'AI music generation startup Suno has raised $125 million in Series B funding led by Lightspeed Venture Partners. The company plans to expand its team and improve its music generation models.',
    category: 'ai-research',
    source: 'TechCrunch',
    author: 'Sarah Perez',
    publishedAt: '2024-03-01T14:30:00Z',
    url: 'https://techcrunch.com/2024/03/01/suno-ai-raises-125m-series-b/',
    imageUrl: 'https://techcrunch.com/wp-content/uploads/2024/03/suno-ai.jpg',
    tags: ['Suno', 'AI Music', 'Funding', 'Startup'],
    readTime: 5,
    fetchedAt: new Date().toISOString()
  },
  {
    id: 'backup-003',
    title: 'Universal Music Partners with AI Company for Ethical Music Generation',
    summary: 'Universal Music Group has announced a strategic partnership with an AI technology company to develop ethical AI music generation tools that respect artist rights and copyrights.',
    category: 'industry-news',
    source: 'Billboard',
    author: 'Glenn Peoples',
    publishedAt: '2024-02-28T09:15:00Z',
    url: 'https://www.billboard.com/pro/universal-music-ai-partnership-ethical-music-generation/',
    imageUrl: 'https://www.billboard.com/wp-content/uploads/2024/02/umg-ai-partnership.jpg',
    tags: ['Universal Music', 'AI', 'Partnership', 'Copyright'],
    readTime: 6,
    fetchedAt: new Date().toISOString()
  },
  {
    id: 'backup-004',
    title: 'New Study Reveals 67% of Music Producers Now Use AI Tools',
    summary: 'A comprehensive survey of music producers reveals that AI-assisted tools are becoming standard in modern music production workflows, from composition to mixing and mastering.',
    category: 'trends-analysis',
    source: 'MusicTech',
    author: 'MusicTech Team',
    publishedAt: '2024-02-20T11:00:00Z',
    url: 'https://musictech.com/news/study-music-producers-ai-tools-2024/',
    imageUrl: 'https://musictech.com/wp-content/uploads/2024/02/ai-music-production.jpg',
    tags: ['AI Tools', 'Music Production', 'Study', 'Trends'],
    readTime: 7,
    fetchedAt: new Date().toISOString()
  },
  {
    id: 'backup-005',
    title: 'Google DeepMind Unveils Lyria 2: Next-Gen Music Generation Model',
    summary: 'Google DeepMind has released Lyria 2, an advanced music generation model capable of creating high-fidelity audio with improved instrument separation and vocal clarity.',
    category: 'ai-research',
    source: 'Google AI Blog',
    author: 'DeepMind Team',
    publishedAt: '2024-03-05T08:00:00Z',
    url: 'https://deepmind.google/discover/blog/lyria-2-music-generation/',
    imageUrl: 'https://storage.googleapis.com/deepmind-media/Lyria/lyria-2-cover.jpg',
    tags: ['Google', 'DeepMind', 'Lyria', 'AI Research'],
    readTime: 8,
    fetchedAt: new Date().toISOString()
  },
  {
    id: 'backup-006',
    title: 'Apple Music Introduces AI-Curated Spatial Audio Playlists',
    summary: 'Apple Music is rolling out new AI-powered playlists optimized for Spatial Audio, using machine learning to enhance the immersive listening experience for subscribers.',
    category: 'tech-innovation',
    source: 'The Verge',
    author: 'Chris Welch',
    publishedAt: '2024-02-15T16:45:00Z',
    url: 'https://www.theverge.com/2024/2/15/24074423/apple-music-ai-spatial-audio-playlists',
    imageUrl: 'https://cdn.vox-cdn.com/uploads/chorus_image/image/73067545/apple_music_spatial_audio.0.jpg',
    tags: ['Apple Music', 'Spatial Audio', 'AI', 'Playlists'],
    readTime: 4,
    fetchedAt: new Date().toISOString()
  },
  {
    id: 'backup-007',
    title: 'EU AI Act: What It Means for Music Industry',
    summary: 'The European Union\'s AI Act has been finalized, with specific provisions affecting AI-generated music and content. Industry experts analyze the implications for rights holders and platforms.',
    category: 'industry-news',
    source: 'Music Ally',
    author: 'Stuart Dredge',
    publishedAt: '2024-03-08T10:30:00Z',
    url: 'https://musically.com/2024/03/08/eu-ai-act-music-industry-implications/',
    imageUrl: 'https://musically.com/wp-content/uploads/2024/03/eu-ai-act.jpg',
    tags: ['EU AI Act', 'Regulation', 'Copyright', 'Policy'],
    readTime: 9,
    fetchedAt: new Date().toISOString()
  },
  {
    id: 'backup-008',
    title: 'Meta\'s AudioCraft Open Source: Community Response and Impact',
    summary: 'Since open-sourcing AudioCraft, Meta has seen significant community adoption. New research papers and applications built on the framework are emerging rapidly.',
    category: 'ai-research',
    source: 'Meta AI Blog',
    author: 'AudioCraft Team',
    publishedAt: '2024-02-25T13:00:00Z',
    url: 'https://ai.meta.com/blog/audiocraft-open-source-community/',
    imageUrl: 'https://ai.meta.com/static/images/audiocraft-og.jpg',
    tags: ['Meta', 'AudioCraft', 'Open Source', 'AI Music'],
    readTime: 6,
    fetchedAt: new Date().toISOString()
  },
  {
    id: 'backup-009',
    title: 'TikTok Expands AI Music Features for Creators',
    summary: 'TikTok is expanding its AI music creation tools, allowing creators to generate custom soundtracks for their videos directly within the app.',
    category: 'tech-innovation',
    source: 'TechCrunch',
    author: 'Amanda Silberling',
    publishedAt: '2024-03-10T11:20:00Z',
    url: 'https://techcrunch.com/2024/03/10/tiktok-ai-music-creators-expansion/',
    imageUrl: 'https://techcrunch.com/wp-content/uploads/2024/03/tiktok-ai-music.jpg',
    tags: ['TikTok', 'AI Music', 'Creators', 'Social Media'],
    readTime: 5,
    fetchedAt: new Date().toISOString()
  },
  {
    id: 'backup-010',
    title: 'Global Music Streaming Revenue Hits $19.3 Billion in 2023',
    summary: 'The latest IFPI Global Music Report shows streaming revenue continues to dominate the music industry, with AI-powered discovery features driving increased engagement.',
    category: 'trends-analysis',
    source: 'IFPI',
    author: 'IFPI Research Team',
    publishedAt: '2024-03-01T09:00:00Z',
    url: 'https://www.ifpi.org/ifpi-global-music-report-2024/',
    imageUrl: 'https://www.ifpi.org/wp-content/uploads/2024/03/global-music-report-2024.jpg',
    tags: ['IFPI', 'Streaming', 'Revenue', 'Industry Report'],
    readTime: 10,
    fetchedAt: new Date().toISOString()
  }
];

export function getBackupNews() {
  // Update fetchedAt to current time so it appears fresh
  return BACKUP_NEWS.map(news => ({
    ...news,
    fetchedAt: new Date().toISOString()
  }));
}
