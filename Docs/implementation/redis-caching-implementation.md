# Redis Caching Implementation

## Overview

This document describes the implementation of AWS MemoryDB for Redis as a caching layer for frequently accessed medical reference data in the RadOrderPad application. The implementation follows the Cache-Aside pattern, where the application first checks the cache for data, and if not found, retrieves it from the database and caches it for future use.

## Architecture

The caching layer is implemented using the following components:

1. **MemoryDB Client Configuration** (`src/config/memorydb.ts`): Configures and manages the connection to AWS MemoryDB for Redis.
2. **Cache Utilities** (`src/utils/cache/cache-utils.ts`): Implements the Cache-Aside pattern for various types of medical reference data.

## Implementation Details

### MemoryDB Client Configuration

The MemoryDB client is configured in `src/config/memorydb.ts` with the following features:

- **Independent Environment Variables**: The MemoryDB configuration loads its own environment variables directly to avoid interfering with the main application configuration.
- **Connection Management**: The client is initialized only once and reused for all cache operations.
- **Error Handling**: Robust error handling ensures that the application continues to function even if the cache is unavailable.
- **Reconnection Strategy**: Exponential backoff with a maximum retry time ensures that the client reconnects gracefully after network interruptions.

### Cache Utilities

The Cache-Aside pattern is implemented in `src/utils/cache/cache-utils.ts` with the following features:

- **Cached Data Types**:
  - Active default prompt templates
  - CPT codes
  - ICD-10 codes
  - CPT-ICD10 mappings
  - ICD-10 markdown documentation

- **Time-to-Live (TTL) Settings**:
  - Prompt templates: 1 hour (3600 seconds)
  - CPT and ICD-10 codes: 24 hours (86400 seconds)
  - CPT-ICD10 mappings: 6 hours (21600 seconds)
  - ICD-10 markdown docs: 6 hours (21600 seconds)

- **Cache Operations**:
  - **Get**: First checks the cache for data, and if not found, retrieves it from the database and caches it.
  - **Invalidate**: Allows manual invalidation of cache entries when data is updated.
  - **Clear by Prefix**: Clears all cache entries with a specific prefix (e.g., all CPT codes).
  - **Clear All**: Flushes the entire cache when needed, useful for testing and maintenance.

- **Error Handling**: All cache operations are wrapped in try-catch blocks, with fallback to direct database queries if the cache operation fails.

## Configuration

### Environment Variables

The following environment variables are used to configure the MemoryDB client:

- `MEMORYDB_HOST`: The hostname of the MemoryDB cluster endpoint (default: 'localhost')
- `MEMORYDB_PORT`: The port number for the MemoryDB cluster (default: 6379)
- `MEMORYDB_USER`: The username for MemoryDB authentication
- `MEMORYDB_PASSWORD`: The password for MemoryDB authentication
- `NODE_ENV`: Used to determine whether to enable TLS (enabled in production)

## Testing

The caching functionality is tested using the following test scripts:

- **Batch Tests**:
  - `tests/batch/test-memorydb-cache.js`: Tests the basic functionality of the MemoryDB caching layer.
  - `tests/batch/run-memorydb-cache-test.bat` and `tests/batch/run-memorydb-cache-test.sh`: Batch files to run the tests on Windows and Unix-based systems, respectively.

- **End-to-End Tests**:
  - `tests/e2e/scenario-i-redis-caching.js`: Tests the Redis caching functionality in an end-to-end scenario.
  - `batch-files/run-scenario-i-redis-caching.bat` and `batch-files/run-scenario-i-redis-caching.sh`: Batch files to run the E2E test on Windows and Unix-based systems, respectively.

The tests verify the following functionality:

1. Cache clearing before tests to ensure a clean testing environment
2. MemoryDB connection
3. Caching CPT codes
4. Caching ICD-10 codes
5. Cache invalidation

## RedisSearch Integration

The RedisSearch integration has been implemented to enable fast context generation for AI-powered features. This enhancement significantly accelerates the database context generation step for the Validation Engine.

### Components

The RedisSearch integration consists of the following components:

1. **Redis Index Manager** (`src/utils/redis/redis-index-manager.ts`): Responsible for creating and managing RedisSearch indexes on MemoryDB.
2. **Redis Search Utilities** (`src/utils/redis/redis-search.ts`): Provides functions for searching medical codes and related data using RedisSearch.
3. **Redis Context Generator** (`src/utils/database/redis-context-generator.ts`): Generates database context using RedisSearch, with fallback to PostgreSQL if RedisSearch fails.
4. **Index Creation Script** (`src/scripts/create-redis-indexes.ts`): A standalone script to create the RedisSearch indexes.
5. **Test Script** (`tests/test-redis-search.js`): Tests the RedisSearch functionality by calling the validation endpoint with a sample dictation.

### Index Schema

The RedisSearch indexes are created with the following schema:

#### CPT Index

```
FT.CREATE cpt_index ON JSON PREFIX 1 cpt: SCHEMA
  $.description AS description TEXT WEIGHT 5.0
  $.modality AS modality TAG
  $.body_part AS body_part TAG
  $.description AS description_nostem TEXT NOSTEM
```

#### ICD-10 Index

```
FT.CREATE icd10_index ON JSON PREFIX 1 icd10: SCHEMA
  $.description AS description TEXT WEIGHT 5.0
  $.keywords AS keywords TEXT WEIGHT 2.0
  $.category AS category TAG
  $.is_billable AS is_billable TAG
  $.description AS description_nostem TEXT NOSTEM
```

### Search Functionality

The RedisSearch integration provides the following search functionality:

- **ICD-10 Code Search**: Searches for ICD-10 codes based on keywords, with support for categorized keywords (symptoms, anatomy terms, modalities).
- **CPT Code Search**: Searches for CPT codes based on keywords, with support for categorized keywords.
- **Mapping Retrieval**: Retrieves mappings between ICD-10 and CPT codes.
- **Markdown Doc Retrieval**: Retrieves markdown documentation for ICD-10 codes.

### Context Generation

The Redis Context Generator generates database context using RedisSearch, with fallback to PostgreSQL if RedisSearch fails. This ensures that the validation process can continue even if Redis is unavailable or the indexes don't exist.

### Testing

The RedisSearch functionality can be tested using the provided test script and batch file:

```
node tests/test-redis-search.js
```

Or:

```
run-redis-search-test.bat
```

### Performance Improvements

The use of RedisSearch significantly improves the performance of the database context generation step:

1. **Reduced Database Load**: By using RedisSearch instead of PostgreSQL for context generation, we reduce the load on the database.
2. **Improved API Latency**: RedisSearch provides sub-millisecond lookups for cached data, resulting in faster API responses.
3. **Advanced Search Capabilities**: RedisSearch enables more advanced search capabilities, such as full-text search and tag filtering.

## Future Enhancements

1. **Cache Warming**: Implement proactive cache warming for frequently accessed data.
2. **Cache Metrics**: Add monitoring and metrics for cache hit/miss rates and performance.
3. **Distributed Locking**: Implement distributed locking for concurrent operations on the same data.
4. **Automatic Index Updates**: Implement automatic index updates when the underlying reference data in PostgreSQL changes.

## Performance Considerations

The Cache-Aside pattern was chosen for its simplicity and effectiveness in reducing database load. By caching frequently accessed medical reference data, we can significantly reduce the number of database queries and improve the overall performance of the application.

The TTL settings were chosen based on the volatility of the data. For example, CPT and ICD-10 codes are relatively static and are cached for 24 hours, while mappings and markdown docs are more likely to be updated and are cached for 6 hours.

## Conclusion

The Redis caching layer provides a significant performance improvement for the RadOrderPad application by reducing the number of database queries for frequently accessed medical reference data. The implementation follows best practices for error handling, connection management, and cache invalidation, ensuring that the application remains robust and reliable.