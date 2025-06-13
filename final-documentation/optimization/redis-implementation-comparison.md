# Redis Implementation Comparison: Replit vs Current

## Overview

This document provides a detailed side-by-side comparison of the Replit (Valkey) and current (RedisSearch) implementations, highlighting key differences and their implications.

## Technology Stack

| Aspect | Replit (Valkey) | Current (RedisSearch) |
|--------|-----------------|----------------------|
| **Redis Version** | Valkey (Redis fork) | Redis with modules |
| **Search Capability** | None (uses PostgreSQL) | RedisSearch module |
| **JSON Support** | Basic key-value | RedisJSON module |
| **Primary Purpose** | Simple caching | Advanced search + caching |

## Data Storage Patterns

### Replit Implementation
```javascript
// Simple key-value storage
const cacheKey = `cpt:code:${code}`;
const cacheValue = JSON.stringify({
  code: cptData.code,
  description: cptData.description,
  modality: cptData.modality
});
await redisClient.set(cacheKey, cacheValue, 'EX', ttl);
```

### Current Implementation
```typescript
// Complex JSON document storage with indexing
await client.call('JSON.SET', `cpt:${cptCode}`, '.', JSON.stringify({
  cpt_code: cptCode,
  description: row.description,
  modality: row.modality,
  body_part: row.body_part,
  clinical_justification: row.clinical_justification,
  key_findings: row.key_findings,
  appropriateness_score: row.appropriateness_score,
  evidence_level: row.evidence_level,
  specialty_relevance: row.specialty_relevance
}));
```

## Search Implementation

### Replit: PostgreSQL Full-Text Search
```javascript
// Uses PostgreSQL with weighted search
const pgQuery = `
  SELECT 
    c.*, 
    ts_rank_cd(
      setweight(to_tsvector('english', c.code), 'A') ||
      setweight(to_tsvector('english', c.description), 'B'),
      to_tsquery('english', $1)
    ) AS rank
  FROM medical_icd10_codes c
  WHERE c.description @@ to_tsquery('english', $1)
  ORDER BY rank DESC
  LIMIT $2
`;

// Cache the results
await redisClient.set(cacheKey, JSON.stringify(results), 'EX', 300);
```

### Current: RedisSearch with Field Weights
```typescript
// Direct search in Redis with weighted fields
const query = `@description:(${searchTerms}) | @keywords:(${searchTerms}) | 
               @primary_imaging_rationale:(${searchTerms})`;

const result = await client.call(
  'FT.SEARCH',
  'idx:icd10',
  query,
  'WITHSCORES',
  'LIMIT', '0', '20',
  'RETURN', '7', // Returns ALL fields
  '$.icd10_code', '$.description', '$.clinical_notes',
  '$.imaging_modalities', '$.primary_imaging', 
  '$.keywords', '$.primary_imaging_rationale'
);
```

## Data Volume Comparison

### Replit Response Size
```javascript
// Typical response
{
  "results": [
    {
      "code": "M25.511",
      "description": "Pain in right shoulder",
      "score": 0.95
    },
    {
      "code": "M25.512", 
      "description": "Pain in left shoulder",
      "score": 0.87
    }
  ]
}
// Size: ~200-300 bytes per result
```

### Current Response Size
```typescript
// Typical response
{
  "results": [
    {
      "icd10_code": "M25.511",
      "description": "Pain in right shoulder",
      "clinical_notes": "Common condition affecting the shoulder joint...",
      "imaging_modalities": "MRI, X-ray, Ultrasound",
      "primary_imaging": "MRI shoulder without contrast",
      "keywords": "shoulder pain glenohumeral joint rotator cuff",
      "primary_imaging_rationale": "MRI provides best visualization...",
      "score": 0.95
    }
    // ... continues
  ]
}
// Size: ~1000-2000 bytes per result
```

## Performance Characteristics

| Metric | Replit | Current |
|--------|--------|---------|
| **Avg Result Size** | 200-300 bytes | 1000-2000 bytes |
| **Default Limit** | 10 results | 20 results |
| **Fields Returned** | 2-3 fields | 7-10 fields |
| **Context Size** | ~2KB | ~20-40KB |
| **Cache Strategy** | Result caching | No result caching |
| **TTL Strategy** | Variable by usage | Fixed TTL |

## Caching Strategies

### Replit: Multi-Layer Caching
```javascript
// 1. In-memory LRU cache (fastest)
if (memoryCache.has(code)) {
  return memoryCache.get(code);
}

// 2. Redis cache (fast)
const cached = await redisClient.get(cacheKey);
if (cached) {
  memoryCache.set(code, JSON.parse(cached));
  return JSON.parse(cached);
}

// 3. Database (slowest)
const result = await db.query(...);

// Cache with intelligent TTL
const ttl = result.usage_frequency > 100 ? 86400 : 3600;
await redisClient.set(cacheKey, JSON.stringify(result), 'EX', ttl);
```

### Current: Single-Layer Direct Search
```typescript
// Direct RedisSearch query every time
const results = await searchICD10CodesWithScores(keywords);
// No caching of search results
// No variable TTL based on usage
```

## Autocomplete Implementation

### Replit: Redis Sorted Sets
```javascript
// Pre-built autocomplete index
await redisClient.zadd('autocomplete:icd10', 100, code.toLowerCase());

// Fast prefix matching
const matches = await redisClient.zrevrangebylex(
  'autocomplete:prefix:icd10',
  `[${prefix}\xff`, 
  `[${prefix}`, 
  'LIMIT', 0, 10
);
```

### Current: Not Implemented
- Relies on full RedisSearch queries
- No dedicated autocomplete functionality

## Bulk Operations

### Replit: Lua Scripts
```javascript
// Efficient bulk lookup with Lua
const BULK_LOOKUP_SCRIPT = `
  local results = {}
  for i, code in ipairs(ARGV) do
    local cached = redis.call("GET", "code:" .. code)
    if cached then
      results[i] = cached
    end
  end
  return results
`;
```

### Current: Individual Operations
```typescript
// Multiple individual searches
for (const keyword of keywords) {
  const results = await searchCodes(keyword);
  // Process each individually
}
```

## Memory Usage

### Replit
- **Storage**: ~500KB per 1000 codes
- **Index Size**: Minimal (sorted sets)
- **Pattern**: Selective caching

### Current
- **Storage**: ~5-10MB per 1000 codes
- **Index Size**: Large (full-text + JSON)
- **Pattern**: Complete data duplication

## Key Takeaways

### Replit Strengths
1. Minimal data transfer
2. Efficient caching strategies
3. Lower memory usage
4. Simple and predictable

### Current Strengths
1. Powerful search capabilities
2. Fuzzy matching support
3. No database queries needed
4. Field-weighted relevance

### Optimization Opportunity
Combine the best of both:
- Use RedisSearch's power for search
- Implement Replit's minimal data approach
- Add result caching layer
- Implement smart TTLs
- Return only essential fields