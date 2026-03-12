// Vercel Serverless Function for News API
// This provides the same API as the Express backend but runs as serverless functions

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Function to load data files dynamically (called on each request)
function loadData() {
  try {
    const newsPath = join(__dirname, '..', 'server', 'data', 'news.json');
    const metadataPath = join(__dirname, '..', 'server', 'data', 'metadata.json');
    
    const newsData = JSON.parse(readFileSync(newsPath, 'utf-8'));
    const metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));
    
    return { newsData, metadata };
  } catch (error) {
    console.error('Error loading data files:', error);
    // Use empty data as fallback
    return {
      newsData: [],
      metadata: { lastUpdated: new Date().toISOString(), totalArticles: 0 }
    };
  }
}

export default function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  const { method, query } = req;

  try {
    switch (method) {
      case 'GET':
        return handleGetNews(query, res);
      case 'POST':
        return handlePostNews(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

function handleGetNews(query, res) {
  // Load fresh data on each request
  const { newsData, metadata } = loadData();
  
  const { category, search, limit = 50, offset = 0, id } = query;

  // If ID is provided, return single article
  if (id) {
    const article = newsData.find(n => n.id === id);
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }
    return res.status(200).json({
      success: true,
      data: article
    });
  }

  let filteredNews = [...newsData];

  // Filter by category
  if (category && category !== 'all') {
    filteredNews = filteredNews.filter(article => article.category === category);
  }

  // Search in title and summary
  if (search) {
    const searchLower = search.toLowerCase();
    filteredNews = filteredNews.filter(article =>
      article.title.toLowerCase().includes(searchLower) ||
      article.summary.toLowerCase().includes(searchLower) ||
      (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    );
  }

  // Get total count before pagination
  const total = filteredNews.length;

  // Apply pagination
  const start = parseInt(offset) || 0;
  const end = start + (parseInt(limit) || 50);
  const paginatedNews = filteredNews.slice(start, end);

  return res.status(200).json({
    success: true,
    data: paginatedNews,
    pagination: {
      total,
      limit: parseInt(limit) || 50,
      offset: start,
      hasMore: end < total
    },
    meta: {
      lastUpdated: metadata.lastUpdated,
      totalArticles: metadata.totalArticles || newsData.length
    }
  });
}

function handlePostNews(req, res) {
  // Load fresh data
  const { newsData, metadata } = loadData();
  
  return res.status(200).json({
    success: true,
    message: 'News refresh triggered',
    data: {
      totalArticles: newsData.length,
      lastUpdated: metadata.lastUpdated
    }
  });
}
