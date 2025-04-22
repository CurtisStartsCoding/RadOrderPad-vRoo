/**
 * Direct RedisSearch Test Script
 * 
 * This script tests the RedisSearch functionality directly by running search queries
 * against the Redis indexes.
 */

import { getRedisClient } from '../../dist/config/redis.js';

async function testRedisSearch() {
  console.log('Testing RedisSearch functionality directly...');
  
  try {
    const client = getRedisClient();
    
    // Test connection
    console.log('Testing Redis connection...');
    const pingResult = await client.ping();
    console.log(`Redis connection test result: ${pingResult}`);
    
    // Test keywords
    const keywords = ['shoulder', 'pain', 'MRI', 'rotator cuff', 'tear'];
    console.log(`\nTest keywords: ${keywords.join(', ')}`);
    
    // Test CPT search with each keyword individually
    console.log('\nTesting CPT search with individual keywords:');
    for (const keyword of keywords) {
      console.log(`\nSearching for CPT codes with keyword: ${keyword}`);
      try {
        const query = `@description:(${keyword})`;
        console.log(`Query: ${query}`);
        const result = await client.call('FT.SEARCH', 'cpt_index', query);
        console.log(`Results: ${result[0]} matches`);
        
        if (result[0] > 0) {
          console.log('First match:');
          console.log(`Key: ${result[1]}`);
          console.log(`Data: ${result[2]}`);
        }
      } catch (error) {
        console.error(`Error searching CPT codes with keyword ${keyword}:`, error.message);
      }
    }
    
    // Test ICD-10 search with each keyword individually
    console.log('\nTesting ICD-10 search with individual keywords:');
    for (const keyword of keywords) {
      console.log(`\nSearching for ICD-10 codes with keyword: ${keyword}`);
      try {
        const query = `@description:(${keyword})`;
        console.log(`Query: ${query}`);
        const result = await client.call('FT.SEARCH', 'icd10_index', query);
        console.log(`Results: ${result[0]} matches`);
        
        if (result[0] > 0) {
          console.log('First match:');
          console.log(`Key: ${result[1]}`);
          console.log(`Data: ${result[2]}`);
        }
      } catch (error) {
        console.error(`Error searching ICD-10 codes with keyword ${keyword}:`, error.message);
      }
    }
    
    // Test combined search
    console.log('\nTesting combined search:');
    try {
      const query = '@description:(shoulder pain) @modality:(MRI)';
      console.log(`CPT combined query: ${query}`);
      const result = await client.call('FT.SEARCH', 'cpt_index', query);
      console.log(`Results: ${result[0]} matches`);
      
      if (result[0] > 0) {
        console.log('First match:');
        console.log(`Key: ${result[1]}`);
        console.log(`Data: ${result[2]}`);
      }
    } catch (error) {
      console.error('Error with combined search:', error.message);
    }
    
    // Test wildcard search
    console.log('\nTesting wildcard search:');
    try {
      const query = '@description:shoul*';
      console.log(`CPT wildcard query: ${query}`);
      const result = await client.call('FT.SEARCH', 'cpt_index', query);
      console.log(`Results: ${result[0]} matches`);
      
      if (result[0] > 0) {
        console.log('First match:');
        console.log(`Key: ${result[1]}`);
        console.log(`Data: ${result[2]}`);
      }
    } catch (error) {
      console.error('Error with wildcard search:', error.message);
    }
    
    // Close the connection
    await client.quit();
    console.log('\nRedis connection closed');
    
  } catch (error) {
    console.error('Error testing RedisSearch:', error);
  }
}

// Run the function
testRedisSearch().catch(console.error);