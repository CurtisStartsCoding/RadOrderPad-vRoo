/**
 * Test Advanced RediSearch Features
 * 
 * This script tests enhanced fuzzy matching and phonetic matching
 * to evaluate their effectiveness before implementation.
 */

const Redis = require('ioredis');
const fs = require('fs');

// Redis Cloud connection details
const redisHost = 'redis-11584.crce197.us-east-2-1.ec2.redns.redis-cloud.com';
const redisPort = 11584;
const redisPassword = 'zHUbspGPcewJsoT9G9TSQncuSl0v0MUH';

// Create a log file
const logFile = 'debug-scripts/redis-optimization/advanced-features-results.log';
let logOutput = '';

// Function to log to both console and file
function log(message) {
  console.log(message);
  logOutput += message + '\n';
}

const client = new Redis({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  tls: {}
});

// Add performance measurement
const { performance } = require('perf_hooks');

// Test medical terms with common misspellings or variations
const testTerms = [
  { term: 'angiogram', variations: ['angeogram', 'angiograms', 'angigrm'] },
  { term: 'arthritis', variations: ['arthritus', 'arthrtis', 'artritis'] },
  { term: 'magnetic resonance imaging', variations: ['magntic resonance', 'mri', 'magnetic resonence'] },
  { term: 'cardiomyopathy', variations: ['cardiomypathy', 'cardimyopathy', 'cardiac myopathy'] },
  { term: 'osteoarthritis', variations: ['osteoarthritus', 'osteo arthritis', 'osteoarthrosis'] }
];

/**
 * Test basic search without fuzzy matching
 */
async function testBasicSearch(indexName, term) {
  try {
    const startTime = performance.now();
    const result = await client.call(
      'FT.SEARCH',
      indexName,
      `@description:(${term})`,
      'WITHSCORES',
      'LIMIT', '0', '5'
    );
    const endTime = performance.now();
    
    return {
      count: result[0],
      time: endTime - startTime,
      results: result.slice(1)
    };
  } catch (error) {
    log(`Error in basic search: ${error.message}`);
    return { count: 0, time: 0, results: [] };
  }
}

/**
 * Test standard fuzzy matching with %term%
 */
async function testStandardFuzzy(indexName, term) {
  try {
    const fuzzyTerm = `%${term}%`;
    const startTime = performance.now();
    const result = await client.call(
      'FT.SEARCH',
      indexName,
      `@description:(${fuzzyTerm})`,
      'WITHSCORES',
      'LIMIT', '0', '5'
    );
    const endTime = performance.now();
    
    return {
      count: result[0],
      time: endTime - startTime,
      results: result.slice(1)
    };
  } catch (error) {
    log(`Error in standard fuzzy search: ${error.message}`);
    return { count: 0, time: 0, results: [] };
  }
}

/**
 * Test enhanced fuzzy matching with configurable edit distance
 */
async function testEnhancedFuzzy(indexName, term, distance = 2) {
  try {
    const fuzzyTerm = `%${term}%{$fuzzy: ${distance}}`;
    const startTime = performance.now();
    const result = await client.call(
      'FT.SEARCH',
      indexName,
      `@description:(${fuzzyTerm})`,
      'WITHSCORES',
      'LIMIT', '0', '5'
    );
    const endTime = performance.now();
    
    return {
      count: result[0],
      time: endTime - startTime,
      results: result.slice(1)
    };
  } catch (error) {
    log(`Error in enhanced fuzzy search: ${error.message}`);
    return { count: 0, time: 0, results: [] };
  }
}

/**
 * Test if phonetic matching is available in the current index
 */
async function testPhoneticMatching(indexName, term) {
  try {
    const startTime = performance.now();
    const result = await client.call(
      'FT.SEARCH',
      indexName,
      `@description:(${term})=>{$phonetic: true}`,
      'WITHSCORES',
      'LIMIT', '0', '5'
    );
    const endTime = performance.now();
    
    return {
      count: result[0],
      time: endTime - startTime,
      results: result.slice(1)
    };
  } catch (error) {
    log(`Error in phonetic search: ${error.message}`);
    return { count: 0, time: 0, results: [] };
  }
}

/**
 * Run all tests for a given term
 */
async function runTestsForTerm(indexName, originalTerm, variations) {
  log(`\n=== TESTING TERM: "${originalTerm}" ===`);
  
  // Test original term with basic search
  log(`\n1. Basic search for "${originalTerm}"`);
  const basicResults = await testBasicSearch(indexName, originalTerm);
  log(`   Results: ${basicResults.count} (${basicResults.time.toFixed(2)}ms)`);
  if (basicResults.count > 0) {
    log(`   First result: ${basicResults.results[0]} Score: ${basicResults.results[1]}`);
  }
  
  // Test original term with standard fuzzy
  log(`\n2. Standard fuzzy search for "%${originalTerm}%"`);
  const standardFuzzyResults = await testStandardFuzzy(indexName, originalTerm);
  log(`   Results: ${standardFuzzyResults.count} (${standardFuzzyResults.time.toFixed(2)}ms)`);
  if (standardFuzzyResults.count > 0) {
    log(`   First result: ${standardFuzzyResults.results[0]} Score: ${standardFuzzyResults.results[1]}`);
  }
  
  // Test original term with enhanced fuzzy
  log(`\n3. Enhanced fuzzy search for "%${originalTerm}%{$fuzzy: 2}"`);
  const enhancedFuzzyResults = await testEnhancedFuzzy(indexName, originalTerm);
  log(`   Results: ${enhancedFuzzyResults.count} (${enhancedFuzzyResults.time.toFixed(2)}ms)`);
  if (enhancedFuzzyResults.count > 0) {
    log(`   First result: ${enhancedFuzzyResults.results[0]} Score: ${enhancedFuzzyResults.results[1]}`);
  }
  
  // Test original term with phonetic matching
  log(`\n4. Phonetic search for "${originalTerm}"`);
  const phoneticResults = await testPhoneticMatching(indexName, originalTerm);
  log(`   Results: ${phoneticResults.count} (${phoneticResults.time.toFixed(2)}ms)`);
  if (phoneticResults.count > 0) {
    log(`   First result: ${phoneticResults.results[0]} Score: ${phoneticResults.results[1]}`);
  }
  
  // Test variations
  log(`\n=== TESTING VARIATIONS FOR "${originalTerm}" ===`);
  
  for (const variation of variations) {
    log(`\n--- Variation: "${variation}" ---`);
    
    // Basic search with variation
    log(`1. Basic search for "${variation}"`);
    const varBasicResults = await testBasicSearch(indexName, variation);
    log(`   Results: ${varBasicResults.count} (${varBasicResults.time.toFixed(2)}ms)`);
    
    // Standard fuzzy with variation
    log(`2. Standard fuzzy search for "%${variation}%"`);
    const varStandardFuzzyResults = await testStandardFuzzy(indexName, variation);
    log(`   Results: ${varStandardFuzzyResults.count} (${varStandardFuzzyResults.time.toFixed(2)}ms)`);
    
    // Enhanced fuzzy with variation
    log(`3. Enhanced fuzzy search for "%${variation}%{$fuzzy: 2}"`);
    const varEnhancedFuzzyResults = await testEnhancedFuzzy(indexName, variation);
    log(`   Results: ${varEnhancedFuzzyResults.count} (${varEnhancedFuzzyResults.time.toFixed(2)}ms)`);
    
    // Phonetic matching with variation
    log(`4. Phonetic search for "${variation}"`);
    const varPhoneticResults = await testPhoneticMatching(indexName, variation);
    log(`   Results: ${varPhoneticResults.count} (${varPhoneticResults.time.toFixed(2)}ms)`);
  }
}

/**
 * Main test function
 */
async function runTests() {
  try {
    log('=== TESTING ADVANCED SEARCH FEATURES ===');
    
    // Get available indices
    const indices = await client.call('FT._LIST');
    log(`Available indices: ${JSON.stringify(indices)}`);
    
    // Choose an index to test with
    const indexName = 'idx:cpt'; // Change as needed
    log(`Using index: ${indexName}`);
    
    // Get index info to check if phonetic matching is supported
    const indexInfo = await client.call('FT.INFO', indexName);
    log(`Index type: ${indexInfo[indexInfo.indexOf('key_type') + 1]}`);
    
    // Check if phonetic matching is supported
    const schemaIndex = indexInfo.indexOf('attributes');
    let phoneticSupported = false;
    
    if (schemaIndex >= 0) {
      const schemaCount = indexInfo[schemaIndex + 1];
      log(`Schema has ${schemaCount} fields:`);
      
      for (let i = 0; i < schemaCount; i++) {
        const fieldInfo = indexInfo[schemaIndex + 2 + i];
        if (fieldInfo.includes('PHONETIC')) {
          phoneticSupported = true;
          log(`Phonetic matching is supported on field: ${fieldInfo[1]}`);
        }
      }
    }
    
    if (!phoneticSupported) {
      log('WARNING: Phonetic matching is not supported in the current index schema.');
      log('Phonetic search tests will likely fail or return 0 results.');
    }
    
    // Run tests for each term
    for (const { term, variations } of testTerms) {
      await runTestsForTerm(indexName, term, variations);
    }
    
    // Summary
    log('\n=== TEST SUMMARY ===');
    log('1. Basic search: Exact match only');
    log('2. Standard fuzzy search: Uses %term% for edit distance of 1');
    log('3. Enhanced fuzzy search: Uses %term%{$fuzzy: 2} for configurable edit distance');
    log('4. Phonetic search: Uses phonetic matching for similar sounding terms');
    
    if (!phoneticSupported) {
      log('\nTo enable phonetic matching, the index schema needs to be updated with the PHONETIC attribute:');
      log(`
await client.call(
  'FT.CREATE', 'idx:cpt', 'ON', 'JSON', 'PREFIX', '1', 'cpt:code:',
  'SCHEMA',
  '$.description', 'AS', 'description', 'TEXT', 'WEIGHT', '5.0', 'PHONETIC', 'dm:en',
  // Other fields...
);`);
    }
    
  } catch (error) {
    log(`Error running tests: ${error.message}`);
    console.error(error);
  } finally {
    // Write log to file
    fs.writeFileSync(logFile, logOutput);
    log(`Results written to ${logFile}`);
    client.quit();
  }
}

// Run the tests
runTests();