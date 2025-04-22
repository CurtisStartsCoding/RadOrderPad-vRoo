# Redis Scripts

This directory contains scripts for working with Redis in the medical code validation system.

## Core Scripts

- `create-mapping-markdown-indexes.js` - Creates Redis indexes for mappings and markdown documents
- `run-create-mapping-markdown-indexes.bat` - Batch file to run the create-mapping-markdown-indexes.js script
- `test-weighted-search-all.js` - Tests the weighted search for all data types
- `run-test-weighted-search-all.bat` - Batch file to run the test-weighted-search-all.js script

## Utility Scripts

- `check-redis.js` - Checks the Redis connection
- `test-redis-connection.js` - Tests the Redis connection
- `check-redis-indexes.js` - Checks the Redis indexes
- `check-redis-indexes-fixed.js` - Checks the Redis indexes with the fixed implementation
- `create-redis-indexes.js` - Creates Redis indexes

## Data Population Scripts

- `populate-redis.js` - Populates Redis with data
- `populate-redis-targeted.js` - Populates Redis with targeted data
- `populate-redis-full.js` - Populates Redis with all data
- `populate-redis-cpt-batch.js` - Populates Redis with CPT codes in batch
- `populate-redis-icd10-batch.js` - Populates Redis with ICD-10 codes in batch
- `populate-redis-mappings-batch.js` - Populates Redis with mappings in batch
- `populate-redis-markdown-batch.js` - Populates Redis with markdown documents in batch
- `populate-redis-all-batch.js` - Populates Redis with all data in batch
- `populate-redis-full-batch.js` - Populates Redis with all data in batch

## Test Scripts

- `test-redis-search-query.js` - Tests Redis search queries
- `test-redis-search-query-fix.js` - Tests Redis search query fixes
- `test-redis-search-implementation.js` - Tests Redis search implementation
- `test-redis-search-fix-direct.js` - Tests Redis search fix directly
- `test-redis-postgres-fallback-combined.js` - Tests Redis with PostgreSQL fallback

## One-Time Scripts

See the [one-time-scripts](./one-time-scripts) directory for scripts that were used during the development and implementation of the Redis search fix and weighted search functionality.