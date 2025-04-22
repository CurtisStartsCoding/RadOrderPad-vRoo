/**
 * Redis Data Check Script
 * 
 * This script checks if there's data in Redis and displays some basic statistics
 * about the data stored in Redis.
 */

import { getRedisClient } from '../../dist/config/redis.js';

async function checkRedisData() {
  console.log('Checking Redis data...');
  
  try {
    const client = getRedisClient();
    
    // Test connection
    console.log('Testing Redis connection...');
    const pingResult = await client.ping();
    console.log(`Redis connection test result: ${pingResult}`);
    
    // Check for CPT codes
    console.log('\nChecking CPT codes...');
    const cptKeys = await client.keys('cpt:*');
    console.log(`Found ${cptKeys.length} CPT codes in Redis`);
    
    if (cptKeys.length > 0) {
      // Show a sample
      const sampleKey = cptKeys[0];
      const data = await client.call('JSON.GET', sampleKey);
      console.log(`Sample CPT code (${sampleKey}):`, data);
    }
    
    // Check for ICD-10 codes
    console.log('\nChecking ICD-10 codes...');
    const icdKeys = await client.keys('icd10:*');
    console.log(`Found ${icdKeys.length} ICD-10 codes in Redis`);
    
    if (icdKeys.length > 0) {
      // Show a sample
      const sampleKey = icdKeys[0];
      const data = await client.call('JSON.GET', sampleKey);
      console.log(`Sample ICD-10 code (${sampleKey}):`, data);
    }
    
    // Check for mappings
    console.log('\nChecking CPT-ICD10 mappings...');
    const mappingKeys = await client.keys('mapping:*');
    console.log(`Found ${mappingKeys.length} mappings in Redis`);
    
    if (mappingKeys.length > 0) {
      // Show a sample
      const sampleKey = mappingKeys[0];
      const data = await client.call('JSON.GET', sampleKey);
      console.log(`Sample mapping (${sampleKey}):`, data);
    }
    
    // Check for markdown docs
    console.log('\nChecking markdown docs...');
    const markdownKeys = await client.keys('markdown:*');
    console.log(`Found ${markdownKeys.length} markdown docs in Redis`);
    
    if (markdownKeys.length > 0) {
      // Show a sample
      const sampleKey = markdownKeys[0];
      const data = await client.call('JSON.GET', sampleKey);
      console.log(`Sample markdown doc (${sampleKey}):`, data);
    }
    
    // Check for RedisSearch indexes
    console.log('\nChecking RedisSearch indexes...');
    try {
      const cptIndexInfo = await client.call('FT.INFO', 'cpt_index');
      console.log('CPT index exists');
      console.log(`CPT index doc count: ${cptIndexInfo[3]}`);
    } catch (error) {
      console.log('CPT index does not exist or error:', error.message);
    }
    
    try {
      const icdIndexInfo = await client.call('FT.INFO', 'icd10_index');
      console.log('ICD-10 index exists');
      console.log(`ICD-10 index doc count: ${icdIndexInfo[3]}`);
    } catch (error) {
      console.log('ICD-10 index does not exist or error:', error.message);
    }
    
    // Close the connection
    await client.quit();
    console.log('\nRedis connection closed');
    
  } catch (error) {
    console.error('Error checking Redis data:', error);
  }
}

// Run the function
checkRedisData().catch(console.error);