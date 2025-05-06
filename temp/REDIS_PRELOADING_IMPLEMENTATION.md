# Redis Data Preloading Implementation

This document details the system's sophisticated approach to preloading data from PostgreSQL into Redis for high-performance access.

## Initialization Process

When the application starts, it executes a comprehensive preloading sequence defined in `server/services/cacheInitializationService.ts`:

```javascript
// Main initialization function called during server startup
export async function initializeRedisCache() {
  console.log("Starting Redis cache initialization...");
  const startTime = Date.now();

  try {
    // Check if initialization is needed by looking for a sentinel key
    const initStatus = await redisClient.get('cache:initialization:status');
    if (initStatus === 'complete') {
      console.log("Cache initialization already completed, checking data freshness...");
      
      // Check when the last initialization was performed
      const lastInitTime = await redisClient.get('cache:initialization:timestamp');
      const daysSinceInit = lastInitTime 
        ? (Date.now() - parseInt(lastInitTime)) / (1000 * 60 * 60 * 24)
        : null;
      
      // Force refresh if data is older than 7 days
      if (!daysSinceInit || daysSinceInit > 7) {
        console.log(`Cache data is ${daysSinceInit?.toFixed(1)} days old, forcing refresh...`);
      } else {
        console.log(`Cache data is ${daysSinceInit?.toFixed(1)} days old, skipping initialization`);
        return;
      }
    }
    
    // Set initialization status to "in progress"
    await redisClient.set('cache:initialization:status', 'in_progress');
    
    // Execute all preloading tasks in sequence
    await preloadFrequentlyUsedCPTCodes();
    await preloadCommonICD10Codes();
    await preloadPopularMappings();
    await buildSearchIndices();
    await initializeAutocompleteSystem();
    
    // Update initialization metadata
    await redisClient.set('cache:initialization:status', 'complete');
    await redisClient.set('cache:initialization:timestamp', Date.now().toString());
    
    const duration = (Date.now() - startTime) / 1000;
    console.log(`Redis cache initialization completed in ${duration.toFixed(2)} seconds`);
  } catch (error) {
    console.error("Failed to initialize Redis cache:", error);
    await redisClient.set('cache:initialization:status', 'failed');
    await redisClient.set('cache:initialization:error', error.message);
  }
}
```

## Detailed Preloading Components

### 1. Frequently Used CPT Codes Preloading

```javascript
async function preloadFrequentlyUsedCPTCodes() {
  console.log("Preloading frequently used CPT codes...");
  const startTime = Date.now();
  
  // Get usage statistics to determine most frequently accessed codes
  const usageStats = await db.query(`
    SELECT 
      code, 
      access_count,
      last_accessed
    FROM 
      medical_cpt_usage_stats
    WHERE 
      access_count > 50
    ORDER BY 
      access_count DESC
    LIMIT 2000
  `);
  
  if (usageStats.rows.length === 0) {
    console.log("No usage statistics found, preloading top CPT codes by category instead");
    return preloadTopCPTCodesByCategory();
  }
  
  // Create a pipeline for batch operations
  const pipeline = redisClient.pipeline();
  let loadedCount = 0;
  
  for (const stat of usageStats.rows) {
    // Get complete code data from database 
    const codeResult = await db.query(`
      SELECT * FROM medical_cpt_codes WHERE code = $1
    `, [stat.code]);
    
    if (codeResult.rows.length > 0) {
      const cptData = codeResult.rows[0];
      const cacheKey = `cpt:code:${cptData.code}`;
      
      // Store the complete CPT code data
      pipeline.set(cacheKey, JSON.stringify(cptData), 'EX', 86400); // 24 hour TTL
      
      // Add to category set for category-based lookups
      pipeline.sadd(`cpt:category:${cptData.category}`, cptData.code);
      
      // Also index by modality if available
      if (cptData.modality) {
        pipeline.sadd(`cpt:modality:${cptData.modality.toLowerCase()}`, cptData.code);
      }
      
      // Update the code's access count in sorted set for analytics
      pipeline.zadd('cpt:usage:frequency', stat.access_count, cptData.code);
      
      loadedCount++;
      
      // Execute pipeline in batches to avoid memory issues
      if (loadedCount % 100 === 0) {
        await pipeline.exec();
        console.log(`Loaded ${loadedCount} CPT codes so far...`);
        // Create a new pipeline for the next batch
        pipeline.pipeline();
      }
    }
  }
  
  // Execute final batch if any remain
  if (loadedCount % 100 !== 0) {
    await pipeline.exec();
  }
  
  // Set a sentinel key to track which codes were preloaded
  await redisClient.set('cache:cpt:preloaded', loadedCount.toString());
  await redisClient.set('cache:cpt:preloaded:timestamp', Date.now().toString());
  
  const duration = (Date.now() - startTime) / 1000;
  console.log(`Preloaded ${loadedCount} frequently used CPT codes in ${duration.toFixed(2)} seconds`);
}

// Fallback if no usage statistics are available
async function preloadTopCPTCodesByCategory() {
  // Load most common codes from each category
  const categories = ['radiology', 'cardiology', 'neurology', 'orthopedics', 'general'];
  let totalLoaded = 0;
  
  for (const category of categories) {
    console.log(`Preloading top CPT codes for category: ${category}`);
    
    const codes = await db.query(`
      SELECT * 
      FROM medical_cpt_codes 
      WHERE category = $1 
      ORDER BY is_common DESC, code ASC
      LIMIT 200
    `, [category]);
    
    const pipeline = redisClient.pipeline();
    
    for (const cptData of codes.rows) {
      const cacheKey = `cpt:code:${cptData.code}`;
      pipeline.set(cacheKey, JSON.stringify(cptData), 'EX', 86400);
      pipeline.sadd(`cpt:category:${category}`, cptData.code);
      
      if (cptData.modality) {
        pipeline.sadd(`cpt:modality:${cptData.modality.toLowerCase()}`, cptData.code);
      }
      
      totalLoaded++;
    }
    
    await pipeline.exec();
    console.log(`Loaded ${codes.rows.length} CPT codes for category ${category}`);
  }
  
  await redisClient.set('cache:cpt:preloaded', totalLoaded.toString());
  await redisClient.set('cache:cpt:preloaded:timestamp', Date.now().toString());
  
  console.log(`Preloaded ${totalLoaded} top CPT codes by category`);
}
```

### 2. ICD-10 Diagnostic Codes Preloading

```javascript
async function preloadCommonICD10Codes() {
  console.log("Preloading common ICD-10 diagnostic codes...");
  const startTime = Date.now();
  
  // Get most commonly accessed ICD-10 codes based on usage statistics
  const commonCodes = await db.query(`
    SELECT 
      ic.* 
    FROM 
      medical_icd10_codes ic
    JOIN 
      medical_icd10_usage_stats us ON ic.code = us.code
    WHERE
      us.access_count > 30
    ORDER BY 
      us.access_count DESC
    LIMIT 3000
  `);
  
  // If no usage stats, fall back to loading by frequency in clinical practice
  if (commonCodes.rows.length < 100) {
    console.log("Insufficient usage statistics, loading common ICD-10 codes by clinical frequency");
    return preloadICD10CodesByFrequency();
  }
  
  const pipeline = redisClient.pipeline();
  let loadedCount = 0;
  
  for (const codeData of commonCodes.rows) {
    const cacheKey = `icd10:code:${codeData.code}`;
    
    // Store complete code data
    pipeline.set(cacheKey, JSON.stringify(codeData), 'EX', 86400);
    
    // Index code by category
    if (codeData.category) {
      pipeline.sadd(`icd10:category:${codeData.category.toLowerCase()}`, codeData.code);
    }
    
    // Add to specialty index if available
    if (codeData.specialty) {
      pipeline.sadd(`icd10:specialty:${codeData.specialty.toLowerCase()}`, codeData.code);
    }
    
    // Build description search index
    if (codeData.description) {
      const words = codeData.description.toLowerCase().split(/\s+/);
      
      // Store words as hash for full-text search fallback
      words.forEach(word => {
        if (word.length > 3) { // Skip short words
          pipeline.sadd(`icd10:word:${word}`, codeData.code);
        }
      });
      
      // Store description for reverse lookup
      pipeline.hset('icd10:descriptions', codeData.code, codeData.description);
    }
    
    loadedCount++;
    
    // Execute in batches
    if (loadedCount % 100 === 0) {
      await pipeline.exec();
      console.log(`Loaded ${loadedCount} ICD-10 codes so far...`);
      pipeline.pipeline();
    }
  }
  
  // Execute final batch
  if (loadedCount % 100 !== 0) {
    await pipeline.exec();
  }
  
  await redisClient.set('cache:icd10:preloaded', loadedCount.toString());
  await redisClient.set('cache:icd10:preloaded:timestamp', Date.now().toString());
  
  const duration = (Date.now() - startTime) / 1000;
  console.log(`Preloaded ${loadedCount} common ICD-10 codes in ${duration.toFixed(2)} seconds`);
}

// Alternative loading by clinical frequency
async function preloadICD10CodesByFrequency() {
  // Query codes marked as common in clinical practice
  const commonCodes = await db.query(`
    SELECT * 
    FROM medical_icd10_codes 
    WHERE is_common = true
    ORDER BY code
    LIMIT 5000
  `);
  
  const pipeline = redisClient.pipeline();
  let loadedCount = 0;
  
  // Similar processing as above function
  // ...

  console.log(`Preloaded ${loadedCount} ICD-10 codes by clinical frequency`);
}
```

### 3. Mapping Relationships Preloading

```javascript
async function preloadPopularMappings() {
  console.log("Preloading popular ICD-10 to CPT mappings...");
  const startTime = Date.now();
  
  // Get the most frequently accessed mappings
  const popularMappings = await db.query(`
    SELECT 
      m.*,
      COALESCE(s.access_count, 0) as access_count
    FROM 
      medical_cpt_icd10_mappings m
    LEFT JOIN 
      mapping_usage_stats s ON m.icd10_code = s.icd10_code
    ORDER BY 
      s.access_count DESC NULLS LAST,
      m.appropriateness_score DESC
    LIMIT 10000
  `);
  
  // Group mappings by ICD-10 code for efficient caching
  const mappingsByICD10 = {};
  
  for (const mapping of popularMappings.rows) {
    if (!mappingsByICD10[mapping.icd10_code]) {
      mappingsByICD10[mapping.icd10_code] = [];
    }
    
    mappingsByICD10[mapping.icd10_code].push(mapping);
  }
  
  let processedCodes = 0;
  
  // Process each ICD-10 code's mappings
  for (const [icd10Code, mappings] of Object.entries(mappingsByICD10)) {
    const pipeline = redisClient.pipeline();
    const hashKey = `mapping:icd10-to-cpt:${icd10Code}`;
    const zsetKey = `mapping:icd10-to-cpt:scored:${icd10Code}`;
    
    // Clear any existing mapping data
    pipeline.del(hashKey);
    pipeline.del(zsetKey);
    
    // Add each mapping both as hash entry and sorted set entry
    for (const mapping of mappings) {
      // Calculate composite score for ranking
      const compositeScore = 
        (mapping.appropriateness_score * 0.4) +
        (mapping.evidence_strength * 0.3) +
        (mapping.specialty_relevance * 0.2) +
        (mapping.patient_factors * 0.1);
      
      // Store full mapping data in hash
      pipeline.hset(
        hashKey,
        mapping.cpt_code,
        JSON.stringify({
          icd10Code: mapping.icd10_code,
          appropriatenessScore: mapping.appropriateness_score,
          evidenceStrength: mapping.evidence_strength,
          specialtyRelevance: mapping.specialty_relevance,
          patientFactors: mapping.patient_factors,
          compositeScore: compositeScore
        })
      );
      
      // Store in sorted set for score-based retrieval
      pipeline.zadd(zsetKey, compositeScore, mapping.cpt_code);
    }
    
    // Set TTL on both structures
    pipeline.expire(hashKey, 86400); // 24 hours
    pipeline.expire(zsetKey, 86400);
    
    // Also track which ICD-10 codes have mappings preloaded
    pipeline.sadd('cache:mappings:preloaded:icd10codes', icd10Code);
    
    await pipeline.exec();
    processedCodes++;
    
    if (processedCodes % 100 === 0) {
      console.log(`Processed mappings for ${processedCodes} ICD-10 codes...`);
    }
  }
  
  await redisClient.set('cache:mappings:preloaded:count', processedCodes.toString());
  await redisClient.set('cache:mappings:preloaded:timestamp', Date.now().toString());
  
  const duration = (Date.now() - startTime) / 1000;
  console.log(`Preloaded mappings for ${processedCodes} ICD-10 codes in ${duration.toFixed(2)} seconds`);
}
```

### 4. Search Index Creation

```javascript
async function buildSearchIndices() {
  console.log("Building search indices in Redis...");
  const startTime = Date.now();
  
  // Clear any existing search indices
  const existingKeys = await redisClient.keys('search:index:*');
  if (existingKeys.length > 0) {
    const pipeline = redisClient.pipeline();
    existingKeys.forEach(key => pipeline.del(key));
    await pipeline.exec();
    console.log(`Cleared ${existingKeys.length} existing search indices`);
  }
  
  // Build indices for different search targets
  await buildICD10SearchIndex();
  await buildCPTSearchIndex();
  await buildProcedureSearchIndex();
  
  const duration = (Date.now() - startTime) / 1000;
  console.log(`Search indices built in ${duration.toFixed(2)} seconds`);
}

async function buildICD10SearchIndex() {
  console.log("Building ICD-10 search index...");
  
  // Get fields needed for search indexing
  const codes = await db.query(`
    SELECT 
      code, 
      description, 
      category,
      specialty,
      clinical_notes
    FROM 
      medical_icd10_codes
    LIMIT 20000
  `);
  
  const pipeline = redisClient.pipeline();
  let indexedCount = 0;
  
  for (const code of codes.rows) {
    // Create inverted index for each searchable field
    
    // Index by code (with high precision)
    pipeline.sadd(`search:index:icd10:code:${code.code.toLowerCase()}`, code.code);
    
    // Index by words in description
    if (code.description) {
      const words = code.description.toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .split(/\s+/)
        .filter(w => w.length > 2); // Skip very short words
      
      words.forEach(word => {
        pipeline.sadd(`search:index:icd10:word:${word}`, code.code);
      });
    }
    
    // Index clinical notes if available (with lower weight)
    if (code.clinical_notes) {
      const clinicalWords = code.clinical_notes.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3); // Higher threshold for clinical notes
      
      clinicalWords.forEach(word => {
        pipeline.sadd(`search:index:icd10:clinical:${word}`, code.code);
      });
    }
    
    // Store the complete indexed object for retrieval
    pipeline.set(
      `search:index:icd10:object:${code.code}`,
      JSON.stringify(code),
      'EX',
      86400
    );
    
    indexedCount++;
    
    if (indexedCount % 1000 === 0) {
      await pipeline.exec();
      console.log(`Indexed ${indexedCount} ICD-10 codes...`);
      pipeline.pipeline();
    }
  }
  
  if (indexedCount % 1000 !== 0) {
    await pipeline.exec();
  }
  
  console.log(`Completed indexing ${indexedCount} ICD-10 codes for search`);
  await redisClient.set('cache:search:index:icd10:count', indexedCount.toString());
}

// Similar functions for CPT and procedure search indices
// ...
```

### 5. Autocomplete System Initialization

```javascript
async function initializeAutocompleteSystem() {
  console.log("Initializing autocomplete system...");
  const startTime = Date.now();
  
  // Check if existing index is present and still valid
  const indexSize = await redisClient.zcard('autocomplete:icd10');
  const indexTimestamp = await redisClient.get('cache:autocomplete:timestamp');
  
  const isIndexValid = indexSize > 0 && indexTimestamp && 
    (Date.now() - parseInt(indexTimestamp)) < (7 * 24 * 60 * 60 * 1000); // 7 days
  
  if (isIndexValid) {
    console.log(`Existing autocomplete index with ${indexSize} entries is still valid`);
    return;
  }
  
  // Clear existing autocomplete data
  const autocompletePrefixes = await redisClient.keys('autocomplete:*');
  if (autocompletePrefixes.length > 0) {
    const pipeline = redisClient.pipeline();
    autocompletePrefixes.forEach(key => pipeline.del(key));
    await pipeline.exec();
    console.log(`Cleared ${autocompletePrefixes.length} existing autocomplete keys`);
  }
  
  // Build autocomplete indices for different code types
  await buildICD10AutocompleteIndex();
  await buildCPTAutocompleteIndex();
  
  await redisClient.set('cache:autocomplete:timestamp', Date.now().toString());
  
  const duration = (Date.now() - startTime) / 1000;
  console.log(`Autocomplete system initialized in ${duration.toFixed(2)} seconds`);
}

async function buildICD10AutocompleteIndex() {
  console.log("Building ICD-10 autocomplete index...");
  
  // Get all ICD-10 codes and descriptions
  const allCodes = await db.query('SELECT code, description FROM medical_icd10_codes');
  
  const pipeline = redisClient.pipeline();
  let count = 0;
  
  for (const row of allCodes.rows) {
    const { code, description } = row;
    
    // Index the code itself with high score
    pipeline.zadd('autocomplete:icd10', 100, code.toLowerCase());
    
    // Index each word in the description with lower scores
    const words = description.toLowerCase().split(/\s+/);
    words.forEach((word, index) => {
      if (word.length > 2) { // Skip very short words
        // Score decreases with word position (first words more important)
        const wordScore = 80 - (index * 5);
        pipeline.zadd('autocomplete:icd10', wordScore, word);
      }
    });
    
    // Index prefixes of the code for partial matching
    for (let i = 1; i <= code.length; i++) {
      const prefix = code.slice(0, i).toLowerCase();
      pipeline.zadd('autocomplete:prefix:icd10', 90, prefix);
    }
    
    // Store word/token mappings for reverse lookup
    words.forEach(word => {
      if (word.length > 2) {
        pipeline.sadd(`autocomplete:word:${word}`, code);
      }
    });
    
    count++;
    
    if (count % 1000 === 0) {
      await pipeline.exec();
      console.log(`Indexed ${count} codes for autocomplete...`);
      pipeline.pipeline();
    }
  }
  
  if (count % 1000 !== 0) {
    await pipeline.exec();
  }
  
  console.log(`Built autocomplete index with ${count} ICD-10 entries`);
}

// Similar function for CPT autocomplete
// ...
```

## Performance Optimization Features

### 1. Batch Processing

The preloading process uses Redis pipelining to batch operations:

```javascript
// Instead of sending each command individually:
// await redisClient.set(key1, value1);
// await redisClient.set(key2, value2);
// ...

// The system batches commands for efficiency:
const pipeline = redisClient.pipeline();
for (let i = 0; i < items.length; i++) {
  pipeline.set(keys[i], values[i]);
  
  // Execute in batches of 100 to balance memory usage and performance
  if (i % 100 === 0) {
    await pipeline.exec();
    pipeline.pipeline(); // Reset pipeline
  }
}
// Execute remaining commands
await pipeline.exec();
```

### 2. Smart Data Selection

The system preloads only the most valuable data:

```javascript
// Selection criteria weighted by multiple factors
const selectivePreloadQuery = `
  SELECT *
  FROM medical_icd10_codes
  WHERE
    -- Preload common codes
    is_common = true
    -- Or codes that have been accessed recently
    OR (last_accessed > NOW() - INTERVAL '30 days')
    -- Or codes that have high access counts
    OR (access_count > 50)
  ORDER BY
    -- Prioritize by a weighted formula
    (CASE WHEN is_common THEN 100 ELSE 0 END) +
    (CASE WHEN last_accessed > NOW() - INTERVAL '7 days' THEN 50 ELSE 0 END) +
    (access_count * 0.5)
  DESC
  LIMIT 5000
`;
```

### 3. Memory Management

The system includes mechanisms to prevent memory overload:

```javascript
async function ensureAvailableMemory() {
  // Check Redis memory usage
  const info = await redisClient.info('memory');
  const usedMemoryMatch = info.match(/used_memory:(\d+)/);
  
  if (usedMemoryMatch) {
    const usedMemoryBytes = parseInt(usedMemoryMatch[1]);
    const usedMemoryMB = usedMemoryBytes / (1024 * 1024);
    
    // If memory usage is too high, selectively evict less important data
    if (usedMemoryMB > 900) { // 900MB threshold
      console.log(`Redis memory usage high (${usedMemoryMB.toFixed(2)}MB), performing selective eviction`);
      
      // Evict lowest priority data first
      await evictLowPriorityData();
    }
  }
}

async function evictLowPriorityData() {
  // Evict cached search results (they can be recalculated)
  const searchKeys = await redisClient.keys('search:results:*');
  if (searchKeys.length > 0) {
    await redisClient.del(...searchKeys);
    console.log(`Evicted ${searchKeys.length} cached search results`);
  }
  
  // Evict least frequently accessed CPT codes
  const leastUsedCPTCodes = await redisClient.zrange('cpt:usage:frequency', 0, 499);
  if (leastUsedCPTCodes.length > 0) {
    const pipeline = redisClient.pipeline();
    leastUsedCPTCodes.forEach(code => {
      pipeline.del(`cpt:code:${code}`);
    });
    await pipeline.exec();
    console.log(`Evicted ${leastUsedCPTCodes.length} least used CPT codes`);
  }
  
  // Other eviction strategies as needed...
}
```

## Scheduled Jobs to Keep Data Fresh

The application uses scheduled jobs to keep Redis data fresh:

```javascript
// From server/services/schedulerService.ts
function setupCacheMaintenanceJobs() {
  // Update high-priority cache items every 6 hours
  schedule.scheduleJob('0 */6 * * *', async () => {
    console.log("Running scheduled cache refresh for high-priority items");
    await updateFrequentlyUsedCodes();
  });
  
  // Full cache rebuild once a week during off-hours
  schedule.scheduleJob('0 3 * * 0', async () => {
    console.log("Running weekly full cache rebuild");
    await initializeRedisCache({ force: true });
  });
  
  // Hourly cleanup of expired keys and memory management
  schedule.scheduleJob('15 * * * *', async () => {
    console.log("Running hourly cache maintenance");
    await performCacheMaintenance();
  });
}

async function performCacheMaintenance() {
  // Check memory usage and evict if needed
  await ensureAvailableMemory();
  
  // Update usage statistics
  await updateCacheUsageStats();
  
  // Remove expired keys that Redis might have missed
  await cleanupExpiredKeys();
}
```

This comprehensive preloading approach ensures the Redis cache is efficiently populated with the most relevant medical code data, optimized for the application's specific access patterns and query requirements.