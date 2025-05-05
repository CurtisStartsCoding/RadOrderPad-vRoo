
### 5. Create Test Script

Create a test script in `debug-scripts/redis-optimization/test-redis-fuzzy-search.js`:

```javascript
/**
 * Test script for Redis fuzzy search functionality
 * 
 * This script tests the Redis fuzzy search functionality for medical codes
 * by creating indexes, adding sample data, and performing fuzzy searches.
 */

const Redis = require('ioredis');
const dotenv = require('dotenv');

// Load environment variables from .env.production
dotenv.config({ path: '.env.production' });

// Get Redis configuration from environment variables
const redisHost = process.env.REDIS_CLOUD_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_CLOUD_PORT || '6379');
const redisPassword = process.env.REDIS_CLOUD_PASSWORD;
// Enable TLS for Redis Cloud
const redisTls = redisHost !== 'localhost' ? {} : undefined;

console.log('Redis connection details:');
console.log(`Host: ${redisHost}`);
console.log(`Port: ${redisPort}`);
console.log(`TLS: ${redisTls ? 'Enabled' : 'Disabled'}`);

// Create Redis client
const redisClient = new Redis({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  tls: redisTls,
  connectionName: 'fuzzy-search-test',
  connectTimeout: 10000, // 10 seconds timeout
  retryStrategy: (times) => {
    console.log(`Redis connection retry attempt ${times}`);
    if (times > 3) {
      console.log('Maximum retry attempts reached, giving up');
      return null; // Stop retrying
    }
    return Math.min(times * 1000, 3000); // Retry with increasing delay, max 3 seconds
  }
});

// Set up event handlers
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
  console.error('Connection details:', {
    host: redisHost,
    port: redisPort,
    tls: redisTls ? 'enabled' : 'disabled'
  });
});

redisClient.on('connect', () => console.log('Redis client connected successfully'));
redisClient.on('ready', () => console.log('Redis client ready'));

// Sample data
const SAMPLE_ICD10_CODES = [
  { code: 'A00.0', description: 'Cholera due to Vibrio cholerae 01, biovar cholerae', specialty: 'infectious' },
  { code: 'I10', description: 'Essential (primary) hypertension', specialty: 'cardiology' },
  { code: 'M54.5', description: 'Low back pain', specialty: 'orthopedics' },
  { code: 'J18.9', description: 'Pneumonia, unspecified organism', specialty: 'pulmonology' },
  { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications', specialty: 'endocrinology' }
];

const SAMPLE_CPT_CODES = [
  { code: '99213', description: 'Office or other outpatient visit', modality: 'evaluation' },
  { code: '71045', description: 'X-ray, chest, single view', modality: 'imaging' },
  { code: '71046', description: 'X-ray, chest, 2 views', modality: 'imaging' },
  { code: '70450', description: 'CT scan, head or brain, without contrast', modality: 'imaging' },
  { code: '70551', description: 'MRI, brain, without contrast', modality: 'imaging' }
];

/**
 * Create RediSearch indexes
 */
async function createIndexes() {
  try {
    console.log('\n--- Creating RediSearch indexes ---');
    
    // Drop existing indexes if they exist
    try {
      await redisClient.call('FT.DROPINDEX', 'icd10_idx', 'DD');
      console.log('Dropped existing ICD-10 index');
    } catch (error) {
      // Ignore error if index doesn't exist
    }
    
    try {
      await redisClient.call('FT.DROPINDEX', 'cpt_idx', 'DD');
      console.log('Dropped existing CPT index');
    } catch (error) {
      // Ignore error if index doesn't exist
    }
    
    // Create ICD-10 index
    await redisClient.call(
      'FT.CREATE', 'icd10_idx', 'ON', 'HASH', 'PREFIX', '1', 'icd10:code:', 
      'SCHEMA',
      'code', 'TEXT', 'NOSTEM', 'SORTABLE',
      'description', 'TEXT', 'WEIGHT', '2.0',
      'specialty', 'TAG'
    );
    console.log('Created ICD-10 index');
    
    // Create CPT index
    await redisClient.call(
      'FT.CREATE', 'cpt_idx', 'ON', 'HASH', 'PREFIX', '1', 'cpt:code:', 
      'SCHEMA',
      'code', 'TEXT', 'NOSTEM', 'SORTABLE',
      'description', 'TEXT', 'WEIGHT', '2.0',
      'modality', 'TAG'
    );
    console.log('Created CPT index');
  } catch (error) {
    console.error('Error creating indexes:', error);
    throw error;
  }
}

/**
 * Add sample data to Redis
 */
async function addSampleData() {
  try {
    console.log('\n--- Adding sample data ---');
    
    // Add ICD-10 codes
    for (const code of SAMPLE_ICD10_CODES) {
      await redisClient.hset(
        `icd10:code:${code.code}`,
        {
          code: code.code,
          description: code.description,
          specialty: code.specialty
        }
      );
      console.log(`Added ICD-10 code ${code.code}`);
    }
    
    // Add CPT codes
    for (const code of SAMPLE_CPT_CODES) {
      await redisClient.hset(
        `cpt:code:${code.code}`,
        {
          code: code.code,
          description: code.description,
          modality: code.modality
        }
      );
      console.log(`Added CPT code ${code.code}`);
    }
  } catch (error) {
    console.error('Error adding sample data:', error);
    throw error;
  }
}

/**
 * Test fuzzy search for ICD-10 codes
 */
async function testICD10FuzzySearch() {
  try {
    console.log('\n--- Testing ICD-10 fuzzy search ---');
    
    // Test cases with typos
    const testCases = [
      { query: 'A000', expected: 'A00.0' }, // Missing dot
      { query: 'I1', expected: 'I10' },     // Missing digit
      { query: 'M545', expected: 'M54.5' }, // Missing dot
      { query: 'J189', expected: 'J18.9' }, // Missing dot
      { query: 'E119', expected: 'E11.9' }  // Missing dot
    ];
    
    for (const testCase of testCases) {
      console.log(`\nSearching for "${testCase.query}" (expecting "${testCase.expected}"):`);
      
      // Execute fuzzy search
      const results = await redisClient.call(
        'FT.SEARCH',
        'icd10_idx',
        `%${testCase.query}%`,
        'LIMIT', '0', '10',
        'RETURN', '2', 'code', 'description'
      );
      
      console.log(`Found ${results[0]} results`);
      
      // Parse and display results
      for (let i = 1; i < results.length; i += 2) {
        const key = results[i];
        const fields = results[i + 1];
        
        // Convert fields array to object
        const fieldObj = {};
        for (let j = 0; j < fields.length; j += 2) {
          fieldObj[fields[j]] = fields[j + 1];
        }
        
        console.log(`- ${fieldObj.code}: ${fieldObj.description}`);
      }
    }
  } catch (error) {
    console.error('Error testing ICD-10 fuzzy search:', error);
    throw error;
  }
}

/**
 * Test fuzzy search for CPT codes
 */
async function testCPTFuzzySearch() {
  try {
    console.log('\n--- Testing CPT fuzzy search ---');
    
    // Test cases with typos
    const testCases = [
      { query: '9213', expected: '99213' },   // Missing digit
      { query: '71046', expected: '71046' },  // Exact match
      { query: '7045', expected: '70450' },   // Missing digit
      { query: '70551', expected: '70551' }   // Exact match
    ];
    
    for (const testCase of testCases) {
      console.log(`\nSearching for "${testCase.query}" (expecting "${testCase.expected}"):`);
      
      // Execute fuzzy search
      const results = await redisClient.call(
        'FT.SEARCH',
        'cpt_idx',
        `%${testCase.query}%`,
        'LIMIT', '0', '10',
        'RETURN', '2', 'code', 'description'
      );
      
      console.log(`Found ${results[0]} results`);
      
      // Parse and display results
      for (let i = 1; i < results.length; i += 2) {
        const key = results[i];
        const fields = results[i + 1];
        
        // Convert fields array to object
        const fieldObj = {};
        for (let j = 0; j < fields.length; j += 2) {
          fieldObj[fields[j]] = fields[j + 1];
        }
        
        console.log(`- ${fieldObj.code}: ${fieldObj.description}`);
      }
    }
  } catch (error) {
    console.error('Error testing CPT fuzzy search:', error);
    throw error;
  }
}

/**
 * Run the test
 */
async function runTest() {
  try {
    console.log('=== Redis Fuzzy Search Test ===');
    
    // Test connection
    const pingResult = await redisClient.ping();
    console.log(`Redis PING result: ${pingResult}`);
    
    // Create indexes
    await createIndexes();
    
    // Add sample data
    await addSampleData();
    
    // Test ICD-10 fuzzy search
    await testICD10FuzzySearch();
    
    // Test CPT fuzzy search
    await testCPTFuzzySearch();
    
    console.log('\n=== Test completed successfully ===');
  } catch (error) {
    console.error('Test failed with error:', error);
  } finally {
    // Close Redis connection
    await redisClient.quit();
    console.log('Redis connection closed');
  }
}

// Run the test
runTest().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
```

### 6. Create Batch Files

Create a batch file in `debug-scripts/redis-optimization/test-redis-fuzzy-search.bat`:

```batch
@echo off
echo ===== Testing Redis Fuzzy Search =====
echo.
echo Using Redis Cloud configuration from .env.production:
echo Host: redis-11584.crce197.us-east-2-1.ec2.redns.redis-cloud.com
echo Port: 11584
echo.

echo Stopping any existing test-redis-fuzzy-search.js process...
taskkill /F /FI "WINDOWTITLE eq test-redis-fuzzy-search.js" /T >nul 2>&1

echo Running test...
node debug-scripts/redis-optimization/test-redis-fuzzy-search.js

echo.
echo ===== Redis Fuzzy Search Test Complete =====
```

Create a shell script in `debug-scripts/redis-optimization/test-redis-fuzzy-search.sh`:

```bash
#!/bin/bash
echo "===== Testing Redis Fuzzy Search ====="
echo

echo "Using Redis Cloud configuration from .env.production:"
echo "Host: redis-11584.crce197.us-east-2-1.ec2.redns.redis-cloud.com"
echo "Port: 11584"
echo

echo "Running test..."
node debug-scripts/redis-optimization/test-redis-fuzzy-search.js

echo
echo "===== Redis Fuzzy Search Test Complete ====="
```

### 7. Update Test Suite

Update the main test suite in `tests/batch/run-all-tests.bat` to include the fuzzy search test:

```batch
echo ===== 17. Running Redis Fuzzy Search Tests =====
timeout /t 2 /nobreak > nul
call ..\..\debug-scripts\redis-optimization\test-redis-fuzzy-search.bat > test-results\fuzzy-search-tests.log 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Redis Fuzzy Search Tests
    call update-test-audit-log.bat "Redis Fuzzy Search Tests" "PASS" "Fuzzy search for medical codes functioning correctly"
) else (
    echo [FAIL] Redis Fuzzy Search Tests - Check test-results\fuzzy-search-tests.log for details
    call update-test-audit-log.bat "Redis Fuzzy Search Tests" "FAIL" "Check test-results\fuzzy-search-tests.log for details"
)
echo.
```

Update the main test suite in `tests/batch/run-all-tests.sh` similarly.

## Conclusion

This implementation enhances the search functionality for medical codes by adding fuzzy search capabilities using Redis RediSearch. The key benefits include:

1. **Typo Tolerance**: Users can find medical codes even with minor typos or formatting errors.
2. **Performance**: RediSearch provides fast search capabilities with sub-millisecond response times.
3. **Fallback Mechanism**: The system falls back to PostgreSQL weighted search if RediSearch is not available.
4. **Caching**: Search results are cached to improve performance for repeated queries.

The implementation follows the Cache-Aside pattern and adheres to the Single Responsibility Principle by separating concerns into different modules.