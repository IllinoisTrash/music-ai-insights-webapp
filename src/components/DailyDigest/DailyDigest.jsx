import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Calendar, Mail, Bell, Check } from 'lucide-react';
import './DailyDigest.css';

const DailyDigest = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState({
    industryNews: true,
    aiResearch: true,
    trends: true,
    technology: false
  });

  const today = new Date();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      // Here you would typically send the subscription to your backend
    }
  };

  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const sampleDigest = {
    date: today,
    highlights: [
      {
        title: 'AI音乐生成技术突破',
        summary: '最新的深度学习模型在音乐创作领域取得重大进展，能够生成高质量的原创作曲。',
        category: 'ai-research'
      },
      {
        title: '流媒体平台新功能发布',
        summary: '主流音乐流媒体平台推出AI驱动的个性化推荐系统，提升用户体验。',
        category: 'industry-news'
      },
      {
        title: '虚拟演唱会市场增长趋势',
        summary: '2024年虚拟演唱会市场规模预计增长35%，成为音乐产业新增长点。',
        category: 'trends'
      }
    ]
  };

  return (
    <div className="daily-digest">
      <div className="digest-header">
        <div className="digest-date">
          <Calendar size={24} />
          <div>
            <h2>每日推送</h2>
            <p>{format(today, 'yyyy年MM月dd日 EEEE', { locale: zhCN })}</p>
          </div>
        </div>
      </div>

      <div className="digest-content">
        <div className="digest-preview">
          <h3>今日精选</h3>
          <div className="highlights-list">
            {sampleDigest.highlights.map((item, index) => (
              <div key={index} className="highlight-item">
                <span className={`highlight-badge ${item.category}`}>
                  {item.category === 'ai-research' && 'AI研究'}
                  {item.category === 'industry-news' && '行业动态'}
                  {item.category === 'trends' && '趋势分析'}
                </span>
                <h4>{item.title}</h4>
                <p>{item.summary}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="subscription-section">
          <div className="subscription-card">
            <div className="subscription-header">
              <Bell size={24} />
              <h3>订阅每日推送</h3>
            </div>
            <p className="subscription-desc">
              获取最新的音乐行业动态和AI技术洞察，每天直接发送到您的邮箱。
            </p>

            {isSubscribed ? (
              <div className="subscription-success">
                <div className="success-icon">
                  <Check size={32} />
                </div>
                <h4>订阅成功！</h4>
                <p>您将每天收到精选的音乐与AI洞察。</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="subscription-form">
                <div className="email-input-wrapper">
                  <Mail size={18} />
                  <input
                    type="email"
                    placeholder="输入您的邮箱地址"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="preferences-section">
                  <p className="preferences-title">选择您感兴趣的内容：</p>
                  <div className="preferences-grid">
                    {Object.entries({
                      industryNews: '行业动态',
                      aiResearch: 'AI研究',
                      trends: '趋势分析',
                      technology: '技术前沿'
                    }).map(([key, label]) => (
                      <label key={key} className="preference-item">
                        <input
                          type="checkbox"
                          checked={preferences[key]}
                          onChange={() => togglePreference(key)}
                        />
                        <span className="checkmark"></span>
                        <span className="preference-label">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" className="subscribe-button">
                  立即订阅
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyDigest;
