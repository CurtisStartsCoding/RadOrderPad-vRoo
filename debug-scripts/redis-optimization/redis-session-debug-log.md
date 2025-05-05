# Redis Session Store Debug Log

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

### Attempt 5: Back to Factory Pattern with CommonJS Require
```typescript
// eslint-disable-next-line @typescript-eslint/no-require-imports
const connectRedis = require('connect-redis');
const RedisStore = connectRedis(session);
const redisStore = new RedisStore({
  client: redisSessionClient,
  prefix: "radorderpad:"
});
```
**Result**: Pending testing

## Research Findings
From Perplexity search on "connect-redis v8.0.3 express-session example code":

```javascript
const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');

// Initialize Redis client
const redisClient = createClient({
  url: 'redis://localhost:6379' // Your Redis connection URL
});
redisClient.connect().catch(console.error);

// Configure session middleware
const app = express();
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set true if using HTTPS
    maxAge: 86400000 // 24 hours
  }
}));
```

## Temporary Solution
As a temporary workaround, we've disabled the Redis session store and are using the default in-memory session store:

```typescript
// Configure session middleware
app.use(session({
  // Using in-memory session store (default)
  secret: config.jwtSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.nodeEnv === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  }
}));
```

This allows the application to start, but sessions will not persist across server restarts or be shared across multiple instances.

## Solution Found!
After testing different approaches with a test script (`debug-scripts/redis-optimization/test-connect-redis.js`), we found that the correct way to use connect-redis v8.0.3 is with destructuring:

```typescript
// Import RedisStore using destructuring
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { RedisStore } = require('connect-redis');

// Then use it directly
const redisStore = new RedisStore({
  client: redisSessionClient,
  prefix: "radorderpad:"
});
```

This approach works because connect-redis v8.0.3 exports a named `RedisStore` class, not a default export or a factory function. The test script showed that this was the only approach that successfully created a Redis store.

## Implementation
The fix has been implemented in `src/index.ts` using the destructuring approach. The build completes successfully with no errors.

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
2. It exports a named `RedisStore` class, not a factory function
3. The correct way to import it is with destructuring: `const { RedisStore } = require('connect-redis')`
4. Creating a test script to isolate and test different approaches was key to finding the solution