import React from 'react';
import { Newspaper, Calendar } from 'lucide-react';
import './Navigation.css';

const Navigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'digest', label: '今日洞察', icon: Newspaper },
    { id: 'daily', label: '每日推送', icon: Calendar },
    // AI 对话功能已暂时禁用
    // { id: 'chat', label: 'AI对话', icon: MessageSquare },
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
