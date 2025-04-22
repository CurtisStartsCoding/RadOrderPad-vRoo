/**
 * Redis Search Implementation Fix
 * 
 * This script creates a fixed version of the search implementation that uses
 * the correct query format for RedisSearch.
 */

import { getRedisClient } from '../../dist/config/redis.js';
import fs from 'fs';
import path from 'path';

async function implementRedisSearchFix() {
  console.log('Implementing Redis Search Fix...');
  
  // Test the fix with some sample searches
  try {
    const client = getRedisClient();
    
    // Test connection
    console.log('Testing Redis connection...');
    const pingResult = await client.ping();
    console.log(`Redis connection test result: ${pingResult}`);
    
    // Define test keywords
    const keywords = ['shoulder', 'pain', 'MRI', 'fracture', 'cancer', 'heart'];
    
    console.log('\nTesting searches with the fixed query format:');
    
    // Test both working formats
    const queryFormats = [
      {
        name: 'No field specifier (simple)',
        formatQuery: (term) => term,
      },
      {
        name: 'Escaped JSON path',
        formatQuery: (term) => `@\\$\\.description:(${term})`,
      }
    ];
    
    // Test each format with each keyword
    for (const format of queryFormats) {
      console.log(`\n=== Using ${format.name} format ===`);
      
      for (const keyword of keywords) {
        const query = format.formatQuery(keyword);
        console.log(`\nSearching for "${keyword}" with query: ${query}`);
        
        try {
          // Search CPT codes
          const cptResult = await client.call('FT.SEARCH', 'cpt_index', query, 'LIMIT', 0, 5);
          console.log(`CPT Results: ${cptResult[0]} matches`);
          
          if (cptResult[0] > 0) {
            console.log('First CPT match:');
            console.log(`Key: ${cptResult[1]}`);
            // Extract just the description for readability
            try {
              // Check if the result is a string or an object
              if (typeof cptResult[2] === 'string') {
                // If it's a string, try to parse it as JSON
                const data = JSON.parse(cptResult[2].startsWith('$,') ? cptResult[2].substring(2) : cptResult[2]);
                console.log(`Description: ${data.description}`);
              } else {
                // If it's already an object, use it directly
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
          
          // Search ICD-10 codes
          const icdResult = await client.call('FT.SEARCH', 'icd10_index', query, 'LIMIT', 0, 5);
          console.log(`ICD-10 Results: ${icdResult[0]} matches`);
          
          if (icdResult[0] > 0) {
            console.log('First ICD-10 match:');
            console.log(`Key: ${icdResult[1]}`);
            // Extract just the description for readability
            try {
              // Check if the result is a string or an object
              if (typeof icdResult[2] === 'string') {
                // If it's a string, try to parse it as JSON
                const data = JSON.parse(icdResult[2].startsWith('$,') ? icdResult[2].substring(2) : icdResult[2]);
                console.log(`Description: ${data.description}`);
              } else {
                // If it's already an object, use it directly
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
          console.error(`Error searching for "${keyword}":`, error.message);
        }
      }
    }
    
    // Create the fixed search implementation
    console.log('\nCreating fixed search implementation...');
    
    // Define the fixed search functions
    const fixedSearchImplementation = `/**
 * Fixed Redis Search Implementation
 * 
 * This module provides functions for searching medical codes using RedisSearch
 * with the correct query format.
 */

import { getRedisClient } from '../../config/redis.js';
import logger from '../../utils/logger.js';

/**
 * Format a RedisSearch query
 * @param {string} term - The search term
 * @param {string} field - The field to search in (optional)
 * @returns {string} - The formatted query
 */
function formatSearchQuery(term, field = null) {
  // Use the simple format (no field specifier) which works
  return term;
  
  // Alternative: Use the escaped JSON path format if needed
  // return field ? "@\\$\\." + field + ":(" + term + ")" : term;
}

/**
 * Search for ICD-10 codes using RedisSearch
 * @param {string[]} keywords - Keywords to search for
 * @param {Object} categorizedKeywords - Categorized keywords
 * @returns {Promise<Array>} - Array of ICD-10 codes
 */
export async function searchICD10Codes(keywords, categorizedKeywords) {
  try {
    const client = getRedisClient();
    
    // Build the search query using the fixed format
    const searchTerms = keywords.join(' | ');
    const query = formatSearchQuery(searchTerms);
    
    logger.debug(\`Searching ICD-10 codes with query: \${query}\`);
    
    // Execute the search
    const result = await client.call('FT.SEARCH', 'icd10_index', query, 'LIMIT', 0, 20);
    
    // Process the results
    const totalResults = result[0];
    logger.debug(\`Found \${totalResults} ICD-10 codes with RedisSearch\`);
    
    const icd10Rows = [];
    
    // Results are returned as [total, key1, val1, key2, val2, ...]
    for (let i = 1; i < result.length; i += 2) {
      const key = result[i];
      const data = result[i + 1];
      
      // Parse the JSON data (remove the $, prefix)
      try {
        const parsedData = JSON.parse(data.substring(2));
        icd10Rows.push(parsedData);
      } catch (error) {
        logger.error(\`Error parsing ICD-10 data: \${error.message}\`);
      }
    }
    
    return icd10Rows;
  } catch (error) {
    logger.error(\`Error searching ICD-10 codes: \${error.message}\`);
    return [];
  }
}

/**
 * Search for CPT codes using RedisSearch
 * @param {string[]} keywords - Keywords to search for
 * @param {Object} categorizedKeywords - Categorized keywords
 * @returns {Promise<Array>} - Array of CPT codes
 */
export async function searchCPTCodes(keywords, categorizedKeywords) {
  try {
    const client = getRedisClient();
    
    // Build the search query using the fixed format
    const searchTerms = keywords.join(' | ');
    const query = formatSearchQuery(searchTerms);
    
    logger.debug(\`Searching CPT codes with query: \${query}\`);
    
    // Execute the search
    const result = await client.call('FT.SEARCH', 'cpt_index', query, 'LIMIT', 0, 20);
    
    // Process the results
    const totalResults = result[0];
    logger.debug(\`Found \${totalResults} CPT codes with RedisSearch\`);
    
    const cptRows = [];
    
    // Results are returned as [total, key1, val1, key2, val2, ...]
    for (let i = 1; i < result.length; i += 2) {
      const key = result[i];
      const data = result[i + 1];
      
      // Parse the JSON data (remove the $, prefix)
      try {
        const parsedData = JSON.parse(data.substring(2));
        cptRows.push(parsedData);
      } catch (error) {
        logger.error(\`Error parsing CPT data: \${error.message}\`);
      }
    }
    
    return cptRows;
  } catch (error) {
    logger.error(\`Error searching CPT codes: \${error.message}\`);
    return [];
  }
}

/**
 * Get mappings between ICD-10 and CPT codes
 * @param {Array} icd10Rows - ICD-10 codes
 * @param {Array} cptRows - CPT codes
 * @returns {Promise<Array>} - Array of mappings
 */
export async function getMappings(icd10Rows, cptRows) {
  try {
    const client = getRedisClient();
    const mappingRows = [];
    
    // Get mappings for each ICD-10 code
    for (const icd10 of icd10Rows) {
      for (const cpt of cptRows) {
        const mappingKey = \`mapping:\${icd10.icd10_code}:\${cpt.cpt_code}\`;
        
        try {
          const data = await client.call('JSON.GET', mappingKey);
          if (data) {
            const parsedData = JSON.parse(data);
            mappingRows.push(parsedData);
          }
        } catch (error) {
          // Ignore errors for non-existent keys
          if (!error.message.includes('key does not exist')) {
            logger.error(\`Error getting mapping \${mappingKey}: \${error.message}\`);
          }
        }
      }
    }
    
    logger.debug(\`Found \${mappingRows.length} mappings from Redis\`);
    return mappingRows;
  } catch (error) {
    logger.error(\`Error getting mappings: \${error.message}\`);
    return [];
  }
}

/**
 * Get markdown docs for ICD-10 codes
 * @param {Array} icd10Rows - ICD-10 codes
 * @returns {Promise<Array>} - Array of markdown docs
 */
export async function getMarkdownDocs(icd10Rows) {
  try {
    const client = getRedisClient();
    const markdownRows = [];
    
    // Get markdown docs for each ICD-10 code
    for (const icd10 of icd10Rows) {
      const markdownKey = \`markdown:\${icd10.icd10_code}\`;
      
      try {
        const data = await client.call('JSON.GET', markdownKey);
        if (data) {
          const parsedData = JSON.parse(data);
          markdownRows.push(parsedData);
        }
      } catch (error) {
        // Ignore errors for non-existent keys
        if (!error.message.includes('key does not exist')) {
          logger.error(\`Error getting markdown doc \${markdownKey}: \${error.message}\`);
        }
      }
    }
    
    logger.debug(\`Found \${markdownRows.length} markdown docs from Redis\`);
    return markdownRows;
  } catch (error) {
    logger.error(\`Error getting markdown docs: \${error.message}\`);
    return [];
  }
}

export default {
  searchICD10Codes,
  searchCPTCodes,
  getMappings,
  getMarkdownDocs
};`;
    
    // Write the fixed implementation to a file
    const fixedFilePath = path.join(process.cwd(), 'src', 'utils', 'redis', 'search-fixed.js');
    fs.writeFileSync(fixedFilePath, fixedSearchImplementation);
    
    console.log(`Fixed search implementation written to: ${fixedFilePath}`);
    console.log('\nTo use the fixed implementation:');
    console.log('1. Rename the existing search.js file to search.js.bak');
    console.log('2. Rename search-fixed.js to search.js');
    console.log('3. Update any imports if necessary');
    
    // Close the connection
    await client.quit();
    console.log('\nRedis connection closed');
    
  } catch (error) {
    console.error('Error implementing Redis search fix:', error);
  }
}

// Run the function
implementRedisSearchFix().catch(console.error);