// Vercel Serverless Function for Metadata API

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let metadata = {};

try {
  const metadataPath = join(__dirname, '..', 'server', 'data', 'metadata.json');
  metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));
} catch (error) {
  console.error('Error loading metadata:', error);
  metadata = { lastUpdated: new Date().toISOString(), totalArticles: 0 };
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
    return res.status(200).json({
      success: true,
      data: metadata
    });
  } catch (error) {
    console.error('Metadata API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
