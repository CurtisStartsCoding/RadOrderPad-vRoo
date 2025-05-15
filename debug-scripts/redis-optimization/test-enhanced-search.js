/**
 * Test Enhanced Redis Search Features
 * 
 * This script tests the enhanced Redis search features:
 * 1. Fixed weighted search syntax
 * 2. Phonetic matching
 * 3. Enhanced search term processing
 */

const Redis = require('ioredis');
const fs = require('fs');

// Redis Cloud connection details
const redisHost = 'redis-11584.crce197.us-east-2-1.ec2.redns.redis-cloud.com';
const redisPort = 11584;
const redisPassword = 'zHUbspGPcewJsoT9G9TSQncuSl0v0MUH';

// Create a log file
const logFile = 'debug-scripts/redis-optimization/enhanced-search-results.log';
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
 * Process search terms (similar to the enhanced function in common.ts)
 */
function processSearchTerms(keywords) {
  // Filter out very short terms (less than 3 chars) to avoid noise
  const filteredKeywords = keywords.filter(kw => kw.length >= 3);
  
  // Sanitize and join with OR operator
  return filteredKeywords
    .map(kw => kw.replace(/[^a-zA-Z0-9]/g, ' '))
    .join('|');
}

/**
 * Test enhanced search with fixed weighted syntax and phonetic matching
 */
async function testEnhancedSearch(indexName, term) {
  try {
    const searchTerms = processSearchTerms([term]);
    
    // Use the fixed weighted syntax with phonetic matching
    const query = `@description:(${searchTerms})=>{$weight:5.0, $phonetic:true} | @body_part:(${searchTerms})=>{$weight:3.0, $phonetic:true}`;
    
    const startTime = performance.now();
    const result = await client.call(
      'FT.SEARCH',
      indexName,
      query,
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
    log(`Error in enhanced search: ${error.message}`);
    return { count: 0, time: 0, results: [] };
  }
}

/**
 * Run tests for a given term
 */
async function runTestsForTerm(indexName, originalTerm, variations) {
  log(`\n=== TESTING TERM: "${originalTerm}" ===`);
  
  // Test original term with enhanced search
  log(`\n1. Enhanced search for "${originalTerm}" with fixed weighted syntax and phonetic matching`);
  const enhancedResults = await testEnhancedSearch(indexName, originalTerm);
  log(`   Results: ${enhancedResults.count} (${enhancedResults.time.toFixed(2)}ms)`);
  if (enhancedResults.count > 0) {
    log(`   First result: ${enhancedResults.results[0]} Score: ${enhancedResults.results[1]}`);
  }
  
  // Test variations
  log(`\n=== TESTING VARIATIONS FOR "${originalTerm}" ===`);
  
  for (const variation of variations) {
    log(`\n--- Variation: "${variation}" ---`);
    
    // Enhanced search with variation
    log(`Enhanced search for "${variation}" with fixed weighted syntax and phonetic matching`);
    const varEnhancedResults = await testEnhancedSearch(indexName, variation);
    log(`   Results: ${varEnhancedResults.count} (${varEnhancedResults.time.toFixed(2)}ms)`);
    if (varEnhancedResults.count > 0) {
      log(`   First result: ${varEnhancedResults.results[0]} Score: ${varEnhancedResults.results[1]}`);
    }
  }
}

/**
 * Main test function
 */
async function runTests() {
  try {
    log('=== TESTING ENHANCED SEARCH FEATURES ===');
    
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
      log('Please run the server to recreate the indices with phonetic matching support.');
    }
    
    // Run tests for each term
    for (const { term, variations } of testTerms) {
      await runTestsForTerm(indexName, term, variations);
    }
    
    // Summary
    log('\n=== TEST SUMMARY ===');
    log('1. Fixed weighted syntax: Uses @field:(term)=>{$weight:n.0, $phonetic:true}');
    log('2. Phonetic matching: Enabled in the index schema with PHONETIC attribute');
    log('3. Enhanced search term processing: Filters out terms less than 3 characters');
    
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