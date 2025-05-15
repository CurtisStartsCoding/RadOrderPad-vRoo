/**
 * Test Different Phonetic Matching Syntaxes
 * 
 * This script tests different syntaxes for phonetic matching in RediSearch
 */

const Redis = require('ioredis');
const fs = require('fs');

// Redis Cloud connection details
const redisHost = 'redis-11584.crce197.us-east-2-1.ec2.redns.redis-cloud.com';
const redisPort = 11584;
const redisPassword = 'zHUbspGPcewJsoT9G9TSQncuSl0v0MUH';

// Create a log file
const logFile = 'debug-scripts/redis-optimization/phonetic-syntax-results.log';
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

// Test medical terms with common misspellings
const testTerms = [
  { term: 'angiogram', variation: 'angeogram' },
  { term: 'arthritis', variation: 'arthritus' },
  { term: 'mri', variation: 'magntic resonance' }
];

/**
 * Process search terms
 */
function processSearchTerms(keywords) {
  return keywords.filter(kw => kw.length >= 3)
    .map(kw => kw.replace(/[^a-zA-Z0-9]/g, ' '))
    .join('|');
}

/**
 * Test different phonetic matching syntaxes
 */
async function testPhoneticSyntaxes(indexName, term) {
  log(`\n=== TESTING PHONETIC SYNTAXES FOR TERM: "${term}" ===\n`);
  
  const searchTerm = processSearchTerms([term]);
  
  // Test different syntaxes
  const syntaxes = [
    // Syntax 1: Using the $phonetic parameter
    {
      name: "Syntax 1: $phonetic parameter",
      query: `@description:(${searchTerm})=>{$weight:5.0, $phonetic:true}`
    },
    // Syntax 2: Using the %% for phonetic matching
    {
      name: "Syntax 2: %% for phonetic",
      query: `@description:(%%${searchTerm}%%)`
    },
    // Syntax 3: Using the * for phonetic matching
    {
      name: "Syntax 3: * for phonetic",
      query: `@description:(*${searchTerm}*)`
    },
    // Syntax 4: Using the ~ for phonetic matching
    {
      name: "Syntax 4: ~ for phonetic",
      query: `@description:(~${searchTerm}~)`
    },
    // Syntax 5: Using the $phonetic without true
    {
      name: "Syntax 5: $phonetic without true",
      query: `@description:(${searchTerm})=>{$weight:5.0, $phonetic}`
    },
    // Syntax 6: Using the %term% for fuzzy matching
    {
      name: "Syntax 6: %term% for fuzzy",
      query: `@description:(%${searchTerm}%)`
    },
    // Syntax 7: Using the separate phonetic parameter
    {
      name: "Syntax 7: separate phonetic parameter",
      query: `@description:(${searchTerm})=>{$weight:5.0}`,
      params: ['PHONETIC']
    },
    // Syntax 8: Using the separate phonetic parameter with field
    {
      name: "Syntax 8: separate phonetic parameter with field",
      query: `@description:(${searchTerm})=>{$weight:5.0}`,
      params: ['PHONETIC', 'description']
    }
  ];
  
  // Test each syntax
  for (const syntax of syntaxes) {
    log(`\n--- ${syntax.name} ---`);
    log(`Query: ${syntax.query}`);
    
    try {
      const startTime = performance.now();
      
      // Build the search command
      const searchCommand = ['FT.SEARCH', indexName, syntax.query, 'WITHSCORES', 'LIMIT', '0', '5'];
      
      // Add additional parameters if specified
      if (syntax.params) {
        searchCommand.push(...syntax.params);
      }
      
      const result = await client.call(...searchCommand);
      const endTime = performance.now();
      
      log(`Results: ${result[0]} (${(endTime - startTime).toFixed(2)}ms)`);
      
      if (result[0] > 0) {
        log(`First result: ${result[1]} Score: ${result[2]}`);
      }
    } catch (error) {
      log(`Error: ${error.message}`);
    }
  }
}

/**
 * Main test function
 */
async function runTests() {
  try {
    log('=== TESTING PHONETIC MATCHING SYNTAXES ===');
    
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
        if (fieldInfo.includes && fieldInfo.includes('PHONETIC')) {
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
    for (const { term } of testTerms) {
      await testPhoneticSyntaxes(indexName, term);
    }
    
    // Summary
    log('\n=== TEST SUMMARY ===');
    log('Tested different syntaxes for phonetic matching in RediSearch');
    
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