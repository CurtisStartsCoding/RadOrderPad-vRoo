/**
 * Test script for PostgreSQL weighted search
 * 
 * This script tests the PostgreSQL weighted search implementation
 * by simulating a Redis failure and forcing the system to use
 * the PostgreSQL weighted search fallback.
 */

const dotenv = require('dotenv');
dotenv.config();

const { generateDatabaseContextWithPostgresWeighted } = require('../dist/utils/database/postgres-weighted-search');
const { generateDatabaseContextWithRedis } = require('../dist/utils/database/redis-context-generator-weighted');
const logger = require('../dist/utils/logger').default;

// Override the Redis connection test to force fallback to PostgreSQL
const originalTestRedisConnection = require('../dist/config/redis').testRedisConnection;
require('../dist/config/redis').testRedisConnection = async () => {
  logger.info('Test script: Simulating Redis connection failure to force PostgreSQL fallback');
  return false;
};

/**
 * Test the PostgreSQL weighted search implementation
 */
async function testPostgresWeightedSearch() {
  try {
    logger.info('=== Testing PostgreSQL Weighted Search ===');
    
    // Test case 1: Shoulder MRI
    const keywords1 = ['shoulder', 'pain', 'mri'];
    logger.info(`\nTest Case 1: ${keywords1.join(', ')}`);
    
    // Test direct PostgreSQL weighted search
    logger.info('\nTesting direct PostgreSQL weighted search:');
    const directResult = await generateDatabaseContextWithPostgresWeighted(keywords1);
    
    logger.info(`Found ${directResult.icd10Rows.length} ICD-10 codes with scores`);
    if (directResult.icd10Rows.length > 0) {
      logger.info('Top 3 ICD-10 results:');
      directResult.icd10Rows.slice(0, 3).forEach(row => {
        logger.info(`${row.icd10_code}: ${row.description} (Score: ${row.score})`);
      });
    }
    
    logger.info(`Found ${directResult.cptRows.length} CPT codes with scores`);
    if (directResult.cptRows.length > 0) {
      logger.info('Top 3 CPT results:');
      directResult.cptRows.slice(0, 3).forEach(row => {
        logger.info(`${row.cpt_code}: ${row.description} (Score: ${row.score})`);
      });
    }
    
    // Test fallback through the main context generator
    logger.info('\nTesting fallback through main context generator:');
    const fallbackResult = await generateDatabaseContextWithRedis(keywords1);
    logger.info('Database context generated through fallback mechanism');
    logger.info('Context length:', fallbackResult.length);
    
    // Test case 2: Chest X-ray
    const keywords2 = ['chest', 'cough', 'xray'];
    logger.info(`\nTest Case 2: ${keywords2.join(', ')}`);
    
    // Test direct PostgreSQL weighted search
    logger.info('\nTesting direct PostgreSQL weighted search:');
    const directResult2 = await generateDatabaseContextWithPostgresWeighted(keywords2);
    
    logger.info(`Found ${directResult2.icd10Rows.length} ICD-10 codes with scores`);
    if (directResult2.icd10Rows.length > 0) {
      logger.info('Top 3 ICD-10 results:');
      directResult2.icd10Rows.slice(0, 3).forEach(row => {
        logger.info(`${row.icd10_code}: ${row.description} (Score: ${row.score})`);
      });
    }
    
    logger.info(`Found ${directResult2.cptRows.length} CPT codes with scores`);
    if (directResult2.cptRows.length > 0) {
      logger.info('Top 3 CPT results:');
      directResult2.cptRows.slice(0, 3).forEach(row => {
        logger.info(`${row.cpt_code}: ${row.description} (Score: ${row.score})`);
      });
    }
    
    // Test fallback through the main context generator
    logger.info('\nTesting fallback through main context generator:');
    const fallbackResult2 = await generateDatabaseContextWithRedis(keywords2);
    logger.info('Database context generated through fallback mechanism');
    logger.info('Context length:', fallbackResult2.length);
    
    // Test case 3: Brain CT
    const keywords3 = ['brain', 'headache', 'ct'];
    logger.info(`\nTest Case 3: ${keywords3.join(', ')}`);
    
    // Test direct PostgreSQL weighted search
    logger.info('\nTesting direct PostgreSQL weighted search:');
    const directResult3 = await generateDatabaseContextWithPostgresWeighted(keywords3);
    
    logger.info(`Found ${directResult3.icd10Rows.length} ICD-10 codes with scores`);
    if (directResult3.icd10Rows.length > 0) {
      logger.info('Top 3 ICD-10 results:');
      directResult3.icd10Rows.slice(0, 3).forEach(row => {
        logger.info(`${row.icd10_code}: ${row.description} (Score: ${row.score})`);
      });
    }
    
    logger.info(`Found ${directResult3.cptRows.length} CPT codes with scores`);
    if (directResult3.cptRows.length > 0) {
      logger.info('Top 3 CPT results:');
      directResult3.cptRows.slice(0, 3).forEach(row => {
        logger.info(`${row.cpt_code}: ${row.description} (Score: ${row.score})`);
      });
    }
    
    // Restore the original Redis connection test
    require('../dist/config/redis').testRedisConnection = originalTestRedisConnection;
    
    logger.info('\n=== PostgreSQL Weighted Search Test Completed ===');
  } catch (error) {
    logger.error('Error testing PostgreSQL weighted search:', error);
  }
}

// Run the test
testPostgresWeightedSearch().catch(error => {
  logger.error('Unhandled error in test script:', error);
  process.exit(1);
});