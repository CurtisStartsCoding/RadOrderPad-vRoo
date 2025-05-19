# Redis JSON Search Implementation

**Version:** 1.0
**Date:** 2025-05-19
**Author:** Engineering Team

This document outlines the implementation of Redis JSON Search in the RadOrderPad API backend, including the approaches that were tested and the final solution that was adopted.

## Table of Contents

1. [Overview](#1-overview)
2. [Approaches Tested](#2-approaches-tested)
3. [Final Implementation](#3-final-implementation)
4. [Performance Comparison](#4-performance-comparison)
5. [Implementation Details](#5-implementation-details)
6. [Testing](#6-testing)
7. [Conclusion](#7-conclusion)

## 1. Overview

Our application uses Redis as a caching layer and RediSearch for full-text search capabilities. We store medical data (CPT codes, ICD-10 codes, and Markdown documents) as JSON documents in Redis and use RediSearch to search this data efficiently.

The primary goal was to improve the API payload by providing more relevant search results through weighted search and context-aware querying.

## 2. Approaches Tested

We tested several approaches to implement weighted search in Redis:

### 2.1. Hash-Based Storage with Basic Search

**Implementation:**
- Data stored as Redis hashes using `HSET`
- Search using basic `FT.SEARCH` without field weights
- Query format: `@field:(term)`

**Issues:**
- Limited relevance ranking
- No field-specific weighting
- Inconsistent search results

### 2.2. Hash-Based Storage with Weighted Search

**Implementation:**
- Data stored as Redis hashes using `HSET`
- Search using `FT.SEARCH` with explicit field weights
- Query format: `(@field1:(term) WEIGHT 5.0) | (@field2:(term) WEIGHT 3.0)`

**Issues:**
- Syntax incompatible with JSON documents
- Required "fix" files to handle edge cases
- Inconsistent behavior between hash and JSON storage

### 2.3. JSON-Based Storage with Explicit Query Weights

**Implementation:**
- Data stored as JSON documents using `JSON.SET`
- Search using `FT.SEARCH` with explicit field weights in query
- Query format: `@field1:(term)=>{$weight:5.0} | @field2:(term)=>{$weight:3.0}`

**Issues:**
- Complex query syntax
- Redundant weight specification (already defined in schema)
- More code to maintain
- Potential for inconsistency if weights are specified differently in different places

### 2.4. JSON-Based Storage with Schema Weights (Final Solution)

**Implementation:**
- Data stored as JSON documents using `JSON.SET`
- Search using `FT.SEARCH` with weights defined in schema
- Query format: `@field1:(term) | @field2:(term)`
- Context-based field prioritization

**Benefits:**
- Simpler query syntax
- Weights defined once in schema, ensuring consistency
- Less code to maintain
- Potentially better performance (simpler query to parse)
- Flexibility through context-based field prioritization

## 3. Final Implementation

We chose to implement approach 2.4 (JSON-Based Storage with Schema Weights) with the following components:

1. **JSON Document Storage:**
   - CPT, ICD-10, and Markdown data stored as JSON documents using `JSON.SET`
   - Mappings stored as hashes (maintained for backward compatibility)

2. **Schema-Defined Weights:**
   - Weights defined in the schema when creating indices
   - Example weights:
     - Description fields: weight 5.0
     - Body part/keywords fields: weight 3.0
     - Clinical justification fields: weight 3.0
     - Content/notes fields: weight 1.0

3. **Context-Based Query Construction:**
   - Different field priorities based on search context (diagnosis/procedure/general)
   - Example: For diagnosis context, prioritize clinical information and description
   - Example: For procedure context, prioritize body part and modality

4. **Simplified Query Syntax:**
   - Rely on schema-defined weights instead of explicit weights in query
   - Format: `@field1:(term) | @field2:(term)`

## 4. Performance Comparison

| Approach | Query Complexity | Maintenance Overhead | Relevance Quality | Performance |
|----------|------------------|----------------------|-------------------|-------------|
| Hash-Based Basic | Low | Low | Poor | Good |
| Hash-Based Weighted | Medium | High | Medium | Medium |
| JSON with Query Weights | High | High | Good | Medium |
| JSON with Schema Weights | Low | Low | Good | Good |

## 5. Implementation Details

### 5.1. Index Creation

```typescript
// Create index with weights defined in schema
await client.call(
  'FT.CREATE', 'idx:cpt', 'ON', 'JSON', 'PREFIX', '1', 'cpt:code:',
  'SCHEMA',
  '$.cpt_code', 'AS', 'cpt_code', 'TAG', 'SORTABLE',
  '$.description', 'AS', 'description', 'TEXT', 'WEIGHT', '5.0',
  '$.body_part', 'AS', 'body_part', 'TEXT', 'WEIGHT', '3.0',
  '$.modality', 'AS', 'modality', 'TAG',
  '$.clinical_justification', 'AS', 'clinical_justification', 'TEXT', 'WEIGHT', '3.0',
  '$.key_findings', 'AS', 'key_findings', 'TEXT', 'WEIGHT', '2.0'
);
```

### 5.2. Data Storage

```typescript
// Store data as JSON document
await client.call('JSON.SET', `cpt:code:${cpt.cpt_code}`, '.', JSON.stringify(cpt));
```

### 5.3. Context-Based Query Construction

```typescript
// Adjust query based on context
let query = '';

if (context === 'diagnosis') {
  // For diagnosis searches, prioritize clinical information and description
  query = `@clinical_justification:(${searchTerms}) | @description:(${searchTerms}) | @body_part:(${searchTerms}) | @key_findings:(${searchTerms})`;
} else if (context === 'procedure') {
  // For procedure searches, prioritize body part and modality
  query = `@body_part:(${searchTerms}) | @modality:(${searchTerms}) | @description:(${searchTerms}) | @clinical_justification:(${searchTerms})`;
} else {
  // Default query using all fields
  query = `@description:(${searchTerms}) | @body_part:(${searchTerms}) | @clinical_justification:(${searchTerms}) | @key_findings:(${searchTerms})`;
}
```

### 5.4. Search Execution

```typescript
const result = await client.call(
  'FT.SEARCH',
  'idx:cpt',
  query,
  'WITHSCORES',
  'LIMIT', '0', limit.toString(),
  'RETURN', '6', '$.cpt_code', '$.description', '$.modality', '$.body_part', '$.clinical_justification', '$.key_findings'
);
```

## 6. Testing

We created several test scripts to verify the implementation:

1. `debug-scripts/redis-optimization/test-weighted-search.js`: Tests different query formats for weighted search
2. `debug-scripts/redis-optimization/test-weighted-search-improved.js`: Tests the improved weighted search implementation
3. `debug-scripts/redis-optimization/test-redis-json-search.js`: Tests Redis JSON storage and search functionality

The tests confirmed that:
- The JSON-based storage with schema weights approach provides the most consistent and relevant results
- Context-based query construction effectively prioritizes different fields based on the search context
- The simplified query syntax is more maintainable and performs well

## 7. Conclusion

The JSON-based storage with schema weights approach provides the best balance of performance, maintainability, and relevance for our Redis search implementation. By storing data as JSON documents, defining weights in the schema, and using context-based query construction, we've created a flexible and efficient search system that improves the API payload by providing more relevant search results.

This approach eliminates the need for "fix" files and complex query syntax, resulting in a more robust and maintainable solution. The context-aware querying ensures that the most relevant medical codes are returned for each search, improving the quality of the context provided to the LLM and ultimately enhancing the validation responses.