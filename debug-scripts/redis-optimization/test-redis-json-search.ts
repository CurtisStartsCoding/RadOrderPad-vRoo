/**
 * Test Script for Redis JSON Search Implementation
 * 
 * This script tests the updated Redis data storage and search functionality
 * that uses JSON documents and JSONPath field specifiers.
 */

import { getRedisClient } from '../../src/config/redis';
import { 
  searchCPTCodesWithScores, 
  searchICD10CodesWithScores,
  getMarkdownDocsWithScores
} from '../../src/utils/redis/search';
import enhancedLogger from '../../src/utils/enhanced-logger';

// Test keywords
const TEST_KEYWORDS = [
  'shoulder pain',
  'headache dizziness',
  'chest pain',
  'abdominal pain',
  'knee injury'
];

/**
 * Test CPT code search with scores
 */
async function testCPTSearch(keywords: string[]): Promise<void> {
  enhancedLogger.info(`Testing CPT search with keywords: ${keywords.join(', ')}`);
  
  try {
    const results = await searchCPTCodesWithScores(keywords);
    
    enhancedLogger.info(`Found ${results.length} CPT codes`);
    
    // Display top 5 results
    results.slice(0, 5).forEach((result, index) => {
      enhancedLogger.info(`${index + 1}. [${result.cpt_code}] ${result.description} (Score: ${result.score.toFixed(2)})`);
    });
  } catch (error) {
    enhancedLogger.error('Error testing CPT search:', error);
  }
}

/**
 * Test ICD-10 code search with scores
 */
async function testICD10Search(keywords: string[]): Promise<void> {
  enhancedLogger.info(`Testing ICD-10 search with keywords: ${keywords.join(', ')}`);
  
  try {
    const results = await searchICD10CodesWithScores(keywords);
    
    enhancedLogger.info(`Found ${results.length} ICD-10 codes`);
    
    // Display top 5 results
    results.slice(0, 5).forEach((result, index) => {
      enhancedLogger.info(`${index + 1}. [${result.icd10_code}] ${result.description} (Score: ${result.score.toFixed(2)})`);
    });
    
    // Test markdown search with top ICD-10 code
    if (results.length > 0) {
      await testMarkdownSearch(keywords, [results[0]]);
    }
  } catch (error) {
    enhancedLogger.error('Error testing ICD-10 search:', error);
  }
}

/**
 * Test Markdown search with scores
 */
async function testMarkdownSearch(keywords: string[], icd10Codes: any[]): Promise<void> {
  enhancedLogger.info(`Testing Markdown search with keywords: ${keywords.join(', ')}`);
  
  try {
    const results = await getMarkdownDocsWithScores(icd10Codes, keywords);
    
    enhancedLogger.info(`Found ${results.length} Markdown documents`);
    
    // Display top 3 results
    results.slice(0, 3).forEach((result, index) => {
      enhancedLogger.info(`${index + 1}. [${result.icd10_code}] ${result.icd10_description} (Score: ${result.score.toFixed(2)})`);
      // Show a preview of the content
      if (result.content) {
        const preview = result.content.substring(0, 100) + '...';
        enhancedLogger.info(`   Preview: ${preview}`);
      }
    });
  } catch (error) {
    enhancedLogger.error('Error testing Markdown search:', error);
  }
}

/**
 * Test Redis JSON storage
 */
async function testRedisJSONStorage(): Promise<void> {
  enhancedLogger.info('Testing Redis JSON storage');
  
  try {
    const client = getRedisClient();
    
    // Get a sample CPT code
    const cptKey = 'cpt:code:73221';
    const cptData = await client.call('JSON.GET', cptKey);
    
    if (cptData) {
      enhancedLogger.info(`Found CPT code ${cptKey} stored as JSON:`);
      enhancedLogger.info(JSON.parse(cptData as string));
    } else {
      enhancedLogger.warn(`CPT code ${cptKey} not found or not stored as JSON`);
    }
    
    // Get a sample ICD-10 code
    const icd10Key = 'icd10:code:M54.5';
    const icd10Data = await client.call('JSON.GET', icd10Key);
    
    if (icd10Data) {
      enhancedLogger.info(`Found ICD-10 code ${icd10Key} stored as JSON:`);
      enhancedLogger.info(JSON.parse(icd10Data as string));
    } else {
      enhancedLogger.warn(`ICD-10 code ${icd10Key} not found or not stored as JSON`);
    }
    
    // Get a sample mapping (should still be a hash)
    const mappingKey = 'mapping:icd10-to-cpt:M54.5';
    const mappingData = await client.hgetall(mappingKey);
    
    if (mappingData && Object.keys(mappingData).length > 0) {
      enhancedLogger.info(`Found mapping ${mappingKey} stored as Hash:`);
      enhancedLogger.info(mappingData);
    } else {
      enhancedLogger.warn(`Mapping ${mappingKey} not found or empty`);
    }
  } catch (error) {
    enhancedLogger.error('Error testing Redis JSON storage:', error);
  }
}

/**
 * Main function to run all tests
 */
async function runTests(): Promise<void> {
  enhancedLogger.info('Starting Redis JSON Search tests');
  
  // Test Redis JSON storage
  await testRedisJSONStorage();
  
  // Test each set of keywords
  for (const keywords of TEST_KEYWORDS) {
    enhancedLogger.info('\n' + '='.repeat(50));
    const keywordArray = keywords.split(' ');
    
    // Test CPT search
    await testCPTSearch(keywordArray);
    
    // Test ICD-10 search
    await testICD10Search(keywordArray);
    
    enhancedLogger.info('='.repeat(50) + '\n');
  }
  
  enhancedLogger.info('All tests completed');
  process.exit(0);
}

// Run the tests
runTests().catch(error => {
  enhancedLogger.error('Error running tests:', error);
  process.exit(1);
});