# Redis Cache Implementation v2 Tests

This directory contains test scripts for the Redis caching implementation that uses the Cache-Aside pattern with Redis Key-Value and Hash structures.

## Prerequisites

1. A Redis instance running locally or accessible via environment variables
2. Node.js installed
3. TypeScript files compiled to JavaScript

## Environment Variables

The test scripts use the Redis Cloud configuration from the `.env.production` file:

- `REDIS_CLOUD_HOST`: Redis Cloud hostname
- `REDIS_CLOUD_PORT`: Redis Cloud port
- `REDIS_CLOUD_PASSWORD`: Redis Cloud password

The test script will automatically use these Redis Cloud credentials if available.

## Running the Tests

### Windows

```
debug-scripts\redis-optimization\test-redis-cache-v2.bat
```

### Unix/Linux/macOS

```
chmod +x debug-scripts/redis-optimization/test-redis-cache-v2.sh
./debug-scripts/redis-optimization/test-redis-cache-v2.sh
```

## Individual Test Commands

You can also run individual tests:

```
# Clear all cache keys
node debug-scripts/redis-optimization/test-redis-cache-v2.cjs clear

# Test CPT code lookup
node debug-scripts/redis-optimization/test-redis-cache-v2.cjs cpt 71045

# Test ICD-10 code lookup
node debug-scripts/redis-optimization/test-redis-cache-v2.cjs icd10 J18.9

# Test mapping lookup
node debug-scripts/redis-optimization/test-redis-cache-v2.cjs mapping J18.9

# Test diagnosis search
node debug-scripts/redis-optimization/test-redis-cache-v2.cjs search-diagnosis "pneumonia"

# Test procedure search
node debug-scripts/redis-optimization/test-redis-cache-v2.cjs search-procedure "chest xray"
```

## Redis-Only Testing

If you want to test the Redis caching functionality without requiring the PostgreSQL database, you can use the Redis-only test script:

### Windows

```
debug-scripts\redis-optimization\test-redis-only.bat
```

### Unix/Linux/macOS

```
chmod +x debug-scripts/redis-optimization/test-redis-only.sh
./debug-scripts/redis-optimization/test-redis-only.sh
```

This test script:
1. Manually sets test data in Redis
2. Tests retrieving that data from Redis
3. Doesn't attempt to query the PostgreSQL database

It's useful for verifying that the Redis caching implementation works correctly, even when the database is not accessible.

> Note: The test script uses the `.cjs` extension to explicitly indicate it's a CommonJS module, which is compatible with the compiled TypeScript files.

## Test Details

The tests verify:

1. **Cache Misses**: First access to data should query the database
2. **Cache Hits**: Subsequent access should retrieve data from Redis
3. **Performance Improvements**: Measure and display the performance difference
4. **Cache Invalidation**: Verify that invalidated cache entries are properly removed

## Local Testing Without a Redis Server

If you don't have a Redis server available, you can use a local Redis instance:

1. Install Redis locally:
   - Windows: Use [Redis for Windows](https://github.com/tporadowski/redis/releases)
   - macOS: `brew install redis`
   - Linux: `apt-get install redis-server` or equivalent

2. Start Redis locally:
   - Windows: Run the Redis server executable
   - macOS/Linux: `redis-server`

3. Run the tests with the default localhost configuration

## Compiling TypeScript Files

Before running the tests, make sure to compile the TypeScript files:

```
npm run build
```

This will generate the JavaScript files in the `dist` directory that the test scripts will import.