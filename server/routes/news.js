import { Router } from 'express';
import { getStoredNews, getMetadata } from '../services/storage.js';

const router = Router();

// GET /api/news - Get all news with optional filtering
router.get('/', (req, res) => {
  try {
    const { category, search, limit = 50, offset = 0 } = req.query;
    let news = getStoredNews();
    
    // Filter by category
    if (category && category !== 'all') {
      news = news.filter(article => article.category === category);
    }
    
    // Search in title and summary
    if (search) {
      const searchLower = search.toLowerCase();
      news = news.filter(article => 
        article.title.toLowerCase().includes(searchLower) ||
        article.summary.toLowerCase().includes(searchLower) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Get total count before pagination
    const total = news.length;
    
    // Apply pagination
    const start = parseInt(offset);
    const end = start + parseInt(limit);
    news = news.slice(start, end);
    
    res.json({
      success: true,
      data: news,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: start,
        hasMore: end < total
      }
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch news'
    });
  }
});

// GET /api/news/categories - Get category counts
router.get('/categories', (req, res) => {
  try {
    const news = getStoredNews();
    const categories = news.reduce((acc, article) => {
      acc[article.category] = (acc[article.category] || 0) + 1;
      return acc;
    }, {});
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

// GET /api/news/metadata - Get metadata about stored news
router.get('/metadata', (req, res) => {
  try {
    const metadata = getMetadata();
    res.json({
      success: true,
      data: metadata
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch metadata'
    });
  }
});

// GET /api/news/:id - Get single article by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const news = getStoredNews();
    const article = news.find(n => n.id === id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }
    
    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch article'
    });
  }
});

export default router;
