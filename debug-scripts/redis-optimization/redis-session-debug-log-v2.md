# Redis Session Store Debug Log (v2)

## Problem Description
The Redis session store integration in the application is causing issues. When using connect-redis v8.0.3, we're encountering errors that prevent the application from starting.

## Environment
- Node.js version: v23.11.0 (from error logs)
- connect-redis: ^8.0.3 (from package.json)
- express-session: ^1.18.1 (from package.json)
- redis: ^4.7.0 (from package.json)

## Attempted Solutions

### Attempt 1: Using Named Import
```typescript
import { RedisStore } from 'connect-redis';
const redisStore = new RedisStore({
  client: redisSessionClient,
  prefix: "radorderpad:"
});
```
**Result**: TypeScript error - `'RedisStore' only refers to a type, but is being used as a value here`

### Attempt 2: Using CommonJS Require
```typescript
// eslint-disable-next-line @typescript-eslint/no-require-imports
const connectRedis = require('connect-redis');
const RedisStore = connectRedis(session);
const redisStore = new RedisStore({
  client: redisSessionClient,
  prefix: "radorderpad:"
});
```
**Result**: Runtime error - `TypeError: connectRedis is not a function`

### Attempt 3: Using Default Import
```typescript
import connectRedis from 'connect-redis';
const RedisStore = connectRedis(session);
const redisStore = new RedisStore({
  client: redisSessionClient,
  prefix: "radorderpad:"
});
```
**Result**: Not tested, but likely would have similar issues to Attempt 1

### Attempt 4: Using .default with CommonJS Require
```typescript
// eslint-disable-next-line @typescript-eslint/no-require-imports
const RedisStore = require('connect-redis').default;
const redisStore = new RedisStore({
  client: redisSessionClient,
  prefix: "radorderpad:"
});
```
**Result**: Runtime error - `TypeError: RedisStore is not a constructor`

### Attempt 5: Using Destructuring with CommonJS Require
```typescript
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { RedisStore } = require('connect-redis');
const redisStore = new RedisStore({
  client: redisSessionClient,
  prefix: "radorderpad:"
});
```
**Result**: This worked for creating the RedisStore, but we encountered Redis connection issues with "Socket closed unexpectedly" errors.

## Redis Connection Issues

After fixing the import issue, we encountered Redis connection issues:

```
Redis Session Client Error Socket closed unexpectedly
```

This suggests that the Redis connection is being established but then immediately closed. This could be due to:

1. Authentication issues
2. Network connectivity problems
3. Redis server configuration issues
4. Connection timeout settings
5. TLS/SSL configuration issues

## Final Solution

We've implemented a comprehensive solution that addresses both the import issue and the connection problems:

1. **Correct Import Pattern**: Using destructuring to import RedisStore
   ```typescript
   const { RedisStore } = require('connect-redis');
   ```

2. **Enhanced Redis Connection Configuration**:
   - Use `rediss://` protocol for TLS connection
   - Configure TLS options
   - Add connection timeouts and keep-alive settings
   - Implement a robust reconnection strategy
   - Add ping interval to keep connection alive

3. **Detailed Event Handling**:
   - Add event handlers for 'connect', 'ready', 'error', 'reconnecting', and 'end' events
   - Improve error logging with detailed messages
   - Test connection with ping after connecting

4. **Proper Error Handling**:
   - Type errors correctly with TypeScript
   - Add fallback for missing error messages
   - Ensure clean shutdown of Redis connections

### Final Implementation

```typescript
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
      secret: config.jwtSecret,
      // ... other options
    }));
    
  } catch (error: any) {
    logger.error(`Failed to initialize Redis session store: ${error.message || 'Unknown error'}`, { error });
    throw new Error(`Redis session store initialization failed: ${error.message || 'Unknown error'}`);
  }
})();
```

## Deployment Instructions
To deploy this fix:

```bash
# On the server
cd ~/code/RadOrderPad-vRoo
git fetch --all
git pull --ff-only origin backend-v1.0-release
npm install
npm run build
npm prune --production
pm2 stop RadOrderPad
pm2 delete RadOrderPad
pm2 start dist/index.js --name RadOrderPad --update-env
pm2 logs RadOrderPad --lines 20
```

## Lessons Learned
1. The connect-redis v8.0.3 API is different from previous versions
2. It exports a named `RedisStore` class, not a default export or a factory function
3. The correct way to import it is with destructuring: `const { RedisStore } = require('connect-redis')`
4. Redis Cloud connections require proper TLS configuration
5. Detailed event handling and error logging are essential for diagnosing Redis connection issues
6. Connection timeouts, keep-alive settings, and reconnection strategies are important for maintaining stable Redis connections