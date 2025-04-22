/**
 * Script to test both Redis search and PostgreSQL fallback in sequence
 */
import { queryMainDb } from '../dist/config/db.js';
import { formatDatabaseContext } from '../dist/utils/database/context-formatter.js';
import { categorizeKeywords } from '../dist/utils/database/keyword-categorizer.js';
import { getRedisClient, closeRedisConnection } from '../dist/config/redis.js';

// Import Redis search functions using CommonJS style
import redisSearchModule from '../dist/utils/redis/search/index.js';
const { searchCptCodes, searchIcd10Codes } = redisSearchModule;

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
async function testPostgresFallback() {
  try {
    console.log('\n--- Testing PostgreSQL Fallback Path ---');
    
    // Extract keywords from dictation
    const keywords = extractKeywords(sampleDictation);
    console.log('Extracted keywords:', keywords);
    
    // Categorize keywords for more targeted queries
    const categorizedKeywords = categorizeKeywords(keywords);
    console.log('Categorized keywords for PostgreSQL fallback:', categorizedKeywords);
    
    // Simple query to find relevant ICD-10 codes
    const icd10Query = `
      SELECT icd10_code, description, clinical_notes, imaging_modalities, primary_imaging
      FROM medical_icd10_codes
      WHERE ${keywords.map((_, index) => 
        `description ILIKE $${index + 1} OR 
         clinical_notes ILIKE $${index + 1} OR 
         keywords ILIKE $${index + 1}`
      ).join(' OR ')}
      LIMIT 10
    `;
    
    const icd10Params = keywords.map(keyword => `%${keyword}%`);
    console.log('ICD-10 query params for PostgreSQL fallback:', icd10Params);
    const icd10Result = await queryMainDb(icd10Query, icd10Params);
    console.log(`Found ${icd10Result.rows.length} relevant ICD-10 codes with PostgreSQL fallback`);
    
    if (icd10Result.rows.length > 0) {
      console.log('Sample ICD-10 codes:');
      icd10Result.rows.slice(0, 5).forEach(row => {
        console.log(`${row.icd10_code}: ${row.description}`);
      });
    }
    
    // Simple query to find relevant CPT codes
    const cptQuery = `
      SELECT cpt_code, description, modality, body_part
      FROM medical_cpt_codes
      WHERE ${keywords.map((_, index) => 
        `description ILIKE $${index + 1} OR 
         body_part ILIKE $${index + 1} OR 
         modality ILIKE $${index + 1}`
      ).join(' OR ')}
      LIMIT 10
    `;
    
    const cptParams = keywords.map(keyword => `%${keyword}%`);
    console.log('CPT query params for PostgreSQL fallback:', cptParams);
    const cptResult = await queryMainDb(cptQuery, cptParams);
    console.log(`Found ${cptResult.rows.length} relevant CPT codes with PostgreSQL fallback`);
    
    if (cptResult.rows.length > 0) {
      console.log('Sample CPT codes:');
      cptResult.rows.slice(0, 5).forEach(row => {
        console.log(`${row.cpt_code}: ${row.description} (${row.modality}, ${row.body_part})`);
      });
    }
    
    // Format the database context
    const formattedContext = formatDatabaseContext(
      icd10Result.rows,
      cptResult.rows,
      [], // No mappings for simplicity
      []  // No markdown docs for simplicity
    );
    
    console.log('\nFormatted database context:');
    console.log(formattedContext);
    
    return icd10Result.rows.length > 0 || cptResult.rows.length > 0;
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
    console.log('Starting combined test of Redis search and PostgreSQL fallback...');
    
    // Test the Redis search path
    const redisSearchSuccess = await testRedisSearch();
    
    // Close Redis connection to simulate failure
    console.log('\nTemporarily closing Redis connection to test fallback...');
    await closeRedisConnection();
    
    // Test the PostgreSQL fallback path
    const postgresqlFallbackSuccess = await testPostgresFallback();
    
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