import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import { createClient } from 'redis';
// Import RedisStore using destructuring - this is the approach that works based on our tests
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { RedisStore: _RedisStore } = require('connect-redis');
import config from './config/config.js';
import routes from './routes/index.js';
import { testDatabaseConnections, closeDatabaseConnections } from './config/db.js';
import logger from './utils/logger';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getRedisClient } from './config/redis.js';
import { loadAndCacheScripts } from './services/bulk-lookup/script-loader';
import {
  createICD10SearchIndex,
  createCPTSearchIndex,
  createMappingSearchIndex
} from './utils/cache/redis-search';
import { populateRedisFromPostgres } from './utils/cache';

// Create Express app
const app = express();

// Initialize Redis client for session store with enhanced configuration
const redisSessionClient = createClient({
  // Use rediss:// protocol for TLS connection to Redis Cloud
  url: `rediss://${process.env.REDIS_CLOUD_HOST}:${process.env.REDIS_CLOUD_PORT}`,
  password: process.env.REDIS_CLOUD_PASSWORD,
  socket: {
    tls: true,
    rejectUnauthorized: false, // Accept self-signed certificates
    connectTimeout: 10000, // 10 seconds
    keepAlive: 5000, // Send keep-alive every 5 seconds
    reconnectStrategy: (retries) => {
      const delay = Math.min(retries * 500, 10000); // Max 10 second delay
      logger.info(`Redis reconnect attempt ${retries} in ${delay}ms`);
      return delay;
    }
  },
  pingInterval: 10000 // Ping every 10 seconds to keep connection alive
});

// Add detailed Redis client event handlers
redisSessionClient.on('connect', () => {
  logger.info('Redis client connecting...');
});

redisSessionClient.on('ready', () => {
  logger.info('Redis client ready and connected');
});

redisSessionClient.on('error', (err) => {
  logger.error(`Redis Session Client Error: ${err.message}`, { error: err });
});

redisSessionClient.on('reconnecting', () => {
  logger.info('Redis client reconnecting...');
});

redisSessionClient.on('end', () => {
  logger.info('Redis client connection closed');
});

// Connect to Redis for session store
(async (): Promise<void> => {
  try {
    logger.info('Connecting to Redis...');
    await redisSessionClient.connect();
    logger.info('Redis session client connected successfully');
    
    // Test the connection with a simple ping
    const pingResult = await redisSessionClient.ping();
    logger.info(`Redis ping result: ${pingResult}`);
    
    // Initialize Redis session store with connect-redis v8 API
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { RedisStore } = require('connect-redis');
    
    // Create the Redis store with enhanced options
    const redisStore = new RedisStore({
      client: redisSessionClient,
      prefix: "radorderpad:",
      ttl: 86400, // 1 day in seconds
      disableTouch: false, // Update TTL on session access
    });
    
    logger.info('Redis session store initialized successfully');
    
    // Configure session middleware
    app.use(session({
      store: redisStore,
      secret: config.jwtSecret, // Use the same secret as JWT for consistency
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: config.nodeEnv === 'production', // Requires HTTPS in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
      }
    }));
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to initialize Redis session store: ${errorMessage}`, { error });
    throw new Error(`Redis session store initialization failed: ${errorMessage}`);
  }
})();

// Set up graceful shutdown for Redis client
process.on('SIGTERM', async () => {
  try {
    await redisSessionClient.disconnect();
    logger.info('Redis session client disconnected');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Error disconnecting Redis client: ${errorMessage}`, { error });
  }
});

process.on('SIGINT', async () => {
  try {
    await redisSessionClient.disconnect();
    logger.info('Redis session client disconnected');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Error disconnecting Redis client: ${errorMessage}`, { error });
  }
});

// Note: We don't need to store the Redis client in a variable
// The functions that need it will call getRedisClient() directly

// Middleware
app.use(helmet()); // Security headers

// Note: Session middleware is now configured in the async IIFE above

// Configure CORS with specific options
app.use(cors({
  origin: [
    'https://api.radorderpad.com',
    'https://app.radorderpad.com',
    'https://radorderpad.com',
    // Replit domains
    /\.repl\.co$/,        // Matches all Replit default domains (*.repl.co)
    /\.replit\.dev$/,     // Matches all Replit dev domains (*.replit.dev)
    // For local development
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5000',
    'http://localhost:8080'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,      // Allow cookies to be sent with requests
  maxAge: 86400          // Cache preflight requests for 24 hours
}));

// Parse JSON bodies for all routes EXCEPT the Stripe webhook route
// This is important because Stripe webhooks need the raw body for signature verification
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhooks/stripe') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// API routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error:', { error: err });
  res.status(500).json({ message: 'Internal server error' });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = config.port;

const server = app.listen(PORT, async () => {
  logger.info(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
  
  // Test database connections
  try {
    const connectionsSuccessful = await testDatabaseConnections();
    if (!connectionsSuccessful) {
      logger.warn('Database connection test failed. Server will continue running, but some features may not work properly.');
      // Don't shut down the server, just log a warning
      // await shutdownServer();
    }
  } catch (error) {
    logger.error('Error testing database connections:', { error });
    logger.warn('Server will continue running, but some features may not work properly.');
    // Don't shut down the server, just log a warning
    // await shutdownServer();
  }
  
  // Load and cache Lua scripts
  try {
    await loadAndCacheScripts();
    logger.info('Lua scripts loaded and cached successfully');
  } catch (error) {
    logger.error('Error loading Lua scripts:', { error });
    logger.warn('Bulk lookup operations may not work properly');
  }
  
  // Initialize Redis search indices
  try {
    await createICD10SearchIndex();
    await createCPTSearchIndex();
    await createMappingSearchIndex();
    logger.info('Redis search indices initialized successfully');
  } catch (error) {
    logger.error('Error initializing Redis search indices:', { error });
    logger.warn('Advanced search features may not work properly, falling back to PostgreSQL search');
  }
  
  // Populate Redis with data from PostgreSQL
  try {
    await populateRedisFromPostgres();
    logger.info('Redis populated with data from PostgreSQL');
  } catch (error) {
    logger.error('Error populating Redis from PostgreSQL:', { error });
    logger.warn('Redis cache may be empty, falling back to PostgreSQL for data');
  }
});

// Handle graceful shutdown
process.on('SIGTERM', shutdownServer);
process.on('SIGINT', shutdownServer);

async function shutdownServer(): Promise<void> {
  logger.info('Shutting down server...');
  
  // Close database connections
  await closeDatabaseConnections();
  
  // Redis session client is now disconnected in the SIGTERM/SIGINT handlers above
  
  // Close server
  server.close(() => {
    logger.info('Server shut down successfully');
    process.exit(0);
  });
  
  // Force close after 5 seconds if graceful shutdown fails
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 5000);
}

export default app;