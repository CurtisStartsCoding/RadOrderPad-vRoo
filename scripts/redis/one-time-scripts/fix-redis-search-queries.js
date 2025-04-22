/**
 * Redis Search Query Fix Script
 * 
 * This script tests different query formats to find the correct one that works
 * with the RedisSearch indexes. It tries various query formats and reports which
 * ones return results.
 */

import { getRedisClient } from '../../dist/config/redis.js';

async function testSearchQueryFormats() {
  console.log('Testing different RedisSearch query formats...');
  
  try {
    const client = getRedisClient();
    
    // Test connection
    console.log('Testing Redis connection...');
    const pingResult = await client.ping();
    console.log(`Redis connection test result: ${pingResult}`);
    
    // Get a sample CPT code to use for testing
    const cptKeys = await client.keys('cpt:*');
    if (cptKeys.length === 0) {
      console.log('No CPT codes found in Redis');
      return;
    }
    
    const sampleKey = cptKeys[0];
    const data = await client.call('JSON.GET', sampleKey);
    const parsedData = JSON.parse(data);
    console.log(`\nSample CPT code (${sampleKey}):`);
    console.log(`Description: ${parsedData.description}`);
    console.log(`Modality: ${parsedData.modality}`);
    
    // Extract a word from the description to search for
    const words = parsedData.description.split(' ');
    const searchWord = words.find(word => word.length > 5) || words[0];
    console.log(`\nSearch word from sample description: "${searchWord}"`);
    
    // Test different query formats
    const queryFormats = [
      // Standard format
      {
        name: 'Standard format',
        query: `@description:(${searchWord})`,
      },
      // JSON path format
      {
        name: 'JSON path format',
        query: `@$.description:(${searchWord})`,
      },
      // Attribute name format
      {
        name: 'Attribute name format',
        query: `@description_nostem:(${searchWord})`,
      },
      // No field specifier
      {
        name: 'No field specifier',
        query: searchWord,
      },
      // Wildcard search
      {
        name: 'Wildcard search',
        query: `@description:(${searchWord.substring(0, 4)}*)`,
      },
      // Fuzzy search
      {
        name: 'Fuzzy search',
        query: `@description:(${searchWord}%2)`,
      },
      // Escaped JSON path
      {
        name: 'Escaped JSON path',
        query: `@\\$\\.description:(${searchWord})`,
      },
      // Using the identifier directly
      {
        name: 'Using identifier directly',
        query: `@"$.description":(${searchWord})`,
      }
    ];
    
    console.log('\nTesting different query formats on CPT index:');
    for (const format of queryFormats) {
      console.log(`\n${format.name}:`);
      console.log(`Query: ${format.query}`);
      
      try {
        const result = await client.call('FT.SEARCH', 'cpt_index', format.query);
        console.log(`Results: ${result[0]} matches`);
        
        if (result[0] > 0) {
          console.log('First match:');
          console.log(`Key: ${result[1]}`);
          console.log(`Data: ${result[2]}`);
        }
      } catch (error) {
        console.error(`Error with query format "${format.name}":`, error.message);
      }
    }
    
    // Get a sample ICD-10 code to use for testing
    const icdKeys = await client.keys('icd10:*');
    if (icdKeys.length === 0) {
      console.log('No ICD-10 codes found in Redis');
      return;
    }
    
    const sampleIcdKey = icdKeys[0];
    const icdData = await client.call('JSON.GET', sampleIcdKey);
    const parsedIcdData = JSON.parse(icdData);
    console.log(`\nSample ICD-10 code (${sampleIcdKey}):`);
    console.log(`Description: ${parsedIcdData.description}`);
    
    // Extract a word from the description to search for
    const icdWords = parsedIcdData.description.split(' ');
    const icdSearchWord = icdWords.find(word => word.length > 5) || icdWords[0];
    console.log(`\nSearch word from sample ICD-10 description: "${icdSearchWord}"`);
    
    console.log('\nTesting different query formats on ICD-10 index:');
    for (const format of queryFormats) {
      console.log(`\n${format.name}:`);
      const query = format.query.replace(searchWord, icdSearchWord);
      console.log(`Query: ${query}`);
      
      try {
        const result = await client.call('FT.SEARCH', 'icd10_index', query);
        console.log(`Results: ${result[0]} matches`);
        
        if (result[0] > 0) {
          console.log('First match:');
          console.log(`Key: ${result[1]}`);
          console.log(`Data: ${result[2]}`);
        }
      } catch (error) {
        console.error(`Error with query format "${format.name}":`, error.message);
      }
    }
    
    // Test a known medical term that should be in the database
    const medicalTerms = ['shoulder', 'pain', 'MRI', 'fracture', 'cancer', 'heart'];
    console.log('\nTesting with common medical terms:');
    
    // Find the query format that worked best
    const workingFormat = queryFormats.find(format => format.name === 'Using identifier directly') || queryFormats[0];
    
    for (const term of medicalTerms) {
      console.log(`\nSearching for term: "${term}"`);
      const query = workingFormat.query.replace(searchWord, term);
      console.log(`Query: ${query}`);
      
      try {
        const result = await client.call('FT.SEARCH', 'cpt_index', query);
        console.log(`CPT Results: ${result[0]} matches`);
        
        const icdResult = await client.call('FT.SEARCH', 'icd10_index', query);
        console.log(`ICD-10 Results: ${icdResult[0]} matches`);
      } catch (error) {
        console.error(`Error searching for term "${term}":`, error.message);
      }
    }
    
    // Close the connection
    await client.quit();
    console.log('\nRedis connection closed');
    
    console.log('\nBased on the test results, update the search implementation to use the query format that worked.');
    
  } catch (error) {
    console.error('Error testing search query formats:', error);
  }
}

// Run the function
testSearchQueryFormats().catch(console.error);