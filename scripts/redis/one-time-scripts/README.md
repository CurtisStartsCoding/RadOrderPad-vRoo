# Redis One-Time Scripts

This directory contains scripts that were used during the development and implementation of the Redis search fix and weighted search functionality. These scripts are kept for reference but are not needed for regular operation of the system.

## Scripts

- `check-redis-data.js` - Script to check the data stored in Redis
- `test-redis-search-direct.js` - Script to test Redis search directly
- `check-index-schema.js` - Script to check the schema of Redis indexes
- `fix-redis-search-queries.js` - Script to fix Redis search queries
- `implement-redis-search-fix.js` - Script to implement the Redis search fix
- `test-fixed-implementation.js` - Script to test the fixed implementation

## Batch Files

- `run-redis-tests.bat` - Batch file to run Redis tests
- `apply-redis-search-fix.bat` - Batch file to apply the Redis search fix
- `run-test-fixed-implementation.bat` - Batch file to run the test for the fixed implementation
- `run-weighted-search.bat` - Batch file to run the weighted search test
- `implement-weighted-search.js` - Script to implement the weighted search

## Usage

These scripts are not intended for regular use. They were used during the development and implementation of the Redis search fix and weighted search functionality. They are kept here for reference.

If you need to recreate the Redis indexes or test the Redis search functionality, please use the scripts in the parent directory:

- `create-mapping-markdown-indexes.js` - Script to create the mapping and markdown indexes
- `test-weighted-search-all.js` - Script to test the weighted search for all data types