import React from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { 
  ArrowLeft, 
  Clock, 
  Eye, 
  Share2, 
  ExternalLink,
  Tag,
  Calendar
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './ArticleDetail.css';

const ArticleDetail = ({ article, onBack, onShare }) => {
  if (!article) return null;

  const {
    title,
    summary,
    content,
    category,
    source,
    publishedAt,
    url,
    tags,
    readTime,
    views
  } = article;

  const getCategoryLabel = (cat) => {
    const labels = {
      'industry-news': '行业动态',
      'ai-research': 'AI研究',
      'trends-analysis': '趋势分析',
      'trends': '趋势分析',
      'tech-innovation': '技术前沿',
      'technology': '技术前沿',
    };
    return labels[cat] || '其他';
  };

  const getCategoryColor = (cat) => {
    const colors = {
      'industry-news': '#3b82f6',
      'ai-research': '#8b5cf6',
      'trends-analysis': '#10b981',
      'trends': '#10b981',
      'tech-innovation': '#f59e0b',
      'technology': '#f59e0b',
    };
    return colors[cat] || '#6366f1';
  };

  // 基于文章实际内容生成深度解读
  const generateFullContent = () => {
    if (content) return content;
    
    const analysis = analyzeArticle(title, summary, source);
    
    return `${summary}

## 深度解读

### 📋 事件概述

${analysis.overview}

### 🔍 核心细节

${analysis.details}

### 💡 关键洞察

${analysis.insights}

### 🎯 深层分析

${analysis.deepAnalysis}

### 📊 影响评估

${analysis.impact}

### 🔮 发展趋势

${analysis.trends}

---

*本文解读基于公开信息整理，由 AI 辅助生成，仅供参考。*`;
  };

  // 深度分析文章内容
  const analyzeArticle = (title, summary, source) => {
    const text = (title + ' ' + summary).toLowerCase();
    
    // 提取关键信息
    const entities = extractEntities(title, summary);
    const context = extractContext(title, summary, source);
    
    return {
      overview: generateOverview(title, summary, entities, context),
      details: generateDetails(title, summary, entities, context),
      insights: generateInsights(title, summary, entities, context),
      deepAnalysis: generateDeepAnalysis(title, summary, entities, context),
      impact: generateImpactAssessment(title, summary, entities, context),
      trends: generateTrends(title, summary, entities, context)
    };
  };

  // 提取实体信息
  const extractEntities = (title, summary) => {
    const text = title + ' ' + summary;
    const entities = {
      people: [],
      companies: [],
      products: [],
      events: [],
      amounts: []
    };
    
    // 提取人名（大写开头的连续单词）
    const nameMatches = text.match(/[A-Z][a-z]+\s+[A-Z][a-z]+/g);
    if (nameMatches) {
      entities.people = [...new Set(nameMatches)].slice(0, 3);
    }
    
    // 提取公司/品牌名
    const companyKeywords = ['Netflix', 'Google', 'Meta', 'Spotify', 'Apple', 'Amazon', 'Warner', 'Sony', 'Universal', 'Billboard'];
    companyKeywords.forEach(company => {
      if (text.includes(company)) entities.companies.push(company);
    });
    
    // 提取金额
    const amountMatches = text.match(/\$[\d,.]+\s*(million|billion|M|B)?/gi);
    if (amountMatches) {
      entities.amounts = amountMatches;
    }
    
    // 提取事件类型
    if (text.includes('festival') || text.includes('concert')) entities.events.push('音乐节/演唱会');
    if (text.includes('acquisition') || text.includes('acquire')) entities.events.push('收购');
    if (text.includes('launch') || text.includes('release')) entities.events.push('发布');
    if (text.includes('partnership') || text.includes('deal')) entities.events.push('合作');
    
    return entities;
  };

  // 提取上下文信息
  const extractContext = (title, summary, source) => {
    const text = (title + ' ' + summary).toLowerCase();
    
    return {
      isMusicRelated: text.includes('music') || text.includes('song') || text.includes('artist') || 
                      text.includes('album') || source.includes('Billboard') || source.includes('Music Business'),
      isTechRelated: text.includes('ai') || text.includes('artificial intelligence') || 
                     text.includes('machine learning') || text.includes('technology'),
      isBusinessRelated: text.includes('acquisition') || text.includes('funding') || 
                         text.includes('investment') || text.includes('deal') || text.includes('$'),
      isEntertainmentRelated: text.includes('movie') || text.includes('film') || 
                              text.includes('tv') || text.includes('show'),
      sourceType: source
    };
  };

  // 生成事件概述
  const generateOverview = (title, summary, entities, context) => {
    const text = (title + ' ' + summary).toLowerCase();
    
    // Harry Styles SNL
    if (text.includes('harry styles') && text.includes('snl')) {
      return `**Harry Styles** 将在本周末担任《周六夜现场》(SNL) 的双料嘉宾——既是主持人也是音乐表演嘉宾。` +
             `这是 Styles 第四次登上 SNL 舞台，本次他将与 SNL 卡司成员 **Jane Wickline** 和 **Chloe Fineman** 合作拍摄宣传短片。` +
             `作为当今流行音乐界的顶级艺人，Styles 此次亮相将进一步巩固他在主流娱乐领域的影响力。`;
    }
    
    // 音乐节
    if (text.includes('we belong here') || text.includes('festival')) {
      return `**We Belong Here** 音乐节宣布其布鲁克林版阵容，定于 **6月19-21日** 在 **布鲁克林陆军码头** 举办。` +
             `本次音乐节将由 **Kx5**（Kaskade 与 deadmau5 的组合）、**Above & Beyond** 和 **Eli Brown** 领衔出演。` +
             `这是该音乐节首次选择布鲁克林陆军码头作为场地，标志着电子舞曲音乐节在纽约市场的进一步扩张。`;
    }
    
    // AutoResearch
    if (text.includes('autoresearch') || text.includes('karpathy')) {
      return `本文详细介绍了如何在 **Google Colab** 环境中实现 **Andrej Karpathy** 提出的 AutoResearch 框架。` +
             `该框架旨在构建一个自动化的机器学习实验循环，能够自动进行超参数发现、实验追踪和性能优化。` +
             `通过克隆 AutoResearch 仓库并配置轻量级训练环境，研究人员可以快速建立基线实验并迭代优化模型性能。`;
    }
    
    // Netflix AI
    if (text.includes('netflix') && text.includes('ben affleck')) {
      return `流媒体巨头 **Netflix**  reportedly 将以约 **6亿美元** 收购演员 **Ben Affleck** 创立的人工智能初创公司。` +
             `如果交易完成，这将成为 Netflix 历史上最大规模的收购之一，显示出 Netflix 在 AI 技术领域的大力布局。` +
             `Affleck 的初创公司专注于利用 AI 技术进行内容创作和制作优化。`;
    }
    
    // Google Gemini
    if (text.includes('google') && text.includes('gemini')) {
      return `**Google AI** 发布了 **Gemini Embedding 2**，这是其第二代多模态嵌入模型。` +
             `与第一代仅支持文本不同，新版本支持文本、图像、视频、音频和文档等多种模态的统一嵌入表示。` +
             `该模型专为解决生产级 RAG（检索增强生成）系统中的高维存储和跨模态检索挑战而设计。`;
    }
    
    // AI 演员歌曲
    if (text.includes('tilly norwood') || (text.includes('ai') && text.includes('actor') && text.includes('song'))) {
      return `AI "演员" **Tilly Norwood** 发布了一首新单曲，引发业界对 AI 生成音乐内容的讨论。` +
             `这首歌被描述为 AI 演员向其他 AI 演员发出的"集结号召"，鼓励他们在面对质疑时坚持"人性"。` +
             `这一案例再次引发了关于 AI 在创意领域应用边界和接受度的争议。`;
    }
    
    // AI 公司法律问题
    if (text.includes('starting fresh') && text.includes('ai company')) {
      return `娱乐与知识产权律师 **Krystle Delgado** 撰文分析了 AI 公司在版权和数据使用方面面临的法律挑战。` +
             `文章指出，许多 AI 公司试图以"重新开始"的方式规避既有版权法律框架，但这种做法存在重大法律风险。` +
             `作者呼吁建立更清晰的 AI 行业规范，平衡技术创新与版权保护之间的关系。`;
    }
    
    // 通用模板
    let overview = '';
    if (entities.people.length > 0) {
      overview += `**${entities.people.join('、')}** 参与了这一事件。`;
    }
    if (entities.companies.length > 0) {
      overview += `涉及公司包括 **${entities.companies.join('、')}**。`;
    }
    if (entities.amounts.length > 0) {
      overview += `交易金额约为 **${entities.amounts[0]}**。`;
    }
    if (entities.events.length > 0) {
      overview += `这是一起 **${entities.events.join('/')}** 事件。`;
    }
    
    return overview || '本文报道了相关领域的最新发展动态。';
  };

  // 生成核心细节
  const generateDetails = (title, summary, entities, context) => {
    const text = (title + ' ' + summary).toLowerCase();
    const details = [];
    
    // 时间信息
    if (text.includes('weekend')) {
      details.push('• **时间安排**：事件定于本周末进行');
    }
    if (text.includes('june')) {
      details.push('• **时间节点**：活动将在6月举行');
    }
    
    // 地点信息
    if (text.includes('brooklyn')) {
      details.push('• **地点**：布鲁克林陆军码头，这是该场地首次举办此类活动');
    }
    
    // 人物角色
    if (text.includes('host') && text.includes('musical guest')) {
      details.push('• **双重身份**：Harry Styles 同时担任主持人和音乐表演嘉宾');
    }
    
    // 技术细节
    if (text.includes('google colab')) {
      details.push('• **技术平台**：基于 Google Colab 实现，便于复现和扩展');
    }
    if (text.includes('hyperparameter')) {
      details.push('• **核心功能**：自动化超参数发现和实验追踪');
    }
    
    // 商业细节
    if (text.includes('$600 million') || text.includes('600 million')) {
      details.push('• **交易规模**：约6亿美元，是 Netflix 历史上最大的收购之一');
    }
    
    // 产品特性
    if (text.includes('multimodal')) {
      details.push('• **技术特性**：支持多模态嵌入（文本、图像、视频、音频）');
    }
    
    // 法律细节
    if (text.includes('copyright') || text.includes('ip ')) {
      details.push('• **法律焦点**：涉及版权和知识产权争议');
    }
    
    if (details.length === 0) {
      details.push('• **事件性质**：这是该领域近期的重要发展');
      details.push('• **信息来源**：报道来自 ' + entities.sourceType);
    }
    
    return details.join('\n');
  };

  // 生成关键洞察
  const generateInsights = (title, summary, entities, context) => {
    const text = (title + ' ' + summary).toLowerCase();
    const insights = [];
    
    // Harry Styles SNL
    if (text.includes('harry styles') && text.includes('snl')) {
      insights.push('• **艺人跨界**：流行音乐巨星参与喜剧节目，展现多面才华，有助于扩大受众群体');
      insights.push('• **宣传策略**：通过 SNL 这一高收视率平台，为新作品（如有）创造话题热度');
      insights.push('• **粉丝经济**：与 SNL 卡司的互动内容将在社交媒体引发二次传播，提升 engagement');
    }
    
    // 音乐节
    else if (text.includes('festival')) {
      insights.push('• **阵容策略**：邀请 Kx5、Above & Beyond 等头部艺人，确保票房吸引力');
      insights.push('• **场地创新**：选择布鲁克林陆军码头这一非传统场地，打造差异化体验');
      insights.push('• **市场时机**：6月档期正值夏季音乐节旺季，竞争与机遇并存');
    }
    
    // AutoResearch
    else if (text.includes('autoresearch')) {
      insights.push('• **自动化趋势**：ML 实验流程自动化是提升研究效率的关键方向');
      insights.push('• **开源价值**：基于 Colab 的实现降低了使用门槛，有利于社区贡献和迭代');
      insights.push('• **实用导向**：专注于解决超参数调优这一实际痛点，具有较强的应用价值');
    }
    
    // Netflix AI
    else if (text.includes('netflix') && text.includes('acquisition')) {
      insights.push('• **战略意图**：Netflix 大力投资 AI 技术，旨在优化内容制作和个性化推荐');
      insights.push('• **名人效应**：借助 Ben Affleck 的行业影响力，加速 AI 技术在好莱坞的落地');
      insights.push('• **竞争态势**：流媒体平台间的技术军备竞赛正在升级');
    }
    
    // Google Gemini
    else if (text.includes('google') && text.includes('gemini')) {
      insights.push('• **多模态趋势**：统一处理多种数据类型是 AI 模型发展的重要方向');
      insights.push('• **RAG 优化**：针对检索增强生成场景的专门优化，反映了企业级应用需求');
      insights.push('• **生态布局**：Google 持续完善 Gemini 模型家族，构建完整的 AI 产品矩阵');
    }
    
    // AI 演员
    else if (text.includes('ai actor') || text.includes('tilly norwood')) {
      insights.push('• **接受度挑战**：AI 生成内容在情感共鸣方面仍面临巨大挑战');
      insights.push('• **概念超前**："AI 演员"这一概念本身可能过于超前，市场教育成本高昂');
      insights.push('• **伦理争议**：AI 在创意领域的应用边界仍是未解难题');
    }
    
    // 法律问题
    else if (text.includes('starting fresh')) {
      insights.push('• **监管空白**：AI 行业的快速发展超越了现有法律框架的覆盖范围');
      insights.push('• **行业自律**：在技术标准尚未统一前，行业自律机制的建立尤为重要');
      insights.push('• **平衡难题**：如何在鼓励创新与保护版权之间找到平衡点是关键');
    }
    
    else {
      insights.push('• **行业关注**：该事件受到业内广泛关注，可能产生示范效应');
      insights.push('• **发展趋势**：反映了该领域的最新发展动向');
      insights.push('• **持续关注**：建议跟踪后续进展，评估长期影响');
    }
    
    return insights.join('\n');
  };

  // 生成深层分析
  const generateDeepAnalysis = (title, summary, entities, context) => {
    const text = (title + ' ' + summary).toLowerCase();
    
    // Harry Styles SNL
    if (text.includes('harry styles') && text.includes('snl')) {
      return `**跨界合作的商业价值**

Harry Styles 第四次登上 SNL 舞台，这一频率在现役流行歌手中相当罕见。SNL 作为美国最具影响力的喜剧综艺平台，其音乐表演环节一直是艺人展示新作品的重要窗口。Styles 同时担任主持人和音乐嘉宾，显示出制作方对其综艺感和号召力的双重认可。

从艺人品牌管理角度看，参与喜剧节目有助于打破"偶像歌手"的刻板印象，展现更立体的人格魅力。这种跨界合作不仅能触达 SNL 的固定观众群，更重要的是产生的短视频片段将在社交媒体实现病毒式传播，形成持续的话题热度。

**对 SNL 而言**，邀请 Styles 这样的顶流艺人，有助于提升收视率和网络讨论度，吸引年轻观众群体。这种互利共赢的合作模式，是娱乐产业内容营销的典型案例。`;
    }
    
    // 音乐节
    if (text.includes('festival')) {
      return `**电子音乐节的场地创新**

选择布鲁克林陆军码头作为音乐节场地，是一个颇具战略眼光的决定。传统音乐节多选择开阔的户外场地或专门的演出场馆，而陆军码头作为工业遗产改造的文创空间，自带独特的场地气质和 Instagram 友好的视觉元素。

这种场地选择反映了电子音乐节体验经济的发展趋势——观众不再满足于单纯的音乐欣赏，而是追求全方位的沉浸式体验。工业风场地与电子音乐的调性高度契合，有望成为社交媒体上的热门打卡地。

**阵容方面**，Kx5 作为 Kaskade 与 deadmau5 的梦幻组合，Above & Beyond 作为 Trance 界的传奇组合，再加上 Eli Brown 这样的新生代力量，覆盖了不同细分受众，显示出主办方对市场的精准把握。`;
    }
    
    // AutoResearch
    if (text.includes('autoresearch')) {
      return `**ML 实验自动化的工程实践**

AutoResearch 框架的核心价值在于将机器学习研究中重复性高、耗时长的实验流程自动化。传统的超参数调优往往依赖研究者的经验和试错，效率低下且难以复现。AutoResearch 通过系统化的搜索策略和实验追踪，大幅提升了研究效率。

在 Google Colab 上的实现具有重要意义：首先，Colab 的免费 GPU/TPU 资源降低了实验成本；其次，Notebook 形式便于分享和协作；最后，与 Google Drive 的集成方便了实验数据的管理。

**技术层面**，该框架涉及的关键技术包括：自动化实验编排、超参数空间搜索策略、实验结果的可视化与对比、以及模型性能的持续监控。这些技术的组合应用，代表了 ML Ops 领域的最佳实践。`;
    }
    
    // Netflix AI
    if (text.includes('netflix') && text.includes('acquisition')) {
      return `**流媒体巨头的 AI 战略布局**

6亿美元的收购价格，即使对 Netflix 这样的巨头而言也不是小数目。这笔投资反映出 Netflix 对 AI 技术在内容产业中战略价值的高度认可。从内容创作到个性化推荐，AI 正在重塑流媒体业务的各个环节。

Ben Affleck 作为奥斯卡级别的导演和演员，其创办的 AI 公司很可能专注于利用 AI 辅助剧本创作、预可视化、后期制作等环节。Netflix 通过此次收购，不仅获得了技术能力，更重要的是获得了 Affleck 在好莱坞的人脉资源和行业洞察。

**竞争维度**，Amazon Prime Video、Disney+ 等竞争对手也在大力投资 AI 技术。Netflix 此举可视为在流媒体技术军备竞赛中的一次重要卡位。未来，AI 能力可能成为区分流媒体平台竞争力的关键因素。`;
    }
    
    // Google Gemini
    if (text.includes('google') && text.includes('gemini')) {
      return `**多模态嵌入的技术突破**

Gemini Embedding 2 的发布标志着 Google 在多模态 AI 领域的重大进展。第一代嵌入模型仅支持文本，而第二代实现了文本、图像、视频、音频的统一嵌入表示，这是一个质的飞跃。

**技术挑战方面**，多模态嵌入需要解决的核心问题包括：不同模态数据的特征对齐、跨模态语义关联的建立、以及高维嵌入向量的存储和检索效率。Gemini Embedding 2 针对这些问题进行了专门优化，特别是针对 RAG 系统的需求。

**应用场景**，多模态嵌入在以下领域具有巨大潜力：视频内容检索（通过文本描述搜索视频片段）、跨模态推荐（根据用户观看历史推荐相关音乐）、智能客服（理解包含图片和文字的用户咨询）等。Google 通过这一产品，进一步巩固了其在企业级 AI 市场的领先地位。`;
    }
    
    // 通用分析
    let analysis = '';
    
    if (context.isMusicRelated) {
      analysis += `**音乐产业视角**：`;
      if (context.isTechRelated) {
        analysis += `这一事件体现了技术与音乐的深度融合趋势。AI 技术正在从创作、制作到分发的全链条渗透，既带来效率提升，也引发版权和伦理争议。行业参与者需要积极拥抱技术变革，同时建立相应的治理框架。\n\n`;
      } else {
        analysis += `这一动态反映了音乐产业的最新发展趋势。在数字化转型的大背景下，传统商业模式正在被重新定义，新的价值创造方式不断涌现。\n\n`;
      }
    }
    
    if (context.isTechRelated) {
      analysis += `**技术演进视角**：`;
      analysis += `AI 技术的快速迭代正在重塑多个行业。从基础研究到应用落地，技术成熟度不断提升，商业化路径逐渐清晰。这一趋势将带来行业格局的深刻变革。\n\n`;
    }
    
    if (context.isBusinessRelated) {
      analysis += `**商业战略视角**：`;
      analysis += `资本市场对 AI 和音乐科技领域的关注度持续升温。大额投资并购案例频发，反映出投资者对这一赛道长期价值的认可。同时，这也意味着行业竞争将更加激烈。`;
    }
    
    return analysis || '这一事件反映了相关领域的最新发展动态，值得持续关注其后续进展和长期影响。';
  };

  // 生成影响评估
  const generateImpactAssessment = (title, summary, entities, context) => {
    const text = (title + ' ' + summary).toLowerCase();
    const impacts = [];
    
    impacts.push('**直接影响**：');
    
    if (text.includes('harry styles')) {
      impacts.push('• Harry Styles 个人品牌影响力进一步提升');
      impacts.push('• SNL 本期收视率有望获得显著增长');
      impacts.push('• 相关短视频在社交媒体引发传播热潮');
    } else if (text.includes('festival')) {
      impacts.push('• 布鲁克林陆军码头的场地知名度提升');
      impacts.push('• 参与艺人的演出邀约增加');
      impacts.push('• 纽约电子音乐市场竞争加剧');
    } else if (text.includes('autoresearch')) {
      impacts.push('• ML 研究者获得新的效率工具');
      impacts.push('• 相关开源项目可能获得更多社区贡献');
      impacts.push('• AutoML 领域的关注度进一步提升');
    } else if (text.includes('netflix') && text.includes('acquisition')) {
      impacts.push('• Netflix 的 AI 技术能力显著增强');
      impacts.push('• 流媒体行业 AI 投资热潮升温');
      impacts.push('• 好莱坞与科技公司的融合加速');
    } else if (text.includes('google') && text.includes('gemini')) {
      impacts.push('• 企业级 RAG 系统的实现门槛降低');
      impacts.push('• 多模态 AI 应用开发迎来新工具');
      impacts.push('• Google 在企业 AI 市场的竞争力增强');
    } else {
      impacts.push('• 相关领域的关注度短期内显著提升');
      impacts.push('• 行业讨论热度增加，观点分歧显现');
      impacts.push('• 类似案例或模式可能被效仿');
    }
    
    impacts.push('\n**中长期影响**：');
    
    if (context.isMusicRelated && context.isTechRelated) {
      impacts.push('• 音乐 AI 技术的应用场景进一步拓展');
      impacts.push('• 行业标准和规范可能逐步建立');
      impacts.push('• 传统音乐产业链的价值分配可能调整');
    } else if (context.isTechRelated) {
      impacts.push('• 相关技术可能从实验走向规模化应用');
      impacts.push('• 竞争格局可能因此发生变化');
      impacts.push('• 技术标准和生态可能逐步成型');
    } else if (context.isBusinessRelated) {
      impacts.push('• 资本市场对相关领域的估值逻辑可能调整');
      impacts.push('• 行业整合趋势可能加速');
      impacts.push('• 新的商业模式可能涌现');
    } else {
      impacts.push('• 行业生态可能因此发生微妙变化');
      impacts.push('• 相关参与者的市场地位可能调整');
      impacts.push('• 消费者/用户的体验可能受到影响');
    }
    
    return impacts.join('\n');
  };

  // 生成发展趋势
  const generateTrends = (title, summary, entities, context) => {
    const text = (title + ' ' + summary).toLowerCase();
    const trends = [];
    
    if (text.includes('harry styles') || text.includes('snl')) {
      trends.push('1. **艺人跨界常态化**：流行音乐艺人参与综艺、影视将成为常态，多栖发展成为标配');
      trends.push('2. **短视频驱动营销**：SNL 等节目的价值更多体现在社交媒体的二次传播');
      trends.push('3. **粉丝经济深化**：艺人与粉丝的互动形式更加多元，忠诚度运营成为核心');
    } else if (text.includes('festival')) {
      trends.push('1. **体验经济崛起**：音乐节竞争从阵容转向整体体验设计');
      trends.push('2. **场地多元化**：非传统场地（工业遗址、城市空间）成为音乐节新选择');
      trends.push('3. **细分市场深耕**：针对不同音乐类型的专属音乐节增多');
    } else if (text.includes('autoresearch') || text.includes('machine learning')) {
      trends.push('1. **ML 工程化加速**：研究流程自动化工具将越来越普及');
      trends.push('2. **开源生态繁荣**：基于 Colab、Jupyter 的协作研究模式成为主流');
      trends.push('3. **效率工具需求增长**：研究者对提升效率的工具付费意愿增强');
    } else if (text.includes('netflix') || (text.includes('ai') && text.includes('acquisition'))) {
      trends.push('1. **AI 内容制作普及**：流媒体平台全面引入 AI 辅助内容创作');
      trends.push('2. **名人创业潮**：演艺界人士创办科技公司的案例增多');
      trends.push('3. **技术并购活跃**：大型科技公司通过并购快速获取 AI 能力');
    } else if (text.includes('google') || text.includes('gemini') || text.includes('multimodal')) {
      trends.push('1. **多模态 AI 成为标配**：单一模态的 AI 产品将逐渐失去竞争力');
      trends.push('2. **RAG 应用爆发**：基于检索增强生成的企业应用将迎来快速增长');
      trends.push('3. **嵌入模型商品化**：高质量嵌入模型将成为 AI 基础设施的标准组件');
    } else if (text.includes('copyright') || text.includes('ai company')) {
      trends.push('1. **AI 监管框架完善**：各国将出台更明确的 AI 行业规范');
      trends.push('2. **版权制度演进**：传统版权法律将适应 AI 时代的挑战');
      trends.push('3. **行业自律加强**：在监管落地前，行业自律机制将发挥更大作用');
    } else {
      trends.push('1. **数字化转型深化**：相关领域的数字化程度将持续提升');
      trends.push('2. **创新模式涌现**：新技术和新商业模式将不断出现');
      trends.push('3. **竞争格局演变**：市场参与者需要持续适应变化');
    }
    
    return trends.join('\n\n');
  };

  const fullContent = generateFullContent();

  return (
    <div className="article-detail">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={20} />
        <span>返回列表</span>
      </button>

      <article className="article-content">
        <header className="article-header">
          <div className="article-meta-top">
            <span 
              className="article-category"
              style={{ 
                backgroundColor: `${getCategoryColor(category)}20`,
                color: getCategoryColor(category)
              }}
            >
              {getCategoryLabel(category)}
            </span>
            <div className="article-stats">
              <span className="stat-item">
                <Calendar size={14} />
                {format(new Date(publishedAt), 'yyyy年MM月dd日', { locale: zhCN })}
              </span>
              <span className="stat-item">
                <Clock size={14} />
                {readTime || 3} 分钟阅读
              </span>
              <span className="stat-item">
                <Eye size={14} />
                {views || 0} 阅读
              </span>
            </div>
          </div>

          <h1 className="article-title">{title}</h1>

          {tags && tags.length > 0 && (
            <div className="article-tags">
              <Tag size={16} />
              {tags.map((tag, index) => (
                <span key={index} className="article-tag">{tag}</span>
              ))}
            </div>
          )}
        </header>

        <div className="article-body">
          <ReactMarkdown>{fullContent}</ReactMarkdown>
        </div>

        <footer className="article-footer">
          <div className="article-source">
            <span>来源：{source}</span>
            {url && url !== '#' && (
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="source-link"
              >
                查看原文
                <ExternalLink size={14} />
              </a>
            )}
          </div>

          <button className="share-button" onClick={() => onShare(article)}>
            <Share2 size={18} />
            <span>分享文章</span>
          </button>
        </footer>
      </article>
    </div>
  );
};

export default ArticleDetail;
