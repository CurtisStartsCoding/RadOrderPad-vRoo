# Redis Search Fix and Weighted Search Implementation

This document explains the Redis search fix and weighted search implementation for the medical code validation system.

## Table of Contents

1. [Redis Search Fix](#redis-search-fix)
2. [Weighted Search Implementation](#weighted-search-implementation)
3. [Mapping and Markdown Search](#mapping-and-markdown-search)
4. [Integration with Validation Engine](#integration-with-validation-engine)
5. [Testing](#testing)
6. [Usage Guide](#usage-guide)

## Redis Search Fix

### The Issue

The Redis search functionality wasn't returning any results despite having data in Redis. The issue was with the query format used for RedisSearch - the application was using field specifiers like `@description:(term)`, but this format doesn't work with the way the indexes were created.

### The Solution

We fixed this by:

1. Updating the search implementation to use the simple format (no field specifier) for search queries
2. Modifying the index.ts file to use the fixed versions of the search files

### Files Modified

- `src/utils/redis/search/cpt-search-fix.ts`
- `src/utils/redis/search/icd10-search-fix.ts`
- `src/utils/redis/search/index.ts`

### Example of Fix

Before:
```typescript
const descriptionQuery = `@description:(${searchTerms})`;
```

After:
```typescript
const descriptionQuery = searchTerms;
```

## Weighted Search Implementation

We implemented weighted search using Redis's built-in weighting capabilities. The Redis indexes already have weights defined:

- CPT Index:
  - `$.description` has weight 5.0
  - `$.modality` and `$.body_part` are TAG fields

- ICD-10 Index:
  - `$.description` has weight 5.0
  - `$.keywords` has weight 2.0

### Weighted Search Functions

We created new functions that return search results with relevance scores:

- `searchCPTCodesWithScores`: Search for CPT codes with scores
- `searchICD10CodesWithScores`: Search for ICD-10 codes with scores

These functions use the `WITHSCORES` option in RedisSearch to get relevance scores for each result.

### Files Added

- `src/utils/redis/search/weighted-search.ts`

## Mapping and Markdown Search

We extended the weighted search implementation to include mappings and markdown documents:

1. Created RedisSearch indexes for mappings and markdown documents
2. Implemented weighted search functions for these data types
3. Updated the index.ts file to export the new functions

### New Indexes

- Mapping Index:
  - `$.icd10_description` with weight 3.0
  - `$.cpt_description` with weight 3.0
  - `$.refined_justification` with weight 5.0
  - `$.evidence_source` with weight 2.0

- Markdown Index:
  - `$.icd10_description` with weight 3.0
  - `$.content` with weight 5.0
  - `$.content_preview` with weight 2.0

### Files Added

- `scripts/redis/create-mapping-markdown-indexes.js`
- `src/utils/redis/search/mapping-search-weighted.ts`
- `src/utils/redis/search/markdown-search-weighted.ts`

## Integration with Validation Engine

We've fully integrated the weighted search into the validation engine to improve the accuracy of the validation process. This ensures that the most relevant medical codes and mappings are used when generating context for the LLM.

### Implementation Details

1. Created a weighted version of the Redis context generator:
   - `src/utils/database/redis-context-generator-weighted.ts`
   - This version uses the weighted search functions instead of the regular search functions
   - It logs the top results with scores for debugging purposes

2. Updated the database index to use the weighted version:
   - Modified `src/utils/database/index.ts` to import from `redis-context-generator-weighted.ts`
   - This ensures that the validation engine uses the weighted search functions

3. Benefits of the weighted search in validation:
   - More relevant ICD-10 and CPT codes are prioritized
   - Mappings between codes are ranked by relevance
   - Markdown documents with the most relevant content are selected
   - Overall improved accuracy in the validation process

### How It Works

1. When a validation request is received, the validation engine extracts keywords from the text
2. The weighted Redis context generator uses these keywords to search for relevant medical codes
3. The weighted search functions return results with relevance scores
4. The results are sorted by score, ensuring the most relevant results are used
5. The context is formatted and used in the LLM prompt
6. The LLM uses this context to validate the medical order

## Testing

We created several test scripts to verify the fix and test the weighted search implementation:

1. `scripts/redis/test-fixed-implementation.js`: Tests the basic search fix
2. `scripts/redis/implement-weighted-search.js`: Tests weighted search for CPT and ICD-10 codes
3. `scripts/redis/test-weighted-search-all.js`: Tests weighted search for all data types
4. `tests/test-validation-with-weighted-search.js`: Tests the validation engine with weighted search

### Running the Tests

1. Run `scripts/redis/run-test-fixed-implementation.bat` to test the basic search fix
2. Run `scripts/redis/run-create-mapping-markdown-indexes.bat` to create the mapping and markdown indexes
3. Run `scripts/redis/run-test-weighted-search-all.bat` to test weighted search for all data types
4. Run `tests/run-validation-with-weighted-search.bat` to test the validation engine with weighted search

## Usage Guide

To integrate the weighted search into your codebase:

1. Import the weighted search functions:

```typescript
import { 
  searchCPTCodesWithScores, 
  searchICD10CodesWithScores,
  getMappingsWithScores,
  getMarkdownDocsWithScores
} from '../utils/redis/search';
```

2. Use the functions in your code:

```typescript
// Search for CPT codes with scores
const cptResults = await searchCPTCodesWithScores(keywords);

// Search for ICD-10 codes with scores
const icd10Results = await searchICD10CodesWithScores(keywords);

// Get mappings with scores
const mappingResults = await getMappingsWithScores(icd10Results, cptResults, keywords);

// Get markdown docs with scores
const markdownResults = await getMarkdownDocsWithScores(icd10Results, keywords);
```

3. Access the scores in the results:

```typescript
// Sort by score
cptResults.sort((a, b) => b.score - a.score);

// Get top results
const topResults = cptResults.slice(0, 5);

// Display scores
for (const result of topResults) {
  console.log(`${result.cpt_code}: ${result.description} (Score: ${result.score})`);
}
```

This implementation will significantly improve the accuracy of your system when matching clinical indications to the right CPT and ICD-10 codes, as it leverages the weighted fields in your Redis indexes to provide more relevant results.

## PostgreSQL Weighted Search Fallback

To ensure consistent behavior and optimal performance even when Redis is unavailable, we've implemented a weighted search fallback for PostgreSQL that mirrors the Redis weighted search functionality:

### Key Features

1. **Weighted Field Scoring**
   - Assigns weights to different fields (e.g., description, clinical notes, body part)
   - Calculates relevance scores based on keyword matches and field weights
   - Returns results sorted by relevance score

2. **Multi-tier Fallback Strategy**
   - Primary: Redis Weighted Search
   - Secondary: PostgreSQL Weighted Search
   - Tertiary: Original PostgreSQL Search (non-weighted)
   - Quaternary: LLM without context

3. **Consistent Result Format**
   - Both Redis and PostgreSQL weighted search return results with scores
   - Same data structure for seamless integration

### Implementation Details

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

## Code Quality Checks

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
   - The implementation has been tested with automated tests
   - Tests verify that both Redis and PostgreSQL weighted search are working correctly
   - Tests confirm that the validation engine is using the weighted search
   - Tests validate the fallback mechanism

Two batch files are provided to run tests:
- `run-code-checks.bat` - Runs all code quality checks in sequence
- `run-postgres-weighted-search-test.bat` - Tests the PostgreSQL weighted search implementation