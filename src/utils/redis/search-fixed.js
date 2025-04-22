/**
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
 * @param {string} _field - The field to search in (optional, currently unused)
 * @returns {string} - The formatted query
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function formatSearchQuery(term, _field = null) {
  // Use the simple format (no field specifier) which works
  return term;
  
  // Alternative: Use the escaped JSON path format if needed
  // return _field ? "@\$\." + _field + ":(" + term + ")" : term;
}

/**
 * Search for ICD-10 codes using RedisSearch
 * @param {string[]} keywords - Keywords to search for
 * @param {Object} _categorizedKeywords - Categorized keywords (currently unused)
 * @returns {Promise<Array>} - Array of ICD-10 codes
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function searchICD10Codes(keywords, _categorizedKeywords) {
  try {
    const client = getRedisClient();
    
    // Build the search query using the fixed format
    const searchTerms = keywords.join(' | ');
    const query = formatSearchQuery(searchTerms);
    
    logger.debug(`Searching ICD-10 codes with query: ${query}`);
    
    // Execute the search
    const result = await client.call('FT.SEARCH', 'icd10_index', query, 'LIMIT', 0, 20);
    
    // Process the results
    const totalResults = result[0];
    logger.debug(`Found ${totalResults} ICD-10 codes with RedisSearch`);
    
    const icd10Rows = [];
    
    // Results are returned as [total, key1, val1, key2, val2, ...]
    for (let i = 1; i < result.length; i += 2) {
      // Key is available but not used in this implementation
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _key = result[i];
      const data = result[i + 1];
      
      // Parse the JSON data (remove the $, prefix)
      try {
        const parsedData = JSON.parse(data.substring(2));
        icd10Rows.push(parsedData);
      } catch (error) {
        logger.error(`Error parsing ICD-10 data: ${error.message}`);
      }
    }
    
    return icd10Rows;
  } catch (error) {
    logger.error(`Error searching ICD-10 codes: ${error.message}`);
    return [];
  }
}

/**
 * Search for CPT codes using RedisSearch
 * @param {string[]} keywords - Keywords to search for
 * @param {Object} _categorizedKeywords - Categorized keywords (currently unused)
 * @returns {Promise<Array>} - Array of CPT codes
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function searchCPTCodes(keywords, _categorizedKeywords) {
  try {
    const client = getRedisClient();
    
    // Build the search query using the fixed format
    const searchTerms = keywords.join(' | ');
    const query = formatSearchQuery(searchTerms);
    
    logger.debug(`Searching CPT codes with query: ${query}`);
    
    // Execute the search
    const result = await client.call('FT.SEARCH', 'cpt_index', query, 'LIMIT', 0, 20);
    
    // Process the results
    const totalResults = result[0];
    logger.debug(`Found ${totalResults} CPT codes with RedisSearch`);
    
    const cptRows = [];
    
    // Results are returned as [total, key1, val1, key2, val2, ...]
    for (let i = 1; i < result.length; i += 2) {
      // Key is available but not used in this implementation
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _key = result[i];
      const data = result[i + 1];
      
      // Parse the JSON data (remove the $, prefix)
      try {
        const parsedData = JSON.parse(data.substring(2));
        cptRows.push(parsedData);
      } catch (error) {
        logger.error(`Error parsing CPT data: ${error.message}`);
      }
    }
    
    return cptRows;
  } catch (error) {
    logger.error(`Error searching CPT codes: ${error.message}`);
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
        const mappingKey = `mapping:${icd10.icd10_code}:${cpt.cpt_code}`;
        
        try {
          const data = await client.call('JSON.GET', mappingKey);
          if (data) {
            const parsedData = JSON.parse(data);
            mappingRows.push(parsedData);
          }
        } catch (error) {
          // Ignore errors for non-existent keys
          if (!error.message.includes('key does not exist')) {
            logger.error(`Error getting mapping ${mappingKey}: ${error.message}`);
          }
        }
      }
    }
    
    logger.debug(`Found ${mappingRows.length} mappings from Redis`);
    return mappingRows;
  } catch (error) {
    logger.error(`Error getting mappings: ${error.message}`);
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
      const markdownKey = `markdown:${icd10.icd10_code}`;
      
      try {
        const data = await client.call('JSON.GET', markdownKey);
        if (data) {
          const parsedData = JSON.parse(data);
          markdownRows.push(parsedData);
        }
      } catch (error) {
        // Ignore errors for non-existent keys
        if (!error.message.includes('key does not exist')) {
          logger.error(`Error getting markdown doc ${markdownKey}: ${error.message}`);
        }
      }
    }
    
    logger.debug(`Found ${markdownRows.length} markdown docs from Redis`);
    return markdownRows;
  } catch (error) {
    logger.error(`Error getting markdown docs: ${error.message}`);
    return [];
  }
}

export default {
  searchICD10Codes,
  searchCPTCodes,
  getMappings,
  getMarkdownDocs
};