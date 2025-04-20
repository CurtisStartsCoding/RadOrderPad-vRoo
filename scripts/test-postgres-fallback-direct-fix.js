/**
 * Script to test PostgreSQL fallback directly without database operations
 */
import { searchCptCodes, searchIcd10Codes } from '../dist/utils/redis/search/index.js';
import { closeRedisConnection } from '../dist/config/redis.js';
import { searchCptCodesInPostgres, searchIcd10CodesInPostgres } from '../dist/utils/postgres/search.js';

// Sample dictation text for testing
const sampleDictation = `
Patient presents with right shoulder pain after a fall. 
The pain is worse with movement and there is limited range of motion.
Patient has a history of osteoarthritis.
Requesting MRI of the right shoulder to rule out rotator cuff tear.
`;

// Extract keywords from dictation
function extractKeywords(dictationText) {
  // Simple keyword extraction - split by spaces and filter out common words
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'of', 'to', 'in', 'with', 'for', 'on', 'at', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being'];
  const words = dictationText.toLowerCase().split(/\s+/);
  const keywords = words.filter(word => 
    word.length > 2 && !commonWords.includes(word) && !/^\d+$/.test(word)
  );
  
  // Remove punctuation and duplicates
  const cleanKeywords = [...new Set(
    keywords.map(word => word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""))
  )];
  
  return cleanKeywords;
}

/**
 * Test the Redis search path
 */
async function testRedisSearch() {
  try {
    console.log('\n--- Testing Redis Search Path ---');
    
    // Extract keywords from dictation
    const keywords = extractKeywords(sampleDictation);
    console.log('Extracted keywords:', keywords);
    
    // Search for CPT codes in Redis
    console.log('\nSearching for CPT codes in Redis...');
    const cptCodes = await searchCptCodes(keywords);
    console.log(`Found ${cptCodes.length} CPT codes in Redis`);
    
    if (cptCodes.length > 0) {
      console.log('Sample CPT codes:');
      cptCodes.slice(0, 3).forEach(code => {
        console.log(`${code.cpt_code}: ${code.description}`);
      });
    }
    
    // Search for ICD-10 codes in Redis
    console.log('\nSearching for ICD-10 codes in Redis...');
    const icd10Codes = await searchIcd10Codes(keywords);
    console.log(`Found ${icd10Codes.length} ICD-10 codes in Redis`);
    
    if (icd10Codes.length > 0) {
      console.log('Sample ICD-10 codes:');
      icd10Codes.slice(0, 3).forEach(code => {
        console.log(`${code.icd10_code}: ${code.description}`);
      });
    }
    
    return cptCodes.length > 0 || icd10Codes.length > 0;
  } catch (error) {
    console.error('Error in Redis search test:', error);
    return false;
  }
}

/**
 * Test the PostgreSQL fallback path
 */
async function testPostgreSQLFallback() {
  try {
    console.log('\n--- Testing PostgreSQL Fallback Path ---');
    
    // Extract keywords from dictation
    const keywords = extractKeywords(sampleDictation);
    
    // Search for CPT codes in PostgreSQL
    console.log('\nSearching for CPT codes in PostgreSQL...');
    const cptCodes = await searchCptCodesInPostgres(keywords);
    console.log(`Found ${cptCodes.length} CPT codes in PostgreSQL`);
    
    if (cptCodes.length > 0) {
      console.log('Sample CPT codes:');
      cptCodes.slice(0, 3).forEach(code => {
        console.log(`${code.cpt_code}: ${code.description}`);
      });
    }
    
    // Search for ICD-10 codes in PostgreSQL
    console.log('\nSearching for ICD-10 codes in PostgreSQL...');
    const icd10Codes = await searchIcd10CodesInPostgres(keywords);
    console.log(`Found ${icd10Codes.length} ICD-10 codes in PostgreSQL`);
    
    if (icd10Codes.length > 0) {
      console.log('Sample ICD-10 codes:');
      icd10Codes.slice(0, 3).forEach(code => {
        console.log(`${code.icd10_code}: ${code.description}`);
      });
    }
    
    return cptCodes.length > 0 || icd10Codes.length > 0;
  } catch (error) {
    console.error('Error in PostgreSQL fallback test:', error);
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  try {
    console.log('Starting direct test of Redis search and PostgreSQL fallback...');
    
    // Test the Redis search path
    const redisSearchSuccess = await testRedisSearch();
    
    // Close Redis connection to simulate failure
    console.log('\nTemporarily closing Redis connection to test fallback...');
    await closeRedisConnection();
    
    // Test the PostgreSQL fallback path
    const postgresqlFallbackSuccess = await testPostgreSQLFallback();
    
    // Overall test result
    console.log('\n--- Test Results ---');
    console.log(`Redis search test: ${redisSearchSuccess ? 'PASSED' : 'FAILED'}`);
    console.log(`PostgreSQL fallback test: ${postgresqlFallbackSuccess ? 'PASSED' : 'FAILED'}`);
    console.log(`Overall test result: ${redisSearchSuccess && postgresqlFallbackSuccess ? 'PASSED' : 'FAILED'}`);
    
  } catch (error) {
    console.error('Error in test suite:', error);
  }
}

// Run the tests
runTests();