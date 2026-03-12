// Vercel Serverless Function for Categories API

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Function to load data dynamically (called on each request)
function loadNewsData() {
  try {
    const newsPath = join(__dirname, '..', 'server', 'data', 'news.json');
    return JSON.parse(readFileSync(newsPath, 'utf-8'));
  } catch (error) {
    console.error('Error loading news data:', error);
    return [];
  }
}

export default function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Load fresh data on each request
    const newsData = loadNewsData();
    
    const categories = newsData.reduce((acc, article) => {
      acc[article.category] = (acc[article.category] || 0) + 1;
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Categories API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
