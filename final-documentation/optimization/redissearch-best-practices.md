# RedisSearch Best Practices for Medical Code Search

## Overview

This document outlines best practices for using RedisSearch effectively in the RadOrderPad application, focusing on optimizing for medical code searches while minimizing payload sizes.

## 1. Index Design

### Field Selection and Weights
```typescript
// Good: Selective fields with appropriate weights
await client.call(
  'FT.CREATE', 'idx:icd10', 'ON', 'JSON', 'PREFIX', '1', 'icd10:code:',
  'SCHEMA',
  '$.icd10_code', 'AS', 'code', 'TAG', 'SORTABLE',
  '$.description', 'AS', 'description', 'TEXT', 'WEIGHT', '5.0',
  '$.keywords', 'AS', 'keywords', 'TEXT', 'WEIGHT', '3.0',
  '$.category', 'AS', 'category', 'TAG'
);

// Avoid: Indexing every field
// This increases index size and slows down searches
```

### Best Practices:
- Index only searchable fields
- Use TAG for exact matches (codes, categories)
- Use TEXT for full-text search (descriptions)
- Apply weights based on field importance
- Keep total indexed fields under 10

## 2. Query Optimization

### Use Field Projections
```typescript
// Good: Return only needed fields
const result = await client.call(
  'FT.SEARCH', 'idx:icd10', query,
  'RETURN', '2', '$.icd10_code', '$.description'
);

// Avoid: Returning all fields
const result = await client.call(
  'FT.SEARCH', 'idx:icd10', query,
  'RETURN', '7', '$.icd10_code', '$.description', '$.clinical_notes', 
  '$.imaging_modalities', '$.primary_imaging', '$.keywords', 
  '$.primary_imaging_rationale'
);
```

### Implement Score Filtering
```typescript
// Filter results by relevance score
export async function searchWithMinScore(
  query: string, 
  minScore: number = 0.7
): Promise<SearchResult[]> {
  const results = await performSearch(query);
  
  // Filter low-scoring results
  return results
    .filter(r => r.score >= minScore)
    .slice(0, 10); // Limit total results
}
```

## 3. Search Strategies

### Context-Aware Searching
```typescript
interface SearchContext {
  type: 'diagnosis' | 'procedure' | 'general';
  specialty?: string;
  urgency?: 'routine' | 'urgent';
}

function buildQuery(terms: string[], context: SearchContext): string {
  switch(context.type) {
    case 'diagnosis':
      // Prioritize description and clinical notes
      return `@description:(${terms}) => {$weight: 5.0} | 
              @clinical_notes:(${terms}) => {$weight: 3.0}`;
              
    case 'procedure':
      // Prioritize modality and body part
      return `@modality:(${terms}) => {$weight: 5.0} | 
              @body_part:(${terms}) => {$weight: 4.0}`;
              
    default:
      // Balanced search
      return `@description:(${terms}) | @keywords:(${terms})`;
  }
}
```

### Fuzzy Matching for Medical Terms
```typescript
// Apply fuzzy matching selectively
function processMedicalTerms(query: string): string[] {
  const terms = query.toLowerCase().split(/\s+/);
  
  return terms.map(term => {
    // Apply fuzzy matching to longer medical terms
    if (term.length > 4 && isMedicalTerm(term)) {
      return `%%${term}%%`; // Allows 1 character difference
    }
    return term;
  });
}

// Example: "sholder pain" → "%%sholder%% pain" → matches "shoulder pain"
```

## 4. Performance Optimization

### Implement Result Caching
```typescript
class SearchCache {
  private cache = new Map<string, CachedResult>();
  private maxAge = 5 * 60 * 1000; // 5 minutes
  
  async search(query: string, searchFn: SearchFunction): Promise<SearchResult[]> {
    const cacheKey = this.getCacheKey(query);
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.maxAge) {
      return cached.results;
    }
    
    const results = await searchFn(query);
    this.cache.set(cacheKey, {
      results,
      timestamp: Date.now()
    });
    
    return results;
  }
  
  private getCacheKey(query: string): string {
    return crypto.createHash('md5').update(query.toLowerCase()).digest('hex');
  }
}
```

### Batch Operations
```typescript
// Good: Pipeline multiple operations
async function getMultipleCodes(codes: string[]): Promise<CodeData[]> {
  const pipeline = client.pipeline();
  
  codes.forEach(code => {
    pipeline.call('JSON.GET', `icd10:code:${code}`, '$.icd10_code', '$.description');
  });
  
  const results = await pipeline.exec();
  return results.map(r => JSON.parse(r[1]));
}

// Avoid: Sequential operations
async function getMultipleCodesBad(codes: string[]): Promise<CodeData[]> {
  const results = [];
  for (const code of codes) {
    const result = await client.call('JSON.GET', `icd10:code:${code}`);
    results.push(JSON.parse(result));
  }
  return results;
}
```

## 5. Memory Management

### Use Appropriate Data Structures
```typescript
// For frequently accessed data: Use simple strings
await client.set(`freq:${code}`, JSON.stringify(minimalData), 'EX', 3600);

// For complex searchable data: Use RedisJSON with indexing
await client.call('JSON.SET', `icd10:code:${code}`, '.', JSON.stringify(fullData));

// For autocomplete: Use sorted sets
await client.zadd('autocomplete:icd10', score, term);
```

### Implement TTL Strategies
```typescript
interface TTLStrategy {
  getExpiration(data: any): number;
}

class UsageBasedTTL implements TTLStrategy {
  getExpiration(data: CodeData): number {
    if (data.usageCount > 1000) return 86400;  // 24 hours for common codes
    if (data.usageCount > 100) return 3600;    // 1 hour for moderate use
    return 900;                                 // 15 minutes for rare codes
  }
}
```

## 6. Monitoring and Optimization

### Track Search Performance
```typescript
interface SearchMetrics {
  query: string;
  resultCount: number;
  searchTime: number;
  cacheHit: boolean;
}

async function searchWithMetrics(query: string): Promise<SearchResult[]> {
  const start = Date.now();
  const cacheHit = await checkCache(query);
  
  const results = cacheHit 
    ? await getFromCache(query)
    : await performSearch(query);
  
  const metrics: SearchMetrics = {
    query,
    resultCount: results.length,
    searchTime: Date.now() - start,
    cacheHit
  };
  
  // Log metrics for analysis
  await logMetrics(metrics);
  
  return results;
}
```

### Regular Index Maintenance
```bash
# Monitor index size
FT.INFO idx:icd10

# Check memory usage
INFO memory

# Optimize indices periodically
FT.OPTIMIZE idx:icd10
```

## 7. Error Handling

### Graceful Fallbacks
```typescript
async function searchWithFallback(query: string): Promise<SearchResult[]> {
  try {
    // Try RedisSearch first
    return await redisSearch(query);
  } catch (error) {
    logger.warn('RedisSearch failed, falling back to PostgreSQL', error);
    
    try {
      // Fall back to PostgreSQL
      const pgResults = await postgresSearch(query);
      
      // Cache results for next time
      await cacheResults(query, pgResults);
      
      return pgResults;
    } catch (pgError) {
      logger.error('Both search methods failed', pgError);
      return []; // Return empty results rather than error
    }
  }
}
```

## 8. Security Considerations

### Sanitize Search Input
```typescript
function sanitizeSearchQuery(query: string): string {
  // Remove Redis special characters
  return query
    .replace(/[*?\\[\]()]/g, ' ')  // Remove wildcards and special chars
    .replace(/\s+/g, ' ')           // Normalize whitespace
    .trim()
    .substring(0, 100);             // Limit query length
}
```

### Rate Limiting
```typescript
const searchLimiter = {
  async checkLimit(userId: string): Promise<boolean> {
    const key = `ratelimit:search:${userId}`;
    const count = await client.incr(key);
    
    if (count === 1) {
      await client.expire(key, 60); // 60 second window
    }
    
    return count <= 30; // 30 searches per minute
  }
};
```

## Summary

Key takeaways for optimal RedisSearch usage:

1. **Index only what you search** - Don't index every field
2. **Return only what you need** - Use field projections
3. **Filter by relevance** - Use score thresholds
4. **Cache search results** - Avoid repeated searches
5. **Monitor performance** - Track metrics and optimize
6. **Plan for failures** - Implement fallbacks
7. **Secure your searches** - Sanitize input and rate limit

By following these practices, you can leverage RedisSearch's powerful capabilities while maintaining efficient, fast, and secure medical code searches.