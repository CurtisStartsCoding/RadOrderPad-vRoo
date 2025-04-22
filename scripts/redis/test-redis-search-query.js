/**
 * Script to test Redis search queries directly
 */
import { getRedisClient, closeRedisConnection } from '../dist/config/redis.js';
import { categorizeKeywords } from '../dist/utils/database/keyword-categorizer.js';
import { processSearchTerms } from '../dist/utils/redis/search/common.js';

async function testRedisSearchQuery() {
  try {
    console.log('Testing Redis search queries directly...');
    const client = getRedisClient();
    
    // Check if Redis is connected
    const pingResult = await client.ping();
    console.log(`Redis ping result: ${pingResult}`);
    
    // Test keywords
    const keywords = ['shoulder', 'pain', 'MRI', 'rotator cuff', 'tear', 'osteoarthritis'];
    console.log('Test keywords:', keywords);
    
    // Categorize keywords
    const categorizedKeywords = categorizeKeywords(keywords);
    console.log('Categorized keywords:', categorizedKeywords);
    
    // Process search terms
    const searchTerms = processSearchTerms(keywords);
    console.log('Processed search terms:', searchTerms);
    
    // Test CPT search query
    console.log('\nTesting CPT search query...');
    
    // Build the query the same way as in cpt-search.ts
    let cptQuery = `@description:(${searchTerms})`;
    
    // Add modality filter if we have modalities
    if (categorizedKeywords.modalities.length > 0) {
      const modalities = categorizedKeywords.modalities.join('|');
      cptQuery += ` @modality:{${modalities}}`;
    }
    
    // Add body part filter if we have anatomy terms
    if (categorizedKeywords.anatomyTerms.length > 0) {
      const bodyParts = categorizedKeywords.anatomyTerms.join('|');
      cptQuery += ` @body_part:{${bodyParts}}`;
    }
    
    console.log('CPT query:', cptQuery);
    
    // Execute the CPT search
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cptResults = await (client).call(
        'FT.SEARCH',
        'cpt_index',
        cptQuery,
        'LIMIT', '0', '10',
        'RETURN', '4', '$.cpt_code', '$.description', '$.modality', '$.body_part'
      );
      
      console.log('CPT search results:', cptResults);
      
      if (cptResults[0] > 0) {
        console.log('Found CPT codes:');
        for (let i = 1; i < cptResults.length; i += 2) {
          const key = cptResults[i];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = await (client).call('JSON.GET', key);
          console.log(`${key}: ${data}`);
        }
      } else {
        console.log('No CPT codes found');
      }
    } catch (error) {
      console.error('Error executing CPT search:', error.message);
    }
    
    // Test ICD-10 search query
    console.log('\nTesting ICD-10 search query...');
    
    // Build the query the same way as in icd10-search.ts
    let icd10Query = `@description:(${searchTerms})`;
    
    // Add symptom filter if we have symptoms
    if (categorizedKeywords.symptoms.length > 0) {
      const symptoms = processSearchTerms(categorizedKeywords.symptoms);
      icd10Query = `@description:(${symptoms})`;
    }
    
    console.log('ICD-10 query:', icd10Query);
    
    // Execute the ICD-10 search
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const icd10Results = await (client).call(
        'FT.SEARCH',
        'icd10_index',
        icd10Query,
        'LIMIT', '0', '10',
        'RETURN', '5', '$.icd10_code', '$.description', '$.clinical_notes', '$.imaging_modalities', '$.primary_imaging'
      );
      
      console.log('ICD-10 search results:', icd10Results);
      
      if (icd10Results[0] > 0) {
        console.log('Found ICD-10 codes:');
        for (let i = 1; i < icd10Results.length; i += 2) {
          const key = icd10Results[i];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = await (client).call('JSON.GET', key);
          console.log(`${key}: ${data}`);
        }
      } else {
        console.log('No ICD-10 codes found');
      }
    } catch (error) {
      console.error('Error executing ICD-10 search:', error.message);
    }
    
    // Test direct search for shoulder
    console.log('\nTesting direct search for shoulder...');
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const shoulderResults = await (client).call(
        'FT.SEARCH',
        'cpt_index',
        '@description:(shoulder)',
        'LIMIT', '0', '10'
      );
      
      console.log('Direct shoulder search results:', shoulderResults);
      
      if (shoulderResults[0] > 0) {
        console.log('Found shoulder-related CPT codes:');
        for (let i = 1; i < shoulderResults.length; i += 2) {
          const key = shoulderResults[i];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = await (client).call('JSON.GET', key);
          console.log(`${key}: ${data}`);
        }
      } else {
        console.log('No shoulder-related CPT codes found');
      }
    } catch (error) {
      console.error('Error executing direct shoulder search:', error.message);
    }
    
  } catch (error) {
    console.error('Error testing Redis search queries:', error);
  } finally {
    await closeRedisConnection();
  }
}

testRedisSearchQuery();