# Redis Integration Strategy

**Version:** 1.1 (MemoryDB Prioritized for RedisSearch)
**Date:** 2025-04-13

This document outlines how AWS MemoryDB for Redis (leveraging the RedisSearch module) is used to accelerate performance and enable advanced search capabilities in RadOrderPad.

---

## 1. Purpose

-   **Reduce Database Load:** Minimize direct queries to PostgreSQL for frequently accessed, relatively static data via key-value caching.
-   **Improve API Latency:** Provide sub-millisecond lookups for cached data.
-   **Enable Fast Context Generation:** Utilize **RedisSearch** for advanced, real-time indexing and querying of medical code descriptions (ICD-10, CPT), keywords, and potentially markdown documentation based on extracted clinical terms.

## 2. Service Choice

-   **Primary Choice: AWS MemoryDB for Redis:** This service is selected as the primary integration choice due to its **native support for Redis Modules, including RedisSearch**. MemoryDB provides a durable, highly available, Redis-compatible, in-memory database service managed by AWS. Its ability to run RedisSearch enables the required fast, text-based querying and indexing crucial for advanced context generation, while also supporting standard key-value caching. MemoryDB is HIPAA Eligible.
-   **Alternative (Not Chosen): AWS ElastiCache for Redis:** While suitable for basic key-value caching and potentially lower cost, standard ElastiCache does not offer straightforward or guaranteed support for the RedisSearch module across all instance types, making it unsuitable for the advanced search requirements of this project.

## 3. Caching Strategy: Cache-Aside

*(This pattern applies to the key-value caching aspect)*

-   **Read Operation:**
    1.  Application attempts to fetch data from MemoryDB first using a specific key (e.g., `cpt:73221`).
    2.  **Cache Hit:** Data is found in MemoryDB. Return data directly to the application.
    3.  **Cache Miss:** Data is not found in MemoryDB.
        a.  Application queries the primary PostgreSQL database (`radorder_main`).
        b.  Application stores the result retrieved from PostgreSQL into MemoryDB with an appropriate Time-To-Live (TTL).
        c.  Return data to the application.
-   **Write Operation (for reference data like ICD/CPT):**
    *   Data is typically loaded/updated via batch processes or administrative actions.
    *   After updating PostgreSQL, the corresponding MemoryDB cache entry should be **invalidated** (deleted) or **updated**. Invalidation is often simpler. The next read operation will trigger a cache miss and repopulate the cache. Simultaneously, the RedisSearch index needs to be updated or the document re-indexed if using RedisSearch for this data.

## 4. Data Stored & Key Schema

*(Data stored in MemoryDB, accessible via standard Redis commands OR RedisSearch commands)*

-   **ICD-10 Codes:**
    *   Key: `icd10:{icd10_code}` (e.g., `icd10:M25.511`)
    *   Value: JSON string representing the `medical_icd10_codes` row.
    *   TTL: Long (e.g., 7 days). Indexed by RedisSearch on `description`, `keywords`, `category`.
-   **CPT Codes:**
    *   Key: `cpt:{cpt_code}` (e.g., `cpt:73221`)
    *   Value: JSON string representing the `medical_cpt_codes` row.
    *   TTL: Long (e.g., 7 days). Indexed by RedisSearch on `description`, `modality`, `body_part`.
-   **ICD-10 / CPT Mappings:**
    *   Key: `mapping:{icd10_code}:{cpt_code}` (e.g., `mapping:M25.511:73221`)
    *   Value: JSON string representing the relevant `medical_cpt_icd10_mappings` row.
    *   TTL: Medium (e.g., 1-3 days). Potentially indexed by RedisSearch if needed.
-   **ICD-10 Markdown Docs:**
    *   Key: `markdown:{icd10_code}` (e.g., `markdown:M75.101`)
    *   Value: String containing the markdown content.
    *   TTL: Medium (e.g., 3 days). Potentially indexed by RedisSearch on content.
-   **Validation Context (Optional Cache):**
    *   Key: `context:{hash_of_keywords_or_dictation}`
    *   Value: JSON string containing the *aggregated* set of relevant ICDs, CPTs, mappings, and markdown needed for a specific validation input (results from RedisSearch queries).
    *   TTL: Short (e.g., 1 hour or less). Avoids re-querying RedisSearch/DB.
-   **Full Validation Result (Optional Cache):**
    *   Key: `validation_result:{hash_of_dictation}`
    *   Value: JSON string of the final validation result (including LLM output).
    *   TTL: Very short (e.g., 5-30 minutes).

## 5. RedisSearch for Context Generation (Core Strategy)

-   **Indexing:** Create RedisSearch indexes on the ICD-10 and CPT code data stored in MemoryDB (specifically on fields like `description`, `keywords`, `modality`, `body_part`, `category`).
-   **Querying:** The `dbContextGenerator` component within the `ValidationEngine` will primarily use RedisSearch `FT.SEARCH` queries based on *extracted keywords* from the physician's dictation. This replaces reliance on simple key lookups or complex/slow PostgreSQL queries for finding relevant codes.
-   **Example Query:** `FT.SEARCH cpt_index "@description:(shoulder pain) @modality:MRI"` or `FT.SEARCH icd10_index "@keywords:(fatigue|joint pain|dry eye)"`
-   **Benefit:** Enables near real-time (<10-20ms) retrieval of contextually relevant medical codes based on free-text input, significantly speeding up the validation process and improving the quality of context provided to the LLM.

## 6. Implementation Considerations

-   **Client Library:** Use a robust Redis client library for Node.js (`ioredis`) or Python (`redis-py`) that supports custom commands required by RedisSearch (e.g., `FT.SEARCH`, `FT.CREATE`).
-   **Connection Handling:** Implement proper connection pooling and error handling for the MemoryDB cluster endpoint.
-   **Serialization:** Use JSON for storing structured code data.
-   **TTL Management:** Manage TTLs appropriately for cached data vs. indexed data (indexed data might not need a TTL if updated via invalidation).
-   **Index Management:** Implement logic to create and update RedisSearch indexes when the underlying reference data in PostgreSQL changes. This might involve background jobs or triggers within the data update process.
-   **Monitoring:** Monitor MemoryDB metrics (memory usage, CPU, network, latency, cache hit rate for non-Search keys) via CloudWatch.