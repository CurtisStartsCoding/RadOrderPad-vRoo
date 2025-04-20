# Redis Integration Strategy

**Version:** 1.3 (Updated Fallback Logic)
**Date:** 2025-04-20

This document outlines how **Redis Cloud (hosted on AWS)**, leveraging the **RedisSearch and RedisJSON modules**, is used to accelerate performance and enable advanced search capabilities in RadOrderPad.

---

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
    *   Key: `icd10:{icd10_code}` (e.g., `icd10:M25.511`)
    *   Value: JSON object representing the `medical_icd10_codes` row (stored using `JSON.SET`).
    *   TTL: Long (e.g., 7 days). Indexed by RedisSearch on `description`, `keywords`, `category`.
-   **CPT Codes:**
    *   Key: `cpt:{cpt_code}` (e.g., `cpt:73221`)
    *   Value: JSON object representing the `medical_cpt_codes` row (stored using `JSON.SET`).
    *   TTL: Long (e.g., 7 days). Indexed by RedisSearch on `description`, `modality`, `body_part`.
-   **ICD-10 / CPT Mappings:**
    *   Key: `mapping:{icd10_code}:{cpt_code}` (e.g., `mapping:M25.511:73221`)
    *   Value: JSON object representing the relevant `medical_cpt_icd10_mappings` row (stored using `JSON.SET`).
    *   TTL: Medium (e.g., 1-3 days). Potentially indexed by RedisSearch if needed.
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

## 5. RedisSearch for Context Generation (Core Strategy)

-   **Indexing:** Create RedisSearch indexes (`FT.CREATE ON JSON...`) on the ICD-10 and CPT code JSON data stored in the **Redis Cloud database**. Index relevant fields like `description`, `keywords`, `modality`, `body_part`, `category`.
-   **Querying:** The `dbContextGenerator` component within the `ValidationEngine` will primarily use RedisSearch `FT.SEARCH` queries based on *extracted keywords* from the physician's dictation. This replaces reliance on simple key lookups or complex/slow PostgreSQL queries for finding relevant codes.
-   **Example Query:** `FT.SEARCH cpt_index "@description|keywords:(shoulder pain) @modality:(MRI)"` or `FT.SEARCH icd10_index "@description|keywords:(fatigue|joint\ pain|dry\ eye)"` (Syntax might need slight adjustment based on client library and exact schema).
-   **Benefit:** Enables near real-time (<10-20ms typical) retrieval of contextually relevant medical codes based on free-text input, significantly speeding up the validation process and improving the quality of context provided to the LLM.

## 6. Fallback Mechanism

The system implements a robust fallback mechanism to ensure database context is always generated, even when Redis is unavailable or returns insufficient results:

-   **Primary Path:** The system first attempts to use RedisSearch to find relevant ICD-10 codes, CPT codes, mappings, and markdown docs based on the extracted keywords.
-   **Fallback Triggers:** The PostgreSQL fallback is triggered in any of the following scenarios:
    1. **Redis Connection Failure:** If the Redis connection test fails or throws an error.
    2. **Redis Operation Error:** If any Redis operation (search, get, etc.) fails or throws an error.
    3. **Insufficient Results:** If RedisSearch returns no ICD-10 codes AND no CPT codes, indicating that the search did not find relevant medical context.
-   **Fallback Implementation:** When fallback is triggered, the system:
    1. Logs that the PostgreSQL fallback is being used, including the reason.
    2. Executes PostgreSQL queries to find relevant ICD-10 codes, CPT codes, mappings, and markdown docs.
    3. Formats the database context using the same formatter as the Redis path.
-   **Result:** The LLM always receives database context, whether from Redis or PostgreSQL, ensuring consistent validation quality.

## 7. Implementation Considerations

-   **Client Library:** Use a robust Redis client library for Node.js (e.g., `ioredis`, `node-redis v4+`) that supports custom commands required by **RedisJSON (`JSON.SET`, `JSON.GET`)** and **RedisSearch (`FT.SEARCH`, `FT.CREATE`)**, and crucially allows **TLS/SSL connection configuration**.
-   **Connection Handling:** Implement proper connection logic using the specific **Redis Cloud endpoint hostname, port, and password**. **TLS must be enabled** in the client configuration. Use connection pooling provided by the library and implement error handling/reconnection strategies.
-   **Serialization:** Use JSON for storing structured code data via `JSON.SET`/`JSON.GET`.
-   **TTL Management:** Manage TTLs appropriately for cached data. Indexed JSON data might not need a TTL if updates are handled via re-indexing or invalidation.
-   **Index Management:** Implement logic (e.g., a script `create-redis-indexes.ts`) to create (`FT.CREATE`) and update RedisSearch indexes when the underlying reference data in PostgreSQL changes or during initial data load to Redis Cloud.
-   **VPC/Network Access:** Ensure the application environment (e.g., EC2 instance, Lambda function) has network access to the Redis Cloud endpoint. This typically involves configuring Security Groups and potentially NAT Gateways or VPC Endpoints, and allow-listing the application's egress IP in the Redis Cloud database settings.
-   **Monitoring:** Monitor **Redis Cloud metrics** (via the Redis Cloud UI/API) for performance, memory usage, latency, and command execution. Monitor application-level metrics (cache hit/miss rates) and relevant AWS infrastructure metrics (EC2/Lambda CPU/Network, NAT Gateway traffic) via CloudWatch.

## 8. Implementation Documentation

For detailed implementation information, including code examples, configuration details, and testing procedures, please refer to the following document:

- [Redis Integration Implementation](./implementation/redis-integration.md) - Comprehensive documentation of the Redis Cloud integration implementation, including Redis client configuration, RedisJSON and RedisSearch integration, data models, search indexes, testing, and security considerations.