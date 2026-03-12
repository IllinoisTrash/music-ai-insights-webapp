# Music AI Insights - Backend Service

Backend API service for Music AI Insights web application.

## Features

- **Daily RSS Aggregation**: Automatically fetches news from multiple music industry sources
- **Smart Categorization**: AI Research, Tech Innovation, Industry News, Trends Analysis
- **REST API**: Clean endpoints for frontend consumption
- **Scheduled Updates**: Configurable cron jobs for automatic updates
- **Backup Data**: Fallback curated news when RSS feeds are unavailable

## API Endpoints

### GET /api/health
Health check endpoint.

### GET /api/news
Get all news with optional filtering.
Query params: `category`, `search`, `limit`, `offset`

### GET /api/news/categories
Get category counts.

### GET /api/news/metadata
Get metadata about stored news.

### GET /api/news/:id
Get single article by ID.

### POST /api/admin/fetch-news
Manually trigger news fetch.

## Environment Variables

```env
PORT=3001
NODE_ENV=production
UPDATE_SCHEDULE=0 8 * * *
CORS_ORIGINS=https://your-frontend.com
NEWS_API_KEY=optional_key_from_newsapi.org
```

## Deployment

This service is optimized for Railway deployment.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template)

## RSS Sources

- Music Business Worldwide
- Hypebot
- MusicTech
- Create Digital Music
- Synthtopia
- DJ Mag

## License

MIT
