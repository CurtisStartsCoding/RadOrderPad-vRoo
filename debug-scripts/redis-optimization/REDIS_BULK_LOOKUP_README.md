# Redis Bulk Lookup Implementation

This document explains the implementation of Redis bulk lookup operations using Lua scripts and the testing approach.

## Overview

The Redis bulk lookup implementation uses Lua scripts to efficiently retrieve multiple items from Redis in a single operation. This approach reduces network round-trips and can significantly improve performance for large datasets.

## Implementation Details

### Lua Script

The bulk lookup operation is implemented using a Lua script that:

1. Takes a prefix and a list of codes as input
2. Constructs cache keys by combining the prefix with each code
3. Retrieves all values in a single operation
4. Tracks cache hits and misses
5. Returns the results along with hit/miss statistics

```lua
local results = {}
local cacheHits = 0
local cacheMisses = 0

local prefix = ARGV[1]

for i = 2, #ARGV do
  local code = ARGV[i]
  local cacheKey = prefix .. code
  local cached = redis.call("GET", cacheKey)
  
  if cached then
    results[i-1] = cached
    cacheHits = cacheHits + 1
  else
    results[i-1] = ""
    cacheMisses = cacheMisses + 1
  end
end

return {results, cacheHits, cacheMisses}
```

### JavaScript Implementation

The JavaScript implementation:

1. Loads the Lua script into Redis and caches the script SHA
2. Provides a function to execute the script with a list of codes
3. Handles parsing of the results
4. Includes error handling and retry logic

## Testing Approach

The testing approach involves:

1. Setting up test data in Redis
2. Performing individual lookups and measuring performance
3. Performing bulk lookups using the Lua script and measuring performance
4. Comparing the results for correctness and performance

## Performance Considerations

An important finding from our testing is that **bulk operations may be slower for small datasets** due to the overhead of executing the Lua script. The performance benefit typically becomes apparent with larger datasets (50+ items).

For our test with just 5 items, we observed:
- Individual lookups: ~5ms
- Bulk lookups: ~70-75ms

This is because:
1. The overhead of loading and executing the Lua script
2. The serialization/deserialization of the results
3. The additional processing required

For larger datasets, the bulk operation would be more efficient as the overhead is amortized across more items.

## Connection Issues

When implementing Redis operations, we encountered connection issues with different approaches:

1. **Working Approach**: Using CommonJS modules (.cjs) with explicit environment variable loading from `.env.production` and custom Redis client configuration.

2. **Failing Approach**: Using ES modules (.js) without specifying the path to `.env.production` and using the Redis client from the compiled code.

The key differences that resolved the connection issues:

- Explicitly loading environment variables from `.env.production`
- Creating a custom Redis client with specific connection settings
- Using CommonJS module format (.cjs extension)
- Adding better error handling and retry logic

## Recommendations

1. **Use CommonJS for Scripts**: For standalone scripts, use the CommonJS format (.cjs) to avoid module loading issues.

2. **Explicit Environment Loading**: Always explicitly load environment variables from the appropriate file.

3. **Custom Redis Client**: Create a custom Redis client with specific connection settings for scripts.

4. **Performance Testing**: Test bulk operations with realistic dataset sizes to accurately measure performance benefits.

5. **Error Handling**: Implement robust error handling and retry logic for Redis operations.