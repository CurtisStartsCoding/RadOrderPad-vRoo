/**
 * Improved Weighted Search Test
 * 
 * This script tests weighted search in RediSearch with JSON documents
 * following best practices from Redis documentation.
 */

const Redis = require('ioredis');
const { performance } = require('perf_hooks');

// Redis Cloud connection details
const redisHost = 'redis-11584.crce197.us-east-2-1.ec2.redns.redis-cloud.com';
const redisPort = 11584;
const redisPassword = 'zHUbspGPcewJsoT9G9TSQncuSl0v0MUH';

console.log('Starting Improved Weighted Search Testing...');

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
    if (indices.includes('idx:weighted-test-improved')) {
      console.log('Dropping existing test index');
      await client.call('FT.DROPINDEX', 'idx:weighted-test-improved');
    }
    
    // Create index with weighted fields
    console.log('Creating index with weighted fields');
    await client.call(
      'FT.CREATE', 'idx:weighted-test-improved', 'ON', 'JSON', 'PREFIX', '1', 'weighted:test:improved:',
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
 * Populate test data with controlled term distribution
 */
async function populateTestData() {
  try {
    console.log('\n=== POPULATING TEST DATA ===');
    
    // Delete existing test keys
    const keys = await client.keys('weighted:test:improved:*');
    if (keys.length > 0) {
      console.log(`Deleting ${keys.length} existing test keys`);
      const pipeline = client.pipeline();
      keys.forEach(key => pipeline.del(key));
      await pipeline.exec();
    }
    
    // Create test documents with controlled term distribution
    const testDocs = [
      {
        // Doc1: "medical" in title (highest weight)
        id: '1',
        title: 'Medical Imaging Techniques',
        description: 'Overview of various imaging methods',
        content: 'This document discusses different imaging techniques used in healthcare.'
      },
      {
        // Doc2: "medical" in description (medium weight)
        id: '2',
        title: 'Imaging Techniques Overview',
        description: 'Various medical imaging methods explained',
        content: 'This document provides information about imaging techniques used in healthcare.'
      },
      {
        // Doc3: "medical" in content (lowest weight)
        id: '3',
        title: 'Imaging Techniques Guide',
        description: 'Overview of various imaging methods',
        content: 'This document discusses different medical imaging techniques used in healthcare.'
      },
      {
        // Doc4: "medical" in title and description (should rank highest)
        id: '4',
        title: 'Medical Imaging Guide',
        description: 'Comprehensive medical imaging reference',
        content: 'This document provides information about imaging techniques used in healthcare.'
      },
      {
        // Doc5: "medical" in all fields (should rank very high)
        id: '5',
        title: 'Medical Imaging Reference',
        description: 'Complete medical imaging guide',
        content: 'This document covers various medical imaging techniques used in healthcare.'
      }
    ];
    
    // Store documents using JSON.SET
    console.log('Storing test documents');
    const pipeline = client.pipeline();
    testDocs.forEach((doc, index) => {
      const key = `weighted:test:improved:${doc.id}`;
      pipeline.call('JSON.SET', key, '$', JSON.stringify(doc));
    });
    await pipeline.exec();
    
    console.log('Test data populated successfully');
  } catch (error) {
    console.error('Error populating test data:', error);
  }
}

/**
 * Run weighted search tests
 */
async function runWeightedSearchTests() {
  try {
    console.log('\n=== RUNNING WEIGHTED SEARCH TESTS ===');
    
    const searchTerm = 'medical';
    
    // Test 1: Basic search without explicit weights in query
    console.log('\nTest 1: Basic search (using schema weights only)');
    const query1 = `@title|description|content:(${searchTerm})`;
    const result1 = await client.call(
      'FT.SEARCH',
      'idx:weighted-test-improved',
      query1,
      'WITHSCORES',
      'LIMIT', '0', '10',
      'RETURN', '4', '$.id', '$.title', '$.description', '$.content'
    );
    
    console.log(`Query: ${query1}`);
    console.log(`Total results: ${result1[0]}`);
    console.log('Results with scores (should be ordered by relevance):');
    printResults(result1);
    
    // Test 2: Search with explicit field weights in query
    console.log('\nTest 2: Search with explicit field weights in query');
    const query2 = `@title:(${searchTerm})=>{$weight:5.0} | @description:(${searchTerm})=>{$weight:3.0} | @content:(${searchTerm})=>{$weight:1.0}`;
    const result2 = await client.call(
      'FT.SEARCH',
      'idx:weighted-test-improved',
      query2,
      'WITHSCORES',
      'LIMIT', '0', '10',
      'RETURN', '4', '$.id', '$.title', '$.description', '$.content'
    );
    
    console.log(`Query: ${query2}`);
    console.log(`Total results: ${result2[0]}`);
    console.log('Results with scores (should be ordered by relevance):');
    printResults(result2);
    
    // Test 3: Search with EXPLAINSCORE to understand scoring
    console.log('\nTest 3: Search with EXPLAINSCORE');
    try {
      const query3 = `@title:(${searchTerm})`;
      const result3 = await client.call(
        'FT.SEARCH',
        'idx:weighted-test-improved',
        query3,
        'WITHSCORES',
        'EXPLAINSCORE',
        'LIMIT', '0', '3',
        'RETURN', '1', '$.id'
      );
      
      console.log(`Query: ${query3}`);
      console.log(`Total results: ${result3[0]}`);
      console.log('Results with score explanations:');
      
      // Print results with score explanations
      for (let i = 1; i < result3.length; i += 4) {
        const key = result3[i];
        const score = result3[i + 1];
        const explanation = result3[i + 2];
        console.log(`  ${key}: Score ${score}`);
        console.log(`    Explanation: ${explanation}`);
      }
    } catch (error) {
      console.log(`EXPLAINSCORE not supported: ${error.message}`);
    }
    
    // Test 4: Compare documents with term in different fields
    console.log('\nTest 4: Compare documents with term in different fields');
    console.log('Doc1: "medical" in title (weight 5.0)');
    console.log('Doc2: "medical" in description (weight 3.0)');
    console.log('Doc3: "medical" in content (weight 1.0)');
    console.log('Doc4: "medical" in title and description');
    console.log('Doc5: "medical" in all fields');
    
    const query4 = `@title|description|content:(${searchTerm})`;
    const result4 = await client.call(
      'FT.SEARCH',
      'idx:weighted-test-improved',
      query4,
      'WITHSCORES',
      'LIMIT', '0', '10',
      'RETURN', '1', '$.id'
    );
    
    console.log(`Query: ${query4}`);
    console.log('Results (should be ordered by field weight):');
    
    // Print simplified results
    for (let i = 1; i < result4.length; i += 3) {
      const key = result4[i];
      const score = result4[i + 1];
      const id = result4[i + 2][1];
      console.log(`  Doc ${id}: Score ${score}`);
    }
    
  } catch (error) {
    console.error('Error running weighted search tests:', error);
  }
}

/**
 * Helper function to print search results
 */
function printResults(results) {
  for (let i = 1; i < results.length; i += 3) {
    const key = results[i];
    const score = results[i + 1];
    const data = results[i + 2];
    console.log(`  ${key}: Score ${score}`);
    console.log(`    ID: ${data[1]}`);
    console.log(`    Title: ${data[3]}`);
    console.log(`    Description: ${data[5]}`);
  }
}

/**
 * Main function
 */
async function main() {
  try {
    await createTestIndex();
    await populateTestData();
    await runWeightedSearchTests();
    
    console.log('\n=== WEIGHTED SEARCH TESTING COMPLETED ===');
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    client.quit();
  }
}

// Run the main function
main();