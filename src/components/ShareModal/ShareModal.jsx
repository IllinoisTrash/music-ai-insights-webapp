import React, { useState } from 'react';
import { X, Link, Check, Twitter, Facebook, Linkedin } from 'lucide-react';
import './ShareModal.css';

const ShareModal = ({ isOpen, onClose, article }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !article) return null;

  const shareUrl = `${window.location.origin}/article/${article.id}`;
  const shareText = `${article.title} - Music AI Insights`;

  const shareOptions = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: '#1da1f2',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: '#4267B2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: '#0077b5',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    }
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: shareUrl
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <h3>分享文章</h3>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="share-modal-content">
          <div className="share-preview">
            <h4 className="share-preview-title">{article.title}</h4>
            <p className="share-preview-summary">
              {article.summary?.substring(0, 100)}...
            </p>
          </div>

          <div className="share-options">
            {shareOptions.map((option) => (
              <a
                key={option.name}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                className="share-option"
                style={{ '--share-color': option.color }}
              >
                <option.icon size={24} />
                <span>{option.name}</span>
              </a>
            ))}
          </div>

          <div className="share-divider">
            <span>或</span>
          </div>

          <div className="copy-link-section">
            <div className="copy-link-input-wrapper">
              <Link size={18} className="link-icon" />
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="copy-link-input"
              />
              <button
                className={`copy-button ${copied ? 'copied' : ''}`}
                onClick={handleCopyLink}
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    <span>已复制</span>
                  </>
                ) : (
                  <span>复制链接</span>
                )}
              </button>
            </div>
          </div>

          {navigator.share && (
            <button className="native-share-button" onClick={handleNativeShare}>
              使用系统分享
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
