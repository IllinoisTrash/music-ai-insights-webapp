import { getSystemPrompt } from '../prompts/systemPrompts';

// 配置
const API_KEY = import.meta.env.VITE_AI_API_KEY;
const API_URL = import.meta.env.VITE_AI_API_URL || 'https://api.openai.com/v1/chat/completions';
const USE_MOCK = !API_KEY || API_KEY === 'your_api_key_here';

// Mock AI service - 用于演示，当没有配置 API 密钥时使用
const MOCK_RESPONSES = {
  default: `您好！我是您的音乐与AI洞察助手。

目前系统正在使用**演示模式**，要启用真实的 AI 对话功能，请：

1. 在 ".env" 文件中设置您的 API 密钥
2. 重启开发服务器
3. 刷新页面

我可以帮您：
- 分析最新的音乐行业趋势
- 解读AI技术在音乐领域的应用
- 推荐相关的研究报告和文章
- 回答关于音乐科技的问题

有什么我可以帮您的吗？`,
  music: `音乐行业正在经历AI技术的深刻变革。以下是一些关键趋势：

1. **AI音乐生成**：工具如Suno、Udio等能够根据文本提示生成完整歌曲
2. **个性化推荐**：流媒体平台使用深度学习提供更精准的音乐推荐
3. **虚拟艺人**：AI生成的虚拟歌手和乐队越来越受欢迎
4. **版权与伦理**：AI生成内容的版权归属成为热议话题

您对哪个方面特别感兴趣？`,
  ai: `AI技术在音乐领域的应用正在快速发展：

**当前应用：**
- 音频分离和母带处理
- 智能作曲和编曲辅助
- 语音识别和歌词生成
- 情感分析和音乐分类

**未来趋势：**
- 实时协作创作
- 跨风格音乐融合
- 个性化音乐治疗
- 沉浸式音频体验`
};

export const sendMessageToAI = async (message, history = []) => {
  // 如果没有配置 API 密钥，使用模拟响应
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('音乐') || lowerMessage.includes('行业')) {
      return MOCK_RESPONSES.music;
    } else if (lowerMessage.includes('ai') || lowerMessage.includes('人工智能')) {
      return MOCK_RESPONSES.ai;
    }
    return MOCK_RESPONSES.default;
  }

  // 真实的 API 调用
  try {
    const systemPrompt = getSystemPrompt('music_ai_insights');
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          ...history.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `AI service error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI Service Error:', error);
    return `抱歉，AI 服务出现错误：${error.message}\n\n请检查：\n1. API 密钥是否正确配置\n2. 网络连接是否正常\n3. API 服务是否可用`;
  }
};

export const generateDailyInsights = async () => {
  // This would fetch and generate daily insights
  // For now, return mock data
  return [
    {
      title: 'AI音乐生成技术突破',
      summary: '最新的深度学习模型在音乐创作领域取得重大进展，能够生成高质量的原创作曲。',
      category: 'ai-research',
      source: 'AI Research Daily',
      publishedAt: new Date().toISOString(),
      url: '#',
      tags: ['AI', '音乐生成', '深度学习']
    },
    {
      title: '流媒体平台新功能发布',
      summary: '主流音乐流媒体平台推出AI驱动的个性化推荐系统，提升用户体验。',
      category: 'industry-news',
      source: 'Music Industry News',
      publishedAt: new Date().toISOString(),
      url: '#',
      tags: ['流媒体', '推荐系统', '用户体验']
    },
    {
      title: '虚拟演唱会市场增长趋势',
      summary: '2024年虚拟演唱会市场规模预计增长35%，成为音乐产业新增长点。',
      category: 'trends',
      source: 'Market Analysis',
      publishedAt: new Date().toISOString(),
      url: '#',
      tags: ['虚拟演唱会', '市场趋势', '增长']
    }
  ];
};
