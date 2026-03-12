export default {
  app: {
    name: "Music AI Insights",
    description: "每日音乐行业及AI相关的洞察",
    version: "1.0.0",
    theme: {
      primaryColor: "#6366f1",
      secondaryColor: "#8b5cf6",
      darkMode: true
    },
    language: "zh-CN"
  },
  
  ai: {
    // Configure your AI service here
    provider: "openai", // or "anthropic", "custom"
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 2000,
    // API configuration (use environment variables in production)
    apiKey: import.meta.env.VITE_AI_API_KEY || "",
    apiUrl: import.meta.env.VITE_AI_API_URL || "https://api.openai.com/v1/chat/completions"
  },
  
  content: {
    sources: ["rss", "api", "manual"],
    categories: [
      { id: "industry-news", label: "行业动态", color: "#3b82f6" },
      { id: "ai-research", label: "AI研究", color: "#8b5cf6" },
      { id: "trends", label: "趋势分析", color: "#10b981" },
      { id: "technology", label: "技术前沿", color: "#f59e0b" }
    ],
    updateFrequency: "daily",
    maxInsightsPerDay: 10
  },
  
  features: {
    chat: false,  // AI 对话功能已暂时禁用
    dailyDigest: true,
    emailSubscription: true,
    search: true,
    sharing: true
  },
  
  rss: {
    // Add your RSS feed URLs here
    feeds: [
      // "https://example.com/music-ai-feed.xml",
      // "https://example.com/industry-news.xml"
    ]
  },
  
  api: {
    // Add your API endpoints here
    endpoints: {
      insights: "/api/insights",
      subscribe: "/api/subscribe",
      chat: "/api/chat"
    }
  }
};
