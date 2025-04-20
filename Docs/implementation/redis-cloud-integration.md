# Redis Cloud Integration

**Version:** 1.1
**Date:** 2025-04-20

This document describes the implementation of Redis Cloud integration in the RadOrderPad application, focusing on the use of RedisJSON and RedisSearch modules for efficient data storage, retrieval, and searching.

## Overview

RadOrderPad uses Redis Cloud (hosted on AWS) for:

1. **Caching Medical Reference Data**: CPT codes, ICD-10 codes, and their mappings
2. **Fast Context Generation**: Using RedisSearch for advanced, real-time indexing and querying
3. **Structured Data Storage**: Using RedisJSON for efficient storage and retrieval of JSON data

## Implementation Details

### 1. Redis Client Configuration

The Redis client is configured in `src/config/redis.ts` with the following key features:

- **TLS Enabled**: Always uses TLS for secure connections to Redis Cloud
- **Connection Pooling**: Leverages ioredis connection pooling
- **Error Handling**: Comprehensive error handling with informative messages
- **Reconnection Strategy**: Exponential backoff with a maximum retry time

### 2. RedisJSON Integration

All data is stored using RedisJSON commands:

- **Storage**: Uses `JSON.SET` instead of regular `SET` to store structured JSON data
- **Retrieval**: Uses `JSON.GET` to retrieve JSON data
- **Helper Functions**: `cacheDataWithRedisJson` and `getCachedDataWithRedisJson` provide a clean API

### 3. RedisSearch Integration

RedisSearch is used for fast, advanced querying:

- **Index Creation**: Indexes are created using `FT.CREATE` with `ON JSON` syntax
- **Querying**: Uses `FT.SEARCH` for efficient querying
- **Field-Level Indexing**: Indexes specific fields within JSON documents

### 4. Data Models

The following data models are stored in Redis:

- **CPT Codes**: `cpt:{cpt_code}` → JSON object with description, modality, body_part
- **ICD-10 Codes**: `icd10:{icd10_code}` → JSON object with description, clinical_notes, etc.
- **Mappings**: `mapping:{icd10_code}:{cpt_code}` → JSON object with mapping details
- **Markdown Docs**: `markdown:{icd10_code}` → JSON object with markdown content

### 5. Search Indexes

Two main search indexes are created:

- **CPT Index**:
  ```
  FT.CREATE cpt_index ON JSON PREFIX 1 cpt: SCHEMA
    $.description AS description TEXT WEIGHT 5.0
    $.modality AS modality TAG
    $.body_part AS body_part TAG
    $.description AS description_nostem TEXT NOSTEM
  ```

- **ICD-10 Index**:
  ```
  FT.CREATE icd10_index ON JSON PREFIX 1 icd10: SCHEMA
    $.description AS description TEXT WEIGHT 5.0
    $.keywords AS keywords TEXT WEIGHT 2.0
    $.category AS category TAG
    $.is_billable AS is_billable TAG
    $.description AS description_nostem TEXT NOSTEM
  ```

## Environment Configuration

Redis Cloud connection details are configured via environment variables:

```
REDIS_CLOUD_HOST=your-redis-cloud-endpoint.cloud.redislabs.com
REDIS_CLOUD_PORT=12345
REDIS_CLOUD_PASSWORD=your-redis-cloud-password
```

## Fallback Strategy

If Redis Cloud is unavailable, the application falls back to PostgreSQL for data retrieval:

1. Connection test is performed before each Redis operation
2. If the connection fails, the application gracefully falls back to PostgreSQL
3. Detailed error messages are logged to help diagnose connection issues
4. The application logs which path is being used with `CONTEXT_PATH` markers

## Security Considerations

- **TLS Encryption**: All connections to Redis Cloud use TLS encryption
- **Authentication**: Redis Cloud password is used for authentication
- **IP Allowlisting**: Redis Cloud is configured to only accept connections from specific IP addresses (currently only 3.135.76.53 is allowed)

### IP Allowlisting Configuration

The Redis Cloud instance is currently configured to only accept connections from the IP address 3.135.76.53. You need to add your current IP address (69.138.136.57) to the allowlist in the Redis Cloud console:

1. Log in to the Redis Cloud console
2. Navigate to your database
3. Go to the "Security" tab
4. Under "CIDR allow list", add your IP address: 69.138.136.57
5. Click "Save"

Alternatively, you can use a proxy or VPN to route your traffic through the allowed IP address.

## Testing

### Basic Connection Test

To test your connection to Redis Cloud and check if your IP address is properly allowlisted, you can use the provided test scripts:

```bash
# Windows
.\test-redis-connection.bat

# Unix/Linux/macOS
./test-redis-connection.sh
```

This script will:
1. Display your current public IP address
2. Test the connection to Redis Cloud
3. Provide guidance on how to update the IP allowlist if the connection fails

### Redis Functionality Test

Once your connection is working, you can run a more comprehensive test that verifies Redis functionality:

```bash
# Windows
.\run-redis-basic-test.bat

# Unix/Linux/macOS
./run-redis-basic-test.sh
```

This test will:
1. Test the Redis Cloud connection
2. Create RedisSearch indexes
3. Verify the indexes were created
4. Test basic Redis operations (set, get, delete)

### RedisSearch Test

To test the RedisSearch functionality for context generation:

```bash
# Windows
.\run-redis-search-test.bat

# Unix/Linux/macOS
./run-redis-search-test.sh
```

This test will:
1. Create RedisSearch indexes
2. Verify the indexes were created
3. Call the validation endpoint with a sample dictation
4. Check if the returned codes exist in Redis

### Enhanced RedisSearch Test with Fallback Testing

To test both the RedisSearch functionality and the PostgreSQL fallback mechanism:

```bash
# Windows
.\run-redis-search-with-fallback-test.bat

# Unix/Linux/macOS
# (Create an equivalent shell script if needed)
```

This enhanced test:
1. First tests the normal RedisSearch path to ensure it works correctly
2. Then simulates a Redis connection failure to test the PostgreSQL fallback path
3. Verifies which path was used by checking the application logs
4. Reports the results of both tests

## Maintenance and Monitoring

- **Index Creation**: The `create-redis-indexes.ts` script creates and updates RedisSearch indexes
- **Connection Testing**: The `testRedisConnection` function can be used to test the Redis Cloud connection
- **Error Logging**: Comprehensive error logging helps diagnose issues
- **Path Logging**: The application logs which path is being used (Redis or PostgreSQL) with `CONTEXT_PATH` markers

## References

- [Redis Cloud Documentation](https://docs.redis.com/latest/rc/)
- [RedisJSON Documentation](https://redis.io/docs/stack/json/)
- [RedisSearch Documentation](https://redis.io/docs/stack/search/)