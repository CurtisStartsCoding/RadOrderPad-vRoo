# Redis Integration for Context Generation

## Overview

The system uses RedisSearch as the primary method for generating database context for validation, with PostgreSQL as a fallback mechanism. This approach provides:

1. **Performance**: RedisSearch queries are significantly faster than PostgreSQL for text search operations
2. **Resilience**: The system can still function if Redis is unavailable
3. **Flexibility**: New data can be added to Redis without requiring schema changes

## Implementation Details

### Primary Path: RedisSearch

When generating database context, the system:

1. Checks if Redis is available using `testRedisConnection()`
2. Uses `FT.SEARCH` queries against the `cpt_index` and `icd10_index` to find relevant codes
3. Retrieves mappings and markdown documents using standard Redis `GET` operations
4. Formats the results into a context string

The implementation is in `src/utils/database/redis-context-generator.ts` and the search functions are in `src/utils/redis/search/`.

### Fallback Path: PostgreSQL

The system falls back to PostgreSQL in the following scenarios:

1. Redis connection fails or times out
2. Redis is available but the RedisSearch indexes don't exist
3. An error occurs during the RedisSearch operations

The fallback uses SQL queries against the PostgreSQL database to retrieve the same information.

## RedisSearch Indexes

The system uses two main RedisSearch indexes:

1. **cpt_index**: For searching CPT codes
   - Fields: description (TEXT), modality (TAG), body_part (TAG)
   - Prefix: `cpt:`

2. **icd10_index**: For searching ICD-10 codes
   - Fields: description (TEXT), keywords (TEXT), category (TAG)
   - Prefix: `icd10:`

These indexes are created by the `createRedisSearchIndexes()` function in `src/utils/redis/redis-index-manager.ts`.

## Testing

The system includes tests to verify both the primary RedisSearch path and the PostgreSQL fallback path:

1. `tests/test-redis-search.js`: Basic test for RedisSearch functionality
2. `tests/test-redis-search-enhanced.js`: Advanced test that verifies both paths

To run the enhanced test:
- Windows: `run-redis-search-enhanced-test.bat`
- Unix/Linux/macOS: `./run-redis-search-enhanced-test.sh` (make it executable first with `chmod +x run-redis-search-enhanced-test.sh`)

## Monitoring

The system logs which path (RedisSearch or PostgreSQL) is being used for context generation, making it easy to monitor the system's behavior in production. Look for log entries with the prefix `CONTEXT_PATH:` to track which path is being used.

Example log entries:
- `CONTEXT_PATH: Using RedisSearch as primary path`
- `CONTEXT_PATH: Using PostgreSQL fallback (Redis connection failed)`
- `CONTEXT_PATH: Using PostgreSQL fallback (Redis connection error)`
- `CONTEXT_PATH: Using PostgreSQL fallback (RedisSearch error)`

## Performance Considerations

RedisSearch is significantly faster than PostgreSQL for text search operations, especially for fuzzy matching and complex queries. In our testing, RedisSearch queries are typically 5-10x faster than equivalent PostgreSQL queries.

However, the PostgreSQL fallback ensures that the system can still function if Redis is unavailable, providing resilience at the cost of some performance.

## Future Improvements

Potential future improvements to the Redis integration:

1. Add caching of frequently accessed context results
2. Implement more sophisticated search algorithms using RedisSearch's advanced features
3. Add monitoring and alerting for Redis availability and performance
4. Implement automatic index rebuilding if indexes are missing or corrupted