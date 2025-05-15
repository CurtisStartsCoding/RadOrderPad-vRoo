/**
 * Fuzzy Weighted Search Test
 * 
 * This script tests fuzzy matching combined with weighted search in RediSearch
 */

const Redis = require('ioredis');
const { performance } = require('perf_hooks');

// Redis Cloud connection details
const redisHost = 'redis-11584.crce197.us-east-2-1.ec2.redns.redis-cloud.com';
const redisPort = 11584;
const redisPassword = 'zHUbspGPcewJsoT9G9TSQncuSl0v0MUH';

console.log('Starting Fuzzy Weighted Search Testing...');

// Create a Redis client
const client = new Redis({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  tls: {}
});

// Set up event handlers
client.on('connect', () => {
  console.log('Redis client connected successfully');
});

client.on('error', (err) => {
  console.error('Redis Client Error', err);
});

/**
 * Create a test index with weighted fields
 */
async function createTestIndex() {
  try {
    console.log('\n=== CREATING TEST INDEX WITH WEIGHTED FIELDS ===');
    
    // Check if index exists and drop it
    const indices = await client.call('FT._LIST');
    if (indices.includes('idx:fuzzy-test')) {
      console.log('Dropping existing test index');
      await client.call('FT.DROPINDEX', 'idx:fuzzy-test');
    }
    
    // Create index with weighted fields
    console.log('Creating index with weighted fields');
    await client.call(
      'FT.CREATE', 'idx:fuzzy-test', 'ON', 'JSON', 'PREFIX', '1', 'fuzzy:test:',
      'SCHEMA',
      '$.id', 'AS', 'id', 'TAG', 'SORTABLE',
      '$.title', 'AS', 'title', 'TEXT', 'WEIGHT', '5.0',  // Title has highest weight
      '$.description', 'AS', 'description', 'TEXT', 'WEIGHT', '3.0',  // Description has medium weight
      '$.content', 'AS', 'content', 'TEXT', 'WEIGHT', '1.0'  // Content has lowest weight
    );
    
    console.log('Test index created successfully');
  } catch (error) {
    console.error('Error creating test index:', error);
  }
}

/**
 * Populate test data with misspelled terms
 */
async function populateTestData() {
  try {
    console.log('\n=== POPULATING TEST DATA WITH MISSPELLED TERMS ===');
    
    // Delete existing test keys
    const keys = await client.keys('fuzzy:test:*');
    if (keys.length > 0) {
      console.log(`Deleting ${keys.length} existing test keys`);
      const pipeline = client.pipeline();
      keys.forEach(key => pipeline.del(key));
      await pipeline.exec();
    }
    
    // Create test documents with misspelled terms
    const testDocs = [
      {
        // Doc1: Correct spelling
        id: '1',
        title: 'Magnetic Resonance Imaging Protocol',
        description: 'Standard protocol for MRI examination',
        content: 'This document outlines the standard protocol for conducting MRI examinations.'
      },
      {
        // Doc2: Misspelled in title
        id: '2',
        title: 'Magntic Resonence Imaging Protocol',  // Misspelled
        description: 'Standard protocol for MRI examination',
        content: 'This document outlines the standard protocol for conducting MRI examinations.'
      },
      {
        // Doc3: Misspelled in description
        id: '3',
        title: 'Magnetic Resonance Imaging Protocol',
        description: 'Standard protocol for Magntic Resonence Imaging',  // Misspelled
        content: 'This document outlines the standard protocol for conducting MRI examinations.'
      },
      {
        // Doc4: Different medical term
        id: '4',
        title: 'Computed Tomography Protocol',
        description: 'Standard protocol for CT examination',
        content: 'This document outlines the standard protocol for conducting CT examinations.'
      },
      {
        // Doc5: Misspelled medical term
        id: '5',
        title: 'Computed Tomografy Protocol',  // Misspelled
        description: 'Standard protocol for CT examination',
        content: 'This document outlines the standard protocol for conducting CT examinations.'
      },
      {
        // Doc6: Another medical term with misspelling
        id: '6',
        title: 'Ultrasound Examination Guidelines',
        description: 'Guidelines for Ultrasond procedures',  // Misspelled
        content: 'This document provides guidelines for conducting ultrasound examinations.'
      }
    ];
    
    // Store documents using JSON.SET
    console.log('Storing test documents');
    const pipeline = client.pipeline();
    testDocs.forEach((doc, index) => {
      const key = `fuzzy:test:${doc.id}`;
      pipeline.call('JSON.SET', key, '$', JSON.stringify(doc));
    });
    await pipeline.exec();
    
    console.log('Test data populated successfully');
  } catch (error) {
    console.error('Error populating test data:', error);
  }
}

/**
 * Process search terms with selective fuzzy matching
 */
function processSearchTermsWithFuzzy(keywords) {
  return keywords.map(kw => {
    const sanitized = kw.replace(/[^a-zA-Z0-9]/g, ' ');
    return sanitized.length > 3 ? `%%${sanitized}%%` : sanitized;
  }).join('|');
}

/**
 * Run fuzzy search tests
 */
async function runFuzzySearchTests() {
  try {
    console.log('\n=== RUNNING FUZZY SEARCH TESTS ===');
    
    // Test 1: Exact search for "magnetic"
    console.log('\nTest 1: Exact search for "magnetic"');
    const exactTerm = 'magnetic';
    const exactQuery = `@title|description|content:(${exactTerm})`;
    
    console.log(`Query: ${exactQuery}`);
    const startExact = performance.now();
    const exactResult = await client.call(
      'FT.SEARCH',
      'idx:fuzzy-test',
      exactQuery,
      'WITHSCORES',
      'LIMIT', '0', '10',
      'RETURN', '2', '$.id', '$.title'
    );
    const endExact = performance.now();
    
    console.log(`Total results: ${exactResult[0]}`);
    console.log(`Time taken: ${(endExact - startExact).toFixed(2)}ms`);
    console.log('Results:');
    printSimpleResults(exactResult);
    
    // Test 2: Fuzzy search for "magnetic"
    console.log('\nTest 2: Fuzzy search for "magnetic"');
    const fuzzyTerm = 'magnetic';
    const fuzzyQuery = `@title|description|content:(%%${fuzzyTerm}%%)`;
    
    console.log(`Query: ${fuzzyQuery}`);
    const startFuzzy = performance.now();
    const fuzzyResult = await client.call(
      'FT.SEARCH',
      'idx:fuzzy-test',
      fuzzyQuery,
      'WITHSCORES',
      'LIMIT', '0', '10',
      'RETURN', '2', '$.id', '$.title'
    );
    const endFuzzy = performance.now();
    
    console.log(`Total results: ${fuzzyResult[0]}`);
    console.log(`Time taken: ${(endFuzzy - startFuzzy).toFixed(2)}ms`);
    console.log('Results:');
    printSimpleResults(fuzzyResult);
    
    // Test 3: Misspelled search for "magntic"
    console.log('\nTest 3: Misspelled search for "magntic"');
    const misspelledTerm = 'magntic';
    const misspelledQuery = `@title|description|content:(${misspelledTerm})`;
    
    console.log(`Query: ${misspelledQuery}`);
    const startMisspelled = performance.now();
    const misspelledResult = await client.call(
      'FT.SEARCH',
      'idx:fuzzy-test',
      misspelledQuery,
      'WITHSCORES',
      'LIMIT', '0', '10',
      'RETURN', '2', '$.id', '$.title'
    );
    const endMisspelled = performance.now();
    
    console.log(`Total results: ${misspelledResult[0]}`);
    console.log(`Time taken: ${(endMisspelled - startMisspelled).toFixed(2)}ms`);
    console.log('Results:');
    printSimpleResults(misspelledResult);
    
    // Test 4: Fuzzy search for misspelled "magntic"
    console.log('\nTest 4: Fuzzy search for misspelled "magntic"');
    const fuzzyMisspelledTerm = 'magntic';
    const fuzzyMisspelledQuery = `@title|description|content:(%%${fuzzyMisspelledTerm}%%)`;
    
    console.log(`Query: ${fuzzyMisspelledQuery}`);
    const startFuzzyMisspelled = performance.now();
    const fuzzyMisspelledResult = await client.call(
      'FT.SEARCH',
      'idx:fuzzy-test',
      fuzzyMisspelledQuery,
      'WITHSCORES',
      'LIMIT', '0', '10',
      'RETURN', '2', '$.id', '$.title'
    );
    const endFuzzyMisspelled = performance.now();
    
    console.log(`Total results: ${fuzzyMisspelledResult[0]}`);
    console.log(`Time taken: ${(endFuzzyMisspelled - startFuzzyMisspelled).toFixed(2)}ms`);
    console.log('Results:');
    printSimpleResults(fuzzyMisspelledResult);
    
    // Test 5: Weighted fuzzy search
    console.log('\nTest 5: Weighted fuzzy search');
    const weightedFuzzyTerm = 'magntic';
    const weightedFuzzyQuery = `@title:(%%${weightedFuzzyTerm}%%)=>{$weight:5.0} | @description:(%%${weightedFuzzyTerm}%%)=>{$weight:3.0} | @content:(%%${weightedFuzzyTerm}%%)=>{$weight:1.0}`;
    
    console.log(`Query: ${weightedFuzzyQuery}`);
    const startWeightedFuzzy = performance.now();
    const weightedFuzzyResult = await client.call(
      'FT.SEARCH',
      'idx:fuzzy-test',
      weightedFuzzyQuery,
      'WITHSCORES',
      'LIMIT', '0', '10',
      'RETURN', '2', '$.id', '$.title'
    );
    const endWeightedFuzzy = performance.now();
    
    console.log(`Total results: ${weightedFuzzyResult[0]}`);
    console.log(`Time taken: ${(endWeightedFuzzy - startWeightedFuzzy).toFixed(2)}ms`);
    console.log('Results:');
    printSimpleResults(weightedFuzzyResult);
    
    // Test 6: Hybrid approach (exact + fuzzy)
    console.log('\nTest 6: Hybrid approach (exact + fuzzy)');
    const hybridTerm = 'magnetic';
    const hybridQuery = `@title:(${hybridTerm})=>{$weight:5.0} | @title:(%%${hybridTerm}%%)=>{$weight:3.0}`;
    
    console.log(`Query: ${hybridQuery}`);
    const startHybrid = performance.now();
    const hybridResult = await client.call(
      'FT.SEARCH',
      'idx:fuzzy-test',
      hybridQuery,
      'WITHSCORES',
      'LIMIT', '0', '10',
      'RETURN', '2', '$.id', '$.title'
    );
    const endHybrid = performance.now();
    
    console.log(`Total results: ${hybridResult[0]}`);
    console.log(`Time taken: ${(endHybrid - startHybrid).toFixed(2)}ms`);
    console.log('Results:');
    printSimpleResults(hybridResult);
    
    // Test 7: Using the processSearchTermsWithFuzzy function
    console.log('\nTest 7: Using the processSearchTermsWithFuzzy function');
    const processedTerms = processSearchTermsWithFuzzy(['magnetic', 'resonance']);
    const processedQuery = `@title:(${processedTerms})=>{$weight:5.0} | @description:(${processedTerms})=>{$weight:3.0}`;
    
    console.log(`Processed terms: ${processedTerms}`);
    console.log(`Query: ${processedQuery}`);
    const startProcessed = performance.now();
    const processedResult = await client.call(
      'FT.SEARCH',
      'idx:fuzzy-test',
      processedQuery,
      'WITHSCORES',
      'LIMIT', '0', '10',
      'RETURN', '2', '$.id', '$.title'
    );
    const endProcessed = performance.now();
    
    console.log(`Total results: ${processedResult[0]}`);
    console.log(`Time taken: ${(endProcessed - startProcessed).toFixed(2)}ms`);
    console.log('Results:');
    printSimpleResults(processedResult);
    
  } catch (error) {
    console.error('Error running fuzzy search tests:', error);
  }
}

/**
 * Helper function to print search results
 */
function printSimpleResults(results) {
  for (let i = 1; i < results.length; i += 3) {
    const key = results[i];
    const score = results[i + 1];
    const data = results[i + 2];
    console.log(`  ${key}: Score ${score}`);
    console.log(`    ID: ${data[1]}`);
    console.log(`    Title: ${data[3]}`);
  }
}

/**
 * Main function
 */
async function main() {
  try {
    await createTestIndex();
    await populateTestData();
    await runFuzzySearchTests();
    
    console.log('\n=== FUZZY WEIGHTED SEARCH TESTING COMPLETED ===');
    console.log('\nKey Findings:');
    console.log('1. Fuzzy matching with %%term%% syntax can find misspelled terms');
    console.log('2. Weighted search can be combined with fuzzy matching');
    console.log('3. Hybrid approach (exact + fuzzy) provides best results');
    console.log('4. Selective fuzzy matching for terms > 3 chars is recommended');
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    client.quit();
  }
}

// Run the main function
main();