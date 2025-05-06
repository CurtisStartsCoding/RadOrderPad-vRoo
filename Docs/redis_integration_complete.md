# Redis Integration Strategy

**Version:** 2.0 (Complete Implementation)
**Date:** 2025-05-05

This document outlines how **Redis Cloud (hosted on AWS)**, leveraging the **RedisSearch and RedisJSON modules**, is used to accelerate performance and enable advanced search capabilities in RadOrderPad.

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Service Choice](#2-service-choice)
3. [Caching Strategy: Cache-Aside](#3-caching-strategy-cache-aside)
4. [Data Stored & Key Schema](#4-data-stored--key-schema)
5. [RedisSearch for Context Generation](#5-redissearch-for-context-generation)
6. [Search Query Implementation](#6-search-query-implementation)
7. [Weighted Search Implementation](#7-weighted-search-implementation)
8. [Fallback Mechanism](#8-fallback-mechanism)
9. [Implementation Considerations](#9-implementation-considerations)
10. [Automatic Population on Server Startup](#10-automatic-population-on-server-startup)
10. [Integration with Validation Engine](#10-integration-with-validation-engine)
11. [Testing](#11-testing)
12. [Implementation Documentation](#12-implementation-documentation)

## 1. Purpose

-   **Reduce Database Load:** Minimize direct queries to PostgreSQL for frequently accessed, relatively static data via key-value caching.
-   **Improve API Latency:** Provide sub-millisecond lookups for cached data.
-   **Enable Fast Context Generation:** Utilize **RedisSearch** for advanced, real-time indexing and querying of medical code descriptions (ICD-10, CPT), keywords, and potentially markdown documentation based on extracted clinical terms. Utilize **RedisJSON** for efficient storage and retrieval of structured code data.

## 2. Service Choice

-   **Primary Choice: Redis Cloud (Hosted on AWS):** This platform is selected as the primary integration choice due to its **native support for Redis Modules, including RedisSearch and RedisJSON**, which are essential for the project's advanced indexing, querying, and structured data storage requirements. Redis Cloud provides a durable, highly available, fully managed Redis service running on AWS infrastructure (in the chosen region, e.g., `us-east-2`), ensuring low latency relative to the application components potentially running in the same AWS region. Redis Cloud can be configured to meet HIPAA eligibility requirements.
-   **Incorrect Alternatives Considered:** AWS MemoryDB and AWS ElastiCache for Redis were previously considered but ultimately **rejected** for this project's core needs because they **do not offer native support for the required RedisSearch module**, making them unsuitable for the advanced context generation strategy. While suitable for basic key-value caching, they lack the necessary search and indexing capabilities provided by Redis Cloud modules.

## 3. Caching Strategy: Cache-Aside

*(This pattern applies to the key-value caching aspect within the Redis Cloud database)*

-   **Read Operation:**
    1.  Application attempts to fetch data from the **Redis Cloud database** first using a specific key (e.g., `cpt:73221`).
    2.  **Cache Hit:** Data is found. Return data directly to the application.
    3.  **Cache Miss:** Data is not found.
        a.  Application queries the primary PostgreSQL database (`radorder_main`).
        b.  Application stores the result retrieved from PostgreSQL into the **Redis Cloud database** (likely using `JSON.SET` for structured data) with an appropriate Time-To-Live (TTL).
        c.  Return data to the application.
-   **Write Operation (for reference data like ICD/CPT):**
    *   Data is typically loaded/updated via batch processes or administrative actions.
    *   After updating PostgreSQL, the corresponding **Redis Cloud cache entry** should be **invalidated** (deleted using `DEL` or `JSON.DEL`) or **updated** (`JSON.SET`). Invalidation is often simpler. The next read operation will trigger a cache miss and repopulate the cache. Simultaneously, if the data is indexed by RedisSearch, the index needs to be updated or the document re-indexed.

## 4. Data Stored & Key Schema

*(Data stored in the Redis Cloud database, accessible via standard Redis commands, RedisJSON commands, OR RedisSearch commands)*

-   **ICD-10 Codes:**
    *   Key: `icd10:code:{icd10_code}` (e.g., `icd10:code:M25.511`)
    *   Value: Hash representing the `medical_icd10_codes` row (stored using `HSET`).
    *   TTL: None (persistent). Indexed by RedisSearch on `description`, `keywords`, `category`.
-   **CPT Codes:**
    *   Key: `cpt:code:{cpt_code}` (e.g., `cpt:code:73221`)
    *   Value: Hash representing the `medical_cpt_codes` row (stored using `HSET`).
    *   TTL: None (persistent). Indexed by RedisSearch on `description`, `modality`, `body_part`.
-   **ICD-10 / CPT Mappings:**
    *   Key: `mapping:icd10-to-cpt:{icd10_code}` (e.g., `mapping:icd10-to-cpt:M25.511`)
    *   Value: Hash representing the relevant `medical_cpt_icd10_mappings` rows (stored using `HSET`).
    *   TTL: None (persistent). Potentially indexed by RedisSearch if needed.
-   **ICD-10 Markdown Docs:**
    *   Key: `markdown:{icd10_code}` (e.g., `markdown:M75.101`)
    *   Value: String containing the markdown content (stored using `SET`).
    *   TTL: Medium (e.g., 3 days). Potentially indexed by RedisSearch on content (`FT.CREATE ... ON HASH ...` might be needed if storing differently, or index TEXT field if stored as JSON).
-   **Validation Context (Optional Cache):**
    *   Key: `context:{hash_of_keywords_or_dictation}`
    *   Value: JSON string containing the aggregated set of relevant ICDs, CPTs, mappings, and markdown needed for a specific validation input (results from RedisSearch queries).
    *   TTL: Short (e.g., 1 hour or less). Avoids re-querying RedisSearch/DB.
-   **Full Validation Result (Optional Cache):**
    *   Key: `validation_result:{hash_of_dictation}`
    *   Value: JSON string of the final validation result (including LLM output).
    *   TTL: Very short (e.g., 5-30 minutes).

## 5. RedisSearch for Context Generation

-   **Indexing:** Create RedisSearch indexes (`FT.CREATE ON HASH...`) on the ICD-10 and CPT code hash data stored in the **Redis Cloud database**. Index relevant fields like `description`, `keywords`, `modality`, `body_part`, `category`.
-   **Querying:** The `dbContextGenerator` component within the `ValidationEngine` will primarily use RedisSearch `FT.SEARCH` queries based on *extracted keywords* from the physician's dictation. This replaces reliance on simple key lookups or complex/slow PostgreSQL queries for finding relevant codes.
-   **Benefit:** Enables near real-time (<10-20ms typical) retrieval of contextually relevant medical codes based on free-text input, significantly speeding up the validation process and improving the quality of context provided to the LLM.

## 6. Search Query Implementation

The RedisSearch implementation uses a simple query format without field specifiers for optimal results:

### Index Structure

- RedisSearch indexes are created with hash field names like `description`, `keywords`, etc.
- Each field has a weight assigned to it (e.g., description has weight 5.0, keywords has weight 2.0)

### Query Format

The implemented query format uses simple search terms without field specifiers:

```typescript
// Simple format (searches across all indexed fields)
const searchQuery = searchTerms;
```

This approach is more robust as it searches across all indexed fields and leverages the weights defined in the index.

### Example Queries

```typescript
// Search for ICD-10 codes
const icd10Results = await redisClient.call(
  'FT.SEARCH', 'icd10_idx', 'shoulder pain',
  'LIMIT', '0', '10'
);

// Search for CPT codes
const cptResults = await redisClient.call(
  'FT.SEARCH', 'cpt_idx', 'MRI shoulder',
  'LIMIT', '0', '10'
);
```

## 7. Weighted Search Implementation

The system implements weighted search using Redis's built-in weighting capabilities:

### Index Weights

- **CPT Index:**
  - `description` has weight 5.0
  - `modality` and `body_part` are TAG fields

- **ICD-10 Index:**
  - `description` has weight 5.0
  - `keywords` has weight 2.0

- **Mapping Index:**
  - `icd10_description` with weight 3.0
  - `cpt_description` with weight 3.0
  - `refined_justification` with weight 5.0
  - `evidence_source` with weight 2.0

- **Markdown Index:**
  - `icd10_description` with weight 3.0
  - `content` with weight 5.0
  - `content_preview` with weight 2.0

### Weighted Search Functions

The implementation includes functions that return search results with relevance scores:

## 10. Automatic Population on Server Startup

To ensure Redis is always populated with the necessary data, the server automatically populates Redis during startup:

### Population Process

1. **Initialization Sequence:**
   - Server starts
   - Database connections are established
   - Redis search indices are created
   - Redis population function is called

2. **Population Function:**
   - Located in `src/utils/cache/redis-populate.ts`
   - Checks if Redis already has data (to avoid unnecessary repopulation)
   - If empty, fetches data from PostgreSQL tables:
     - `medical_cpt_codes`
     - `medical_icd10_codes`
     - `medical_cpt_icd10_mappings`
     - `medical_icd10_markdown_docs`
   - Stores data in Redis using the correct key formats
   - Uses batch operations for efficiency

3. **Key Format Consistency:**
   - Ensures all data is stored with the correct key formats:
     - `cpt:code:{cpt_code}`
     - `icd10:code:{icd10_code}`
     - `mapping:icd10-to-cpt:{icd10_code}`
   - This matches the key formats used in the service files

### Benefits

- **No Manual Intervention:** Redis is automatically populated on server startup
- **Resilience:** If Redis data is lost (e.g., Redis restart), it will be repopulated on next server start
- **Efficiency:** Only populates if Redis is empty, avoiding unnecessary database queries
- **Consistency:** Ensures key formats match between storage and retrieval

- `searchCPTCodesWithScores`: Search for CPT codes with scores
- `searchICD10CodesWithScores`: Search for ICD-10 codes with scores
- `getMappingsWithScores`: Get mappings with scores
- `getMarkdownDocsWithScores`: Get markdown docs with scores

These functions use the `WITHSCORES` option in RedisSearch to get relevance scores for each result.

### Usage Example

```typescript
// Search for CPT codes with scores
const cptResults = await searchCPTCodesWithScores(keywords);

// Sort by score
cptResults.sort((a, b) => b.score - a.score);

// Get top results
const topResults = cptResults.slice(0, 5);
```

## 8. Fallback Mechanism

The system implements a robust fallback mechanism to ensure database context is always generated, even when Redis is unavailable or returns insufficient results:

### Multi-tier Fallback Strategy

1. **Primary: Redis Weighted Search**
   - First attempt to use RedisSearch with weighted scoring

2. **Secondary: PostgreSQL Weighted Search**
   - Falls back to PostgreSQL with weighted scoring if Redis fails

3. **Tertiary: Original PostgreSQL Search**
   - Uses non-weighted search as a last resort

4. **Quaternary: LLM without context**
   - In extreme cases, the LLM can still function with minimal context

### Fallback Triggers

The PostgreSQL fallback is triggered in any of the following scenarios:

1. **Redis Connection Failure:** If the Redis connection test fails or throws an error.
2. **Redis Operation Error:** If any Redis operation (search, get, etc.) fails or throws an error.
3. **Insufficient Results:** If RedisSearch returns no ICD-10 codes AND no CPT codes, indicating that the search did not find relevant medical context.

### PostgreSQL Weighted Search

The PostgreSQL weighted search uses SQL queries with CASE expressions to calculate scores:

```sql
SELECT
  cpt_code,
  description,
  modality,
  body_part,
  (
    5.0 * (CASE WHEN description ILIKE '%keyword%' THEN 1 ELSE 0 END) +
    3.0 * (CASE WHEN body_part ILIKE '%keyword%' THEN 1 ELSE 0 END) +
    3.0 * (CASE WHEN modality ILIKE '%keyword%' THEN 1 ELSE 0 END)
  ) AS score
FROM
  medical_cpt_codes
WHERE
  description ILIKE '%keyword%' OR
  body_part ILIKE '%keyword%' OR
  modality ILIKE '%keyword%'
ORDER BY
  score DESC
```

This approach ensures that even when Redis is unavailable, the system still benefits from weighted search capabilities, maintaining high accuracy in matching clinical indications to the right CPT and ICD-10 codes.

## 9. Implementation Considerations

-   **Client Library:** Use a robust Redis client library for Node.js (e.g., `ioredis`, `node-redis v4+`) that supports custom commands required by **RedisJSON (`JSON.SET`, `JSON.GET`)** and **RedisSearch (`FT.SEARCH`, `FT.CREATE`)**, and crucially allows **TLS/SSL connection configuration**.
-   **Connection Handling:** Implement proper connection logic using the specific **Redis Cloud endpoint hostname, port, and password**. **TLS must be enabled** in the client configuration. Use connection pooling provided by the library and implement error handling/reconnection strategies.
-   **Serialization:** Use JSON for storing structured code data via `JSON.SET`/`JSON.GET`.
-   **TTL Management:** Manage TTLs appropriately for cached data. Indexed JSON data might not need a TTL if updates are handled via re-indexing or invalidation.
-   **Index Management:** Implement logic (e.g., a script `create-redis-indexes.ts`) to create (`FT.CREATE`) and update RedisSearch indexes when the underlying reference data in PostgreSQL changes or during initial data load to Redis Cloud.
-   **VPC/Network Access:** Ensure the application environment (e.g., EC2 instance, Lambda function) has network access to the Redis Cloud endpoint. This typically involves configuring Security Groups and potentially NAT Gateways or VPC Endpoints, and allow-listing the application's egress IP in the Redis Cloud database settings.
-   **Monitoring:** Monitor **Redis Cloud metrics** (via the Redis Cloud UI/API) for performance, memory usage, latency, and command execution. Monitor application-level metrics (cache hit/miss rates) and relevant AWS infrastructure metrics (EC2/Lambda CPU/Network, NAT Gateway traffic) via CloudWatch.

## 10. Integration with Validation Engine

The weighted search implementation is fully integrated with the validation engine:

### Implementation Details

1. **Weighted Context Generator:**
   - `src/utils/database/redis-context-generator-weighted.ts` uses the weighted search functions
   - Logs the top results with scores for debugging purposes

2. **Database Index Integration:**
   - `src/utils/database/index.ts` imports from `redis-context-generator-weighted.ts`
   - This ensures that the validation engine uses the weighted search functions

3. **Benefits in Validation:**
   - More relevant ICD-10 and CPT codes are prioritized
   - Mappings between codes are ranked by relevance
   - Markdown documents with the most relevant content are selected
   - Overall improved accuracy in the validation process

### Validation Flow

1. When a validation request is received, the validation engine extracts keywords from the text
2. The weighted Redis context generator uses these keywords to search for relevant medical codes
3. The weighted search functions return results with relevance scores
4. The results are sorted by score, ensuring the most relevant results are used
5. The context is formatted and used in the LLM prompt
6. The LLM uses this context to validate the medical order

## 11. Testing

The implementation includes comprehensive testing:

### Test Scripts

1. `scripts/redis/test-fixed-implementation.js`: Tests the basic search implementation
2. `scripts/redis/implement-weighted-search.js`: Tests weighted search for CPT and ICD-10 codes
3. `scripts/redis/test-weighted-search-all.js`: Tests weighted search for all data types
4. `tests/test-validation-with-weighted-search.js`: Tests the validation engine with weighted search

### Running Tests

1. Run `scripts/redis/run-test-fixed-implementation.bat` to test the basic search implementation
2. Run `scripts/redis/run-create-mapping-markdown-indexes.bat` to create the mapping and markdown indexes
3. Run `scripts/redis/run-test-weighted-search-all.bat` to test weighted search for all data types
4. Run `tests/run-validation-with-weighted-search.bat` to test the validation engine with weighted search

### Code Quality Checks

The implementation has been thoroughly tested for code quality:

1. **TypeScript Type Checking**
   - All files pass TypeScript's static type checking
   - No type errors or warnings reported

2. **ESLint Compliance**
   - All files comply with the project's ESLint rules
   - No linting issues reported

3. **Build Verification**
   - The project builds successfully with the new code
   - No compilation errors reported

4. **Automated Testing**
   - Tests verify that both Redis and PostgreSQL weighted search are working correctly
   - Tests confirm that the validation engine is using the weighted search
   - Tests validate the fallback mechanism

## 12. Implementation Documentation

For detailed implementation information, including code examples, configuration details, and testing procedures, please refer to the following document:

- [Redis Integration Implementation](./implementation/redis-integration.md) - Comprehensive documentation of the Redis Cloud integration implementation, including Redis client configuration, RedisJSON and RedisSearch integration, data models, search indexes, testing, and security considerations.