/**
 * Test Weighted Search Functionality
 * 
 * This script tests the weighted search functionality with different query formats
 * to ensure that the search results are correctly weighted based on field importance.
 */

const Redis = require('ioredis');
const { performance } = require('perf_hooks');

// Redis Cloud connection details from .env.production
const redisHost = 'redis-11584.crce197.us-east-2-1.ec2.redns.redis-cloud.com';
const redisPort = 11584;
const redisPassword = 'zHUbspGPcewJsoT9G9TSQncuSl0v0MUH';

console.log('Starting Weighted Search Testing...');
console.log(`Connection details: { host: '${redisHost}', port: ${redisPort}, tls: enabled }`);

// Create a Redis client with production settings
const client = new Redis({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  tls: {}, // Enable TLS for Redis Cloud
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    console.log(`Redis client reconnecting ${times * 50}`);
    return delay;
  }
});

// Set up event handlers
client.on('connect', () => {
  console.log('Redis client connected successfully');
});

client.on('error', (err) => {
  console.error('Redis Client Error', err);
});

/**
 * Create Redis search indices with weighted fields
 */
async function createWeightedIndices() {
  console.log('\n=== CREATING WEIGHTED SEARCH INDICES ===');
  
  try {
    // Get existing indices
    const indices = await client.call('FT._LIST');
    console.log('Existing indices:', indices);
    
    // Drop existing indices if they exist
    if (indices.includes('idx:weighted-test')) {
      console.log('Dropping existing weighted test index');
      await client.call('FT.DROPINDEX', 'idx:weighted-test');
    }
    
    // Create weighted test index
    console.log('Creating weighted test index');
    await client.call(
      'FT.CREATE', 'idx:weighted-test', 'ON', 'JSON', 'PREFIX', '1', 'weighted:test:',
      'SCHEMA',
      '$.id', 'AS', 'id', 'TAG', 'SORTABLE',
      '$.title', 'AS', 'title', 'TEXT', 'WEIGHT', '10.0',
      '$.description', 'AS', 'description', 'TEXT', 'WEIGHT', '5.0',
      '$.content', 'AS', 'content', 'TEXT', 'WEIGHT', '1.0',
      '$.tags', 'AS', 'tags', 'TAG', 'SEPARATOR', ','
    );
    
    console.log('Weighted index created successfully');
    
    // Verify index
    const updatedIndices = await client.call('FT._LIST');
    console.log('Updated indices:', updatedIndices);
    
    // Check index info
    console.log('\nWeighted Test Index Information:');
    const indexInfo = await client.call('FT.INFO', 'idx:weighted-test');
    console.log('Index Type:', indexInfo.indexOf('key_type') >= 0 ? 
      indexInfo[indexInfo.indexOf('key_type') + 1] : 'Unknown');
    
    // Print index schema
    const schemaIndex = indexInfo.indexOf('attributes');
    if (schemaIndex >= 0) {
      const schemaCount = indexInfo[schemaIndex + 1];
      console.log(`Schema has ${schemaCount} fields:`);
      
      for (let i = 0; i < schemaCount; i++) {
        const fieldInfo = indexInfo[schemaIndex + 2 + i];
        console.log(`  ${fieldInfo[1]}: ${fieldInfo[3]} (Weight: ${fieldInfo[5] || 'N/A'})`);
      }
    }
    
  } catch (error) {
    console.error('Error creating weighted indices:', error);
  }
}

/**
 * Populate Redis with test data for weighted search
 */
async function populateWeightedTestData() {
  console.log('\n=== POPULATING WEIGHTED TEST DATA ===');
  
  try {
    // Delete existing test keys
    const keys = await client.keys('weighted:test:*');
    if (keys.length > 0) {
      console.log(`Deleting ${keys.length} weighted test keys`);
      const pipeline = client.pipeline();
      keys.forEach(key => pipeline.del(key));
      await pipeline.exec();
    }
    
    // Sample test documents with varying content in different fields
    const testDocs = [
      {
        id: '1',
        title: 'MRI Protocol for Knee Examination',
        description: 'Standard protocol for knee MRI examination',
        content: 'This document outlines the standard protocol for conducting MRI examinations of the knee joint. It includes patient positioning, sequence parameters, and interpretation guidelines.',
        tags: 'mri,knee,protocol'
      },
      {
        id: '2',
        title: 'CT Scan Guidelines',
        description: 'Guidelines for performing CT scans with contrast',
        content: 'This document contains detailed information about performing CT scans with contrast agents. It mentions various protocols including those for brain, chest, and abdominal CT examinations.',
        tags: 'ct,contrast,guidelines'
      },
      {
        id: '3',
        title: 'Ultrasound Techniques',
        description: 'Advanced ultrasound techniques for abdominal imaging',
        content: 'This comprehensive guide covers advanced ultrasound techniques for abdominal imaging. It includes sections on liver, kidney, and pancreatic ultrasound protocols. There is also a brief mention of MRI as a complementary modality.',
        tags: 'ultrasound,abdominal,advanced'
      },
      {
        id: '4',
        title: 'Radiology Report Templates',
        description: 'Standardized templates for radiology reporting',
        content: 'This document provides standardized templates for radiology reporting across different modalities including X-ray, CT, MRI, and ultrasound. The MRI section includes specific templates for neurological, musculoskeletal, and body imaging.',
        tags: 'templates,reporting,standardized'
      },
      {
        id: '5',
        title: 'Contrast Agent Safety',
        description: 'Safety guidelines for using contrast agents in MRI',
        content: 'This document outlines safety considerations when using gadolinium-based contrast agents in MRI examinations. It covers patient screening, contraindications, and management of adverse reactions.',
        tags: 'contrast,safety,mri,guidelines'
      }
    ];
    
    // Store test documents as JSON
    console.log('Storing weighted test documents as JSON');
    const pipeline = client.pipeline();
    for (const doc of testDocs) {
      pipeline.call('JSON.SET', `weighted:test:${doc.id}`, '.', JSON.stringify(doc));
    }
    await pipeline.exec();
    
    console.log('Weighted test data populated successfully');
    
  } catch (error) {
    console.error('Error populating weighted test data:', error);
  }
}

/**
 * Test weighted search with different query formats
 */
async function testWeightedSearch() {
  console.log('\n=== TESTING WEIGHTED SEARCH ===');
  
  try {
    const searchTerm = 'mri';
    
    // Test 1: Search in all fields without weights
    console.log('\nTest 1: Search in all fields without weights');
    const query1 = `@title|description|content:(${searchTerm})`;
    const result1 = await client.call(
      'FT.SEARCH',
      'idx:weighted-test',
      query1,
      'WITHSCORES',
      'LIMIT', '0', '10',
      'RETURN', '4', '$.id', '$.title', '$.description', '$.content'
    );
    
    console.log(`Query: ${query1}`);
    console.log(`Results: ${result1[0]}`);
    console.log('Results with scores:');
    for (let i = 1; i < result1.length; i += 3) {
      const key = result1[i];
      const score = result1[i + 1];
      const data = result1[i + 2];
      console.log(`  ${key}: Score ${score}`);
      console.log(`    ID: ${data[1]}`);
      console.log(`    Title: ${data[3]}`);
    }
    
    // Test 2: Search with explicit field weights
    console.log('\nTest 2: Search with explicit field weights');
    // Use the correct syntax for weighted search
    const query2 = `@title:(${searchTerm})=>{$weight:10.0} | @description:(${searchTerm})=>{$weight:5.0} | @content:(${searchTerm})=>{$weight:1.0}`;
    const result2 = await client.call(
      'FT.SEARCH',
      'idx:weighted-test',
      query2,
      'WITHSCORES',
      'LIMIT', '0', '10',
      'RETURN', '4', '$.id', '$.title', '$.description', '$.content'
    );
    
    console.log(`Query: ${query2}`);
    console.log(`Results: ${result2[0]}`);
    console.log('Results with scores:');
    for (let i = 1; i < result2.length; i += 3) {
      const key = result2[i];
      const score = result2[i + 1];
      const data = result2[i + 2];
      console.log(`  ${key}: Score ${score}`);
      console.log(`    ID: ${data[1]}`);
      console.log(`    Title: ${data[3]}`);
    }
    
    // Test 3: Search with field aliases (correct syntax)
    console.log('\nTest 3: Search with field aliases (correct syntax)');
    // Use the correct syntax for weighted search
    const query3 = `@title:(${searchTerm})=>{$weight:10.0} | @description:(${searchTerm})=>{$weight:5.0} | @content:(${searchTerm})=>{$weight:1.0}`;
    try {
      const result3 = await client.call(
        'FT.SEARCH',
        'idx:weighted-test',
        query3,
        'WITHSCORES',
        'LIMIT', '0', '10',
        'RETURN', '4', '$.id', '$.title', '$.description', '$.content'
      );
      
      console.log(`Query: ${query3}`);
      console.log(`Results: ${result3[0]}`);
      console.log('Results with scores:');
      for (let i = 1; i < result3.length; i += 3) {
        const key = result3[i];
        const score = result3[i + 1];
        const data = result3[i + 2];
        console.log(`  ${key}: Score ${score}`);
        console.log(`    ID: ${data[1]}`);
        console.log(`    Title: ${data[3]}`);
      }
    } catch (error) {
      console.log(`Query: ${query3}`);
      console.log('Error:', error.message);
    }
    
    // Test 4: Compare results ordering between different query formats
    console.log('\nTest 4: Compare results ordering between different query formats');
    
    // Get results from standard format
    const standardResults = await client.call(
      'FT.SEARCH',
      'idx:weighted-test',
      query2,
      'WITHSCORES',
      'NOCONTENT'
    );
    
    // Get results from field alias format
    let fieldAliasResults;
    try {
      fieldAliasResults = await client.call(
        'FT.SEARCH',
        'idx:weighted-test',
        query3,
        'WITHSCORES',
        'NOCONTENT'
      );
    } catch (error) {
      console.log('Field alias query error:', error.message);
      fieldAliasResults = ['0'];
    }
    
    console.log('Standard format results order:');
    for (let i = 1; i < standardResults.length; i += 2) {
      console.log(`  ${i/2}. ${standardResults[i]} (Score: ${standardResults[i+1]})`);
    }
    
    if (fieldAliasResults[0] > 0) {
      console.log('Field alias format results order:');
      for (let i = 1; i < fieldAliasResults.length; i += 2) {
        console.log(`  ${i/2}. ${fieldAliasResults[i]} (Score: ${fieldAliasResults[i+1]})`);
      }
      
      // Compare orders
      let orderMatches = true;
      for (let i = 1; i < standardResults.length && i < fieldAliasResults.length; i += 2) {
        if (standardResults[i] !== fieldAliasResults[i]) {
          orderMatches = false;
          break;
        }
      }
      
      console.log(`Results order matches: ${orderMatches}`);
    } else {
      console.log('Cannot compare orders due to field alias query error');
    }
    
  } catch (error) {
    console.error('Error testing weighted search:', error);
  }
}

/**
 * Main function
 */
async function main() {
  try {
    await createWeightedIndices();
    await populateWeightedTestData();
    await testWeightedSearch();
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    // Close the Redis connection
    client.quit();
    console.log('\nWeighted search testing completed');
  }
}

// Run the main function
main();