/**
 * Script to test Redis search queries with a fix
 */
import { getRedisClient, closeRedisConnection } from '../dist/config/redis.js';
import { categorizeKeywords } from '../dist/utils/database/keyword-categorizer.js';
import { processSearchTerms } from '../dist/utils/redis/search/common.js';

async function testRedisSearchQueryFix() {
  try {
    console.log('Testing Redis search queries with a fix...');
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
    
    // Test CPT search query with fix
    console.log('\nTesting CPT search query with fix...');
    
    // Build the query with OR logic instead of AND
    // We'll search for documents that match any of the keywords in description
    // OR have the modality MRI OR have the body part shoulder
    let cptQuery = `@description:(${searchTerms})`;
    
    console.log('CPT query (description only):', cptQuery);
    
    // Execute the CPT search with description only
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cptResults = await (client).call(
        'FT.SEARCH',
        'cpt_index',
        cptQuery,
        'LIMIT', '0', '10',
        'RETURN', '4', '$.cpt_code', '$.description', '$.modality', '$.body_part'
      );
      
      console.log('CPT search results (description only):', cptResults);
      
      if (cptResults[0] > 0) {
        console.log('Found CPT codes (description only):');
        for (let i = 1; i < cptResults.length; i += 2) {
          const key = cptResults[i];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = await (client).call('JSON.GET', key);
          console.log(`${key}: ${data}`);
        }
      } else {
        console.log('No CPT codes found (description only)');
      }
    } catch (error) {
      console.error('Error executing CPT search (description only):', error.message);
    }
    
    // Try with modality only
    if (categorizedKeywords.modalities.length > 0) {
      const modalities = categorizedKeywords.modalities.join('|');
      const modalityQuery = `@modality:{${modalities}}`;
      console.log('\nCPT query (modality only):', modalityQuery);
      
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const modalityResults = await (client).call(
          'FT.SEARCH',
          'cpt_index',
          modalityQuery,
          'LIMIT', '0', '10',
          'RETURN', '4', '$.cpt_code', '$.description', '$.modality', '$.body_part'
        );
        
        console.log('CPT search results (modality only):', modalityResults);
        
        if (modalityResults[0] > 0) {
          console.log('Found CPT codes (modality only):');
          for (let i = 1; i < modalityResults.length; i += 2) {
            const key = modalityResults[i];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = await (client).call('JSON.GET', key);
            console.log(`${key}: ${data}`);
          }
        } else {
          console.log('No CPT codes found (modality only)');
        }
      } catch (error) {
        console.error('Error executing CPT search (modality only):', error.message);
      }
    }
    
    // Try with body part only
    if (categorizedKeywords.anatomyTerms.length > 0) {
      const bodyParts = categorizedKeywords.anatomyTerms.join('|');
      const bodyPartQuery = `@body_part:{${bodyParts}}`;
      console.log('\nCPT query (body part only):', bodyPartQuery);
      
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bodyPartResults = await (client).call(
          'FT.SEARCH',
          'cpt_index',
          bodyPartQuery,
          'LIMIT', '0', '10',
          'RETURN', '4', '$.cpt_code', '$.description', '$.modality', '$.body_part'
        );
        
        console.log('CPT search results (body part only):', bodyPartResults);
        
        if (bodyPartResults[0] > 0) {
          console.log('Found CPT codes (body part only):');
          for (let i = 1; i < bodyPartResults.length; i += 2) {
            const key = bodyPartResults[i];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = await (client).call('JSON.GET', key);
            console.log(`${key}: ${data}`);
          }
        } else {
          console.log('No CPT codes found (body part only)');
        }
      } catch (error) {
        console.error('Error executing CPT search (body part only):', error.message);
      }
    }
    
    // Try with a combined query using OR
    console.log('\nTesting CPT search query with OR logic...');
    
    // Build the query with OR logic
    let orQuery = '';
    
    // Add description terms
    orQuery += `@description:(${searchTerms})`;
    
    // Add modality filter with OR
    if (categorizedKeywords.modalities.length > 0) {
      const modalities = categorizedKeywords.modalities.join('|');
      orQuery += ` | @modality:{${modalities}}`;
    }
    
    // Add body part filter with OR
    if (categorizedKeywords.anatomyTerms.length > 0) {
      const bodyParts = categorizedKeywords.anatomyTerms.join('|');
      orQuery += ` | @body_part:{${bodyParts}}`;
    }
    
    console.log('CPT query with OR logic:', orQuery);
    
    // Execute the CPT search with OR logic
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const orResults = await (client).call(
        'FT.SEARCH',
        'cpt_index',
        orQuery,
        'LIMIT', '0', '10',
        'RETURN', '4', '$.cpt_code', '$.description', '$.modality', '$.body_part'
      );
      
      console.log('CPT search results with OR logic:', orResults);
      
      if (orResults[0] > 0) {
        console.log('Found CPT codes with OR logic:');
        for (let i = 1; i < orResults.length; i += 2) {
          const key = orResults[i];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = await (client).call('JSON.GET', key);
          console.log(`${key}: ${data}`);
        }
      } else {
        console.log('No CPT codes found with OR logic');
      }
    } catch (error) {
      console.error('Error executing CPT search with OR logic:', error.message);
    }
    
  } catch (error) {
    console.error('Error testing Redis search queries with fix:', error);
  } finally {
    await closeRedisConnection();
  }
}

testRedisSearchQueryFix();