# Redis Indexing Documentation

## Overview
The Redis implementation in this project uses RedisSearch to index medical data (CPT codes, ICD-10 codes, mappings, and markdown documentation) for fast context generation during LLM validation.

## Current Implementation

### Main Population Function
The primary Redis population function is located at:
- Source: `src/utils/cache/redis-populate.ts`
- Compiled: `dist/utils/cache/redis-populate.js`

This function (`populateRedisFromPostgres()`) indexes **ALL** database records without any limits:
- `SELECT * FROM medical_cpt_codes`
- `SELECT * FROM medical_icd10_codes`
- `SELECT * FROM medical_cpt_icd10_mappings`
- `SELECT * FROM medical_icd10_markdown_docs`

### Test Scripts with Limits
There are several test scripts in `scripts/redis/` that have LIMIT clauses:
- `populate-redis.js` - Limited to 100 records per table
- `populate-redis-targeted.js` - Limited to 100 shoulder-related records

## How to Ensure Full Indexing

### Option 1: Use the Repopulation Script (Recommended)
Run the full repopulation script that clears Redis and repopulates with ALL records:

```bash
# Windows
scripts\redis\repopulate-redis-all.bat

# Unix/Linux/Mac
./scripts/redis/repopulate-redis-all.sh
```

### Option 2: Restart the Server
The server automatically populates Redis on startup if it's empty:
1. Clear Redis data
2. Restart the server
3. The `populateRedisFromPostgres()` function will run automatically

### Option 3: Manual Population
```bash
# Navigate to project root
cd /path/to/project

# Run the repopulation script directly
node scripts/redis/repopulate-redis-all.js
```

## Verifying Redis Population

After population, you can verify the record counts:

```bash
# Check Redis keys count
redis-cli --tls -h <your-redis-host> -p <your-redis-port> -a <your-redis-password> DBSIZE

# Or use the test scripts
node tests/test-redis-basic.js
```

## Important Notes

1. **Batch Processing**: The population function processes records in batches of 1000 to avoid memory issues
2. **No TTL**: Records are stored without expiration to ensure data persistence
3. **JSON Storage**: CPT and ICD-10 codes are stored as JSON documents for RedisSearch compatibility
4. **Automatic Check**: The server checks if Redis is populated on startup and only populates if needed

## Troubleshooting

If you're seeing limited records in Redis:
1. Check which script was used to populate Redis
2. Verify no LIMIT clauses were added to the queries
3. Ensure the database has all the expected records
4. Check Redis memory limits aren't preventing full population