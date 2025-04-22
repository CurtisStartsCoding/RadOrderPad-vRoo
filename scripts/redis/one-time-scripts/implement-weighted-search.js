/**
 * Implement Weighted Search in Redis
 * 
 * This script demonstrates how to implement weighted search in Redis
 * using the existing index weights and the WITHSCORES option.
 */

import { getRedisClient } from '../../dist/config/redis.js';

async function implementWeightedSearch() {
  console.log('Implementing Weighted Search in Redis...');
  
  try {
    const client = getRedisClient();
    
    // Test connection
    console.log('Testing Redis connection...');
    const pingResult = await client.ping();
    console.log(`Redis connection test result: ${pingResult}`);
    
    // Medical terms to test
    const testTerms = [
      'shoulder pain',
      'MRI brain',
      'chest x-ray',
      'abdominal ultrasound',
      'rotator cuff tear'
    ];
    
    // Test weighted searches
    console.log('\nTesting weighted searches:');
    
    for (const term of testTerms) {
      console.log(`\n=== Searching for: "${term}" ===`);
      
      // CPT Search with scores
      console.log('\nCPT Search with scores:');
      try {
        // Use WITHSCORES to get relevance scores
        // Note: We don't use SORTBY because _score is not in the schema
        const cptResult = await client.call(
          'FT.SEARCH',
          'cpt_index',
          term,
          'WITHSCORES',
          'LIMIT', 0, 5,
          'RETURN', 4, '$.cpt_code', '$.description', '$.modality', '$.body_part'
        );
        
        const totalResults = cptResult[0];
        console.log(`Found ${totalResults} CPT codes`);
        
        if (totalResults > 0) {
          // Results format with WITHSCORES: [total, key1, score1, fields1, key2, score2, fields2, ...]
          for (let i = 1; i < cptResult.length; i += 3) {
            const key = cptResult[i];
            const score = parseFloat(cptResult[i + 1]);
            const data = cptResult[i + 2];
            
            console.log(`\nKey: ${key}`);
            console.log(`Score: ${score.toFixed(2)}`);
            
            // Parse the data fields
            const fields = {};
            for (let j = 0; j < data.length; j += 2) {
              fields[data[j]] = data[j + 1];
            }
            
            console.log(`CPT Code: ${fields['$.cpt_code'] || 'N/A'}`);
            console.log(`Description: ${fields['$.description'] || 'N/A'}`);
            console.log(`Modality: ${fields['$.modality'] || 'N/A'}`);
            console.log(`Body Part: ${fields['$.body_part'] || 'N/A'}`);
          }
        }
      } catch (error) {
        console.error(`Error searching CPT codes for "${term}":`, error.message);
      }
      
      // ICD-10 Search with scores
      console.log('\nICD-10 Search with scores:');
      try {
        // Use WITHSCORES to get relevance scores
        // Note: We don't use SORTBY because _score is not in the schema
        const icdResult = await client.call(
          'FT.SEARCH',
          'icd10_index',
          term,
          'WITHSCORES',
          'LIMIT', 0, 5,
          'RETURN', 3, '$.icd10_code', '$.description', '$.clinical_notes'
        );
        
        const totalResults = icdResult[0];
        console.log(`Found ${totalResults} ICD-10 codes`);
        
        if (totalResults > 0) {
          // Results format with WITHSCORES: [total, key1, score1, fields1, key2, score2, fields2, ...]
          for (let i = 1; i < icdResult.length; i += 3) {
            const key = icdResult[i];
            const score = parseFloat(icdResult[i + 1]);
            const data = icdResult[i + 2];
            
            console.log(`\nKey: ${key}`);
            console.log(`Score: ${score.toFixed(2)}`);
            
            // Parse the data fields
            const fields = {};
            for (let j = 0; j < data.length; j += 2) {
              fields[data[j]] = data[j + 1];
            }
            
            console.log(`ICD-10 Code: ${fields['$.icd10_code'] || 'N/A'}`);
            console.log(`Description: ${fields['$.description'] || 'N/A'}`);
            console.log(`Clinical Notes: ${fields['$.clinical_notes'] ? fields['$.clinical_notes'].substring(0, 100) + '...' : 'N/A'}`);
          }
        }
      } catch (error) {
        console.error(`Error searching ICD-10 codes for "${term}":`, error.message);
      }
    }
    
    // Create a function to implement weighted search in the codebase
    console.log('\nCreating weighted search implementation...');
    
    const weightedSearchImplementation = `/**
 * Weighted search implementation for CPT codes
 * @param {string[]} keywords - Keywords to search for
 * @param {Object} categorizedKeywords - Categorized keywords
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise<Array>} - Array of CPT codes with scores
 */
export async function searchCPTCodesWithScores(keywords, categorizedKeywords, limit = 20) {
  try {
    const client = getRedisClient();
    
    // Process search terms
    const searchTerms = keywords.join(' | ');
    
    // Execute the search with scores
    const result = await client.call(
      'FT.SEARCH',
      'cpt_index',
      searchTerms,
      'WITHSCORES',
      'LIMIT', '0', limit.toString(),
      'RETURN', '4', '$.cpt_code', '$.description', '$.modality', '$.body_part'
    );
    
    // Process the results
    const totalResults = result[0];
    logger.debug(\`Found \${totalResults} CPT codes with weighted search\`);
    
    const cptRows = [];
    
    // Results format with WITHSCORES: [total, key1, score1, fields1, key2, score2, fields2, ...]
    for (let i = 1; i < result.length; i += 3) {
      const key = result[i];
      const score = parseFloat(result[i + 1]);
      const data = result[i + 2];
      
      // Extract the CPT code from the key (format: cpt:CODE)
      const cptCode = key.replace('cpt:', '');
      
      // Create a CPTRow object with score
      const row = {
        cpt_code: cptCode,
        description: '',
        modality: '',
        body_part: '',
        score: score
      };
      
      // Process the returned fields
      for (let j = 0; j < data.length; j += 2) {
        const fieldName = data[j];
        const fieldValue = data[j + 1];
        
        // Map the field names to the CPTRow properties
        switch (fieldName) {
          case '$.description':
            row.description = fieldValue;
            break;
          case '$.modality':
            row.modality = fieldValue;
            break;
          case '$.body_part':
            row.body_part = fieldValue;
            break;
        }
      }
      
      cptRows.push(row);
    }
    
    return cptRows;
  } catch (error) {
    logger.error(\`Error searching CPT codes with weighted search: \${error.message}\`);
    return [];
  }
}

/**
 * Weighted search implementation for ICD-10 codes
 * @param {string[]} keywords - Keywords to search for
 * @param {Object} categorizedKeywords - Categorized keywords
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise<Array>} - Array of ICD-10 codes with scores
 */
export async function searchICD10CodesWithScores(keywords, categorizedKeywords, limit = 20) {
  try {
    const client = getRedisClient();
    
    // Process search terms
    const searchTerms = keywords.join(' | ');
    
    // Execute the search with scores
    const result = await client.call(
      'FT.SEARCH',
      'icd10_index',
      searchTerms,
      'WITHSCORES',
      'LIMIT', '0', limit.toString(),
      'RETURN', '5', '$.icd10_code', '$.description', '$.clinical_notes', '$.imaging_modalities', '$.primary_imaging'
    );
    
    // Process the results
    const totalResults = result[0];
    logger.debug(\`Found \${totalResults} ICD-10 codes with weighted search\`);
    
    const icd10Rows = [];
    
    // Results format with WITHSCORES: [total, key1, score1, fields1, key2, score2, fields2, ...]
    for (let i = 1; i < result.length; i += 3) {
      const key = result[i];
      const score = parseFloat(result[i + 1]);
      const data = result[i + 2];
      
      // Extract the ICD-10 code from the key (format: icd10:CODE)
      const icd10Code = key.replace('icd10:', '');
      
      // Create an ICD10Row object with score
      const row = {
        icd10_code: icd10Code,
        description: '',
        clinical_notes: '',
        imaging_modalities: '',
        primary_imaging: '',
        score: score
      };
      
      // Process the returned fields
      for (let j = 0; j < data.length; j += 2) {
        const fieldName = data[j];
        const fieldValue = data[j + 1];
        
        // Map the field names to the ICD10Row properties
        switch (fieldName) {
          case '$.description':
            row.description = fieldValue;
            break;
          case '$.clinical_notes':
            row.clinical_notes = fieldValue;
            break;
          case '$.imaging_modalities':
            row.imaging_modalities = fieldValue;
            break;
          case '$.primary_imaging':
            row.primary_imaging = fieldValue;
            break;
        }
      }
      
      icd10Rows.push(row);
    }
    
    return icd10Rows;
  } catch (error) {
    logger.error(\`Error searching ICD-10 codes with weighted search: \${error.message}\`);
    return [];
  }
}`;
    
    console.log('\nWeighted search implementation created. You can add these functions to your search files.');
    
    // Close the connection
    await client.quit();
    console.log('\nRedis connection closed');
    
  } catch (error) {
    console.error('Error implementing weighted search:', error);
  }
}

// Run the function
implementWeightedSearch().catch(console.error);