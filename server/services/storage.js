import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = join(__dirname, '..', 'data');
const NEWS_FILE = join(DATA_DIR, 'news.json');
const METADATA_FILE = join(DATA_DIR, 'metadata.json');

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

// Default empty news structure
const defaultNews = [];

const defaultMetadata = {
  lastUpdated: null,
  totalArticles: 0,
  categories: {},
  sources: []
};

export function getStoredNews() {
  try {
    if (!existsSync(NEWS_FILE)) {
      return defaultNews;
    }
    const data = readFileSync(NEWS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading news file:', error);
    return defaultNews;
  }
}

export function storeNews(articles) {
  try {
    writeFileSync(NEWS_FILE, JSON.stringify(articles, null, 2));
    
    // Update metadata
    const metadata = {
      lastUpdated: new Date().toISOString(),
      totalArticles: articles.length,
      categories: articles.reduce((acc, article) => {
        acc[article.category] = (acc[article.category] || 0) + 1;
        return acc;
      }, {}),
      sources: [...new Set(articles.map(a => a.source))]
    };
    
    writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));
    
    return metadata;
  } catch (error) {
    console.error('Error storing news:', error);
    throw error;
  }
}

export function getMetadata() {
  try {
    if (!existsSync(METADATA_FILE)) {
      return defaultMetadata;
    }
    const data = readFileSync(METADATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading metadata:', error);
    return defaultMetadata;
  }
}

export function addArticle(article) {
  const news = getStoredNews();
  
  // Check for duplicates
  const exists = news.some(n => n.url === article.url);
  if (exists) {
    return null;
  }
  
  news.unshift(article);
  storeNews(news);
  return article;
}

export function clearOldNews(daysToKeep = 7) {
  const news = getStoredNews();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  
  const filtered = news.filter(article => 
    new Date(article.publishedAt) >= cutoffDate
  );
  
  storeNews(filtered);
  return {
    removed: news.length - filtered.length,
    remaining: filtered.length
  };
}
