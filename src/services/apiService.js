/**
 * API Service for fetching news from backend
 * Replaces the browser-side RSS fetching with server API calls
 */

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '/api';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    // 移除开头的 /api，因为 baseUrl 已经包含
    const cleanEndpoint = endpoint.startsWith('/api') ? endpoint.slice(4) : endpoint;
    const url = `${this.baseUrl}${cleanEndpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get all news with optional filters
  async getNews({ category = 'all', search = '', limit = 50, offset = 0 } = {}) {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    const response = await this.request(`/news?${params}`);
    return response.data || [];
  }

  // Get category counts
  async getCategories() {
    const response = await this.request('/categories');
    return response.data || {};
  }

  // Get metadata
  async getMetadata() {
    const response = await this.request('/metadata');
    return response.data || {};
  }

  // Get single article
  async getArticle(id) {
    const response = await this.request(`/news?id=${id}`);
    return response.data;
  }

  // Health check
  async healthCheck() {
    const response = await this.request('/health');
    return response;
  }
}

export const apiService = new ApiService();
export default apiService;
