/**
 * Test Weighted Search for All Data Types
 * 
 * This script tests the weighted search implementation for all data types:
 * - CPT codes
 * - ICD-10 codes
 * - Mappings
 * - Markdown documents
 */

import { getRedisClient } from '../../dist/config/redis.js';

async function testWeightedSearchAll() {
  console.log('Testing Weighted Search for All Data Types...');
  
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
    
    // Test weighted searches for each term
    for (const term of testTerms) {
      console.log(`\n=== Searching for: "${term}" ===`);
      
      // Test CPT search
      console.log('\nCPT Search with scores:');
      try {
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
      
      // Test ICD-10 search
      console.log('\nICD-10 Search with scores:');
      try {
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
      
      // Test mapping search
      console.log('\nMapping Search with scores:');
      try {
        // Check if mapping_index exists
        try {
          await client.call('FT.INFO', 'mapping_index');
          
          const mappingResult = await client.call(
            'FT.SEARCH',
            'mapping_index',
            term,
            'WITHSCORES',
            'LIMIT', 0, 5,
            'RETURN', 7, 
            '$.icd10_code', 
            '$.cpt_code', 
            '$.icd10_description', 
            '$.cpt_description', 
            '$.appropriateness', 
            '$.refined_justification', 
            '$.evidence_source'
          );
          
          const totalResults = mappingResult[0];
          console.log(`Found ${totalResults} mappings`);
          
          if (totalResults > 0) {
            for (let i = 1; i < mappingResult.length; i += 3) {
              const key = mappingResult[i];
              const score = parseFloat(mappingResult[i + 1]);
              const data = mappingResult[i + 2];
              
              console.log(`\nKey: ${key}`);
              console.log(`Score: ${score.toFixed(2)}`);
              
              // Parse the data fields
              const fields = {};
              for (let j = 0; j < data.length; j += 2) {
                fields[data[j]] = data[j + 1];
              }
              
              console.log(`ICD-10 Code: ${fields['$.icd10_code'] || 'N/A'}`);
              console.log(`CPT Code: ${fields['$.cpt_code'] || 'N/A'}`);
              console.log(`ICD-10 Description: ${fields['$.icd10_description'] || 'N/A'}`);
              console.log(`CPT Description: ${fields['$.cpt_description'] || 'N/A'}`);
              console.log(`Appropriateness: ${fields['$.appropriateness'] || 'N/A'}`);
              console.log(`Justification: ${fields['$.refined_justification'] ? fields['$.refined_justification'].substring(0, 100) + '...' : 'N/A'}`);
            }
          }
        } catch (error) {
          if (error.message.includes('Unknown index name')) {
            console.log('Mapping index does not exist yet. Run create-mapping-markdown-indexes.js to create it.');
          } else {
            throw error;
          }
        }
      } catch (error) {
        console.error(`Error searching mappings for "${term}":`, error.message);
      }
      
      // Test markdown search
      console.log('\nMarkdown Search with scores:');
      try {
        // Check if markdown_index exists
        try {
          await client.call('FT.INFO', 'markdown_index');
          
          const markdownResult = await client.call(
            'FT.SEARCH',
            'markdown_index',
            term,
            'WITHSCORES',
            'LIMIT', 0, 5,
            'RETURN', 4, 
            '$.icd10_code', 
            '$.icd10_description', 
            '$.content', 
            '$.content_preview'
          );
          
          const totalResults = markdownResult[0];
          console.log(`Found ${totalResults} markdown documents`);
          
          if (totalResults > 0) {
            for (let i = 1; i < markdownResult.length; i += 3) {
              const key = markdownResult[i];
              const score = parseFloat(markdownResult[i + 1]);
              const data = markdownResult[i + 2];
              
              console.log(`\nKey: ${key}`);
              console.log(`Score: ${score.toFixed(2)}`);
              
              // Parse the data fields
              const fields = {};
              for (let j = 0; j < data.length; j += 2) {
                fields[data[j]] = data[j + 1];
              }
              
              console.log(`ICD-10 Code: ${fields['$.icd10_code'] || 'N/A'}`);
              console.log(`ICD-10 Description: ${fields['$.icd10_description'] || 'N/A'}`);
              console.log(`Content Preview: ${fields['$.content_preview'] ? fields['$.content_preview'].substring(0, 100) + '...' : 'N/A'}`);
            }
          }
        } catch (error) {
          if (error.message.includes('Unknown index name')) {
            console.log('Markdown index does not exist yet. Run create-mapping-markdown-indexes.js to create it.');
          } else {
            throw error;
          }
        }
      } catch (error) {
        console.error(`Error searching markdown docs for "${term}":`, error.message);
      }
    }
    
    // Close the connection
    await client.quit();
    console.log('\nRedis connection closed');
    
  } catch (error) {
    console.error('Error testing weighted search:', error);
  }
}

// Run the function
testWeightedSearchAll().catch(console.error);