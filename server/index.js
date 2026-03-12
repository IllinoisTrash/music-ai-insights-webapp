import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import newsRoutes from './routes/news.js';
import { fetchAndStoreNews } from './services/newsFetcher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',') 
  : ['http://localhost:5173', 'https://musicainsight.netlify.app'];

app.use(cors({
  origin: corsOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/news', newsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Manual trigger for news fetch (protected, for admin use)
app.post('/api/admin/fetch-news', async (req, res) => {
  try {
    const result = await fetchAndStoreNews();
    res.json({ 
      success: true, 
      message: 'News fetch triggered successfully',
      data: result 
    });
  } catch (error) {
    console.error('Manual fetch error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Schedule daily news fetch
const schedule = process.env.UPDATE_SCHEDULE || '0 8 * * *';
console.log(`📅 Scheduling daily news fetch with cron: ${schedule}`);

cron.schedule(schedule, async () => {
  console.log('⏰ Running scheduled news fetch at:', new Date().toISOString());
  try {
    await fetchAndStoreNews();
    console.log('✅ Scheduled news fetch completed');
  } catch (error) {
    console.error('❌ Scheduled news fetch failed:', error);
  }
}, {
  scheduled: true,
  timezone: 'Asia/Shanghai'
});

// Initial fetch on startup (if no data exists)
import { getStoredNews } from './services/storage.js';
const existingNews = getStoredNews();
if (existingNews.length === 0) {
  console.log('🚀 No existing news found, fetching initial data...');
  fetchAndStoreNews().catch(err => 
    console.error('Initial fetch failed:', err)
  );
}

app.listen(PORT, () => {
  console.log(`🎵 Music AI Insights Server running on port ${PORT}`);
  console.log(`📰 Daily updates scheduled for: ${schedule}`);
  console.log(`🌐 CORS origins: ${corsOrigins.join(', ')}`);
});

export default app;
