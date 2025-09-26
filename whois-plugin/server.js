/**
 * SpectraWHOIS Plugin Server
 * Traditional WHOIS query service for Railway deployment
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';
import { config } from 'dotenv';
import { WhoisClient } from './lib/whois-client.js';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize WHOIS client
const whoisClient = new WhoisClient();

// Security and performance middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [
        'https://spectra-whois.vercel.app',
        'https://your-domain.com',
        /\.vercel\.app$/
      ]
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'spectra-whois-plugin',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Main WHOIS query endpoint
app.get('/whois', async (req, res) => {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({
      success: false,
      error: 'Domain parameter is required',
      usage: 'GET /whois?domain=example.com'
    });
  }

  try {
    console.log(`[${new Date().toISOString()}] WHOIS query for: ${domain}`);

    const result = await whoisClient.query(domain);

    console.log(`[${new Date().toISOString()}] Query completed for ${domain}: ${result.success ? 'success' : 'failed'}`);

    return res.json(result);

  } catch (error) {
    console.error(`[${new Date().toISOString()}] WHOIS query error for ${domain}:`, error);

    return res.status(500).json({
      success: false,
      domain: domain,
      error: error.message || 'Internal server error',
      source: 'whois-plugin',
      reason: 'server_error',
      timestamp: new Date().toISOString()
    });
  }
});

// Batch query endpoint (for multiple domains)
app.post('/whois/batch', async (req, res) => {
  const { domains } = req.body;

  if (!domains || !Array.isArray(domains) || domains.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Domains array is required',
      usage: 'POST /whois/batch with JSON body: {"domains": ["example.com", "test.org"]}'
    });
  }

  if (domains.length > 10) {
    return res.status(400).json({
      success: false,
      error: 'Maximum 10 domains allowed per batch request'
    });
  }

  try {
    console.log(`[${new Date().toISOString()}] Batch WHOIS query for: ${domains.join(', ')}`);

    const results = await Promise.allSettled(
      domains.map(domain => whoisClient.query(domain))
    );

    const response = {
      success: true,
      batch: true,
      timestamp: new Date().toISOString(),
      results: results.map((result, index) => ({
        domain: domains[index],
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason.message : null
      }))
    };

    console.log(`[${new Date().toISOString()}] Batch query completed: ${results.filter(r => r.status === 'fulfilled').length}/${domains.length} successful`);

    return res.json(response);

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Batch WHOIS query error:`, error);

    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      source: 'whois-plugin',
      reason: 'batch_error',
      timestamp: new Date().toISOString()
    });
  }
});

// Server info endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'SpectraWHOIS Plugin',
    description: 'Traditional WHOIS query service',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      whois: 'GET /whois?domain=example.com',
      batch: 'POST /whois/batch'
    },
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Unhandled error:`, error);

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    source: 'whois-plugin',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    available: ['/', '/health', '/whois', '/whois/batch']
  });
});

// Start server
const server = createServer(app);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SpectraWHOIS Plugin server running on port ${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
  console.log(`❤️  Ready to serve WHOIS queries!`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});