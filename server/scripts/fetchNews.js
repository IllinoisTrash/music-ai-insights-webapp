#!/usr/bin/env node

/**
 * Manual script to fetch news immediately
 * Usage: node scripts/fetchNews.js
 */

import { fetchAndStoreNews } from '../services/newsFetcher.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

async function main() {
  console.log('🚀 Manual news fetch started\n');
  
  try {
    const result = await fetchAndStoreNews();
    console.log('\n✅ News fetch completed successfully!');
    console.log('📊 Results:', JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('\n❌ News fetch failed:', error);
    process.exit(1);
  }
}

main();
