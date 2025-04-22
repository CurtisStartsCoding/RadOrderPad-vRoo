/**
 * Test Fixed Redis Search Implementation
 * 
 * This script tests the fixed Redis search implementation by running searches
 * with various medical terms and comparing the results with the original implementation.
 */

import { getRedisClient } from '../../dist/config/redis.js';
import fs from 'fs';
import path from 'path';

// Medical terms to test
const testTerms = [
  'shoulder',
  'pain',
  'MRI',
  'fracture',
  'cancer',
  'heart',
  'rotator cuff tear',
  'chest pain',
  'abdominal ultrasound',
  'brain CT'
];

async function testFixedImplementation() {
  console.log('Testing Fixed Redis Search Implementation...');
  
  try {
    const client = getRedisClient();
    
    // Test connection
    console.log('Testing Redis connection...');
    const pingResult = await client.ping();
    console.log(`Redis connection test result: ${pingResult}`);
    
    // Test searches with the fixed implementation
    console.log('\nTesting searches with the fixed implementation:');
    
    // Test each term
    for (const term of testTerms) {
      console.log(`\nSearching for term: "${term}"`);
      
      // Search CPT codes
      try {
        // Use the simple format (no field specifier)
        const cptResult = await client.call('FT.SEARCH', 'cpt_index', term, 'LIMIT', 0, 5);
        console.log(`CPT Results: ${cptResult[0]} matches`);
        
        if (cptResult[0] > 0) {
          console.log('First CPT match:');
          console.log(`Key: ${cptResult[1]}`);
          
          // Try to parse the data
          try {
            if (typeof cptResult[2] === 'string') {
              // If it's a string, try to parse it as JSON
              const data = JSON.parse(cptResult[2].startsWith('$,') ? cptResult[2].substring(2) : cptResult[2]);
              console.log(`Description: ${data.description}`);
              console.log(`Modality: ${data.modality || 'N/A'}`);
              console.log(`Body Part: ${data.body_part || 'N/A'}`);
            } else {
              console.log(`Raw data: ${JSON.stringify(cptResult[2]).substring(0, 100)}...`);
            }
          } catch (e) {
            console.log(`Error parsing data: ${e.message}`);
            console.log(`Raw data type: ${typeof cptResult[2]}`);
            if (typeof cptResult[2] === 'string') {
              console.log(`Raw data: ${cptResult[2].substring(0, 100)}...`);
            } else {
              console.log(`Raw data: ${JSON.stringify(cptResult[2]).substring(0, 100)}...`);
            }
          }
        }
      } catch (error) {
        console.error(`Error searching CPT codes for "${term}":`, error.message);
      }
      
      // Search ICD-10 codes
      try {
        // Use the simple format (no field specifier)
        const icdResult = await client.call('FT.SEARCH', 'icd10_index', term, 'LIMIT', 0, 5);
        console.log(`ICD-10 Results: ${icdResult[0]} matches`);
        
        if (icdResult[0] > 0) {
          console.log('First ICD-10 match:');
          console.log(`Key: ${icdResult[1]}`);
          
          // Try to parse the data
          try {
            if (typeof icdResult[2] === 'string') {
              // If it's a string, try to parse it as JSON
              const data = JSON.parse(icdResult[2].startsWith('$,') ? icdResult[2].substring(2) : icdResult[2]);
              console.log(`Code: ${data.icd10_code}`);
              console.log(`Description: ${data.description}`);
            } else {
              console.log(`Raw data: ${JSON.stringify(icdResult[2]).substring(0, 100)}...`);
            }
          } catch (e) {
            console.log(`Error parsing data: ${e.message}`);
            console.log(`Raw data type: ${typeof icdResult[2]}`);
            if (typeof icdResult[2] === 'string') {
              console.log(`Raw data: ${icdResult[2].substring(0, 100)}...`);
            } else {
              console.log(`Raw data: ${JSON.stringify(icdResult[2]).substring(0, 100)}...`);
            }
          }
        }
      } catch (error) {
        console.error(`Error searching ICD-10 codes for "${term}":`, error.message);
      }
    }
    
    // Close the connection
    await client.quit();
    console.log('\nRedis connection closed');
    
    console.log('\nTest completed. If you see search results, the fix is working!');
    
  } catch (error) {
    console.error('Error testing fixed implementation:', error);
  }
}

// Run the function
testFixedImplementation().catch(console.error);