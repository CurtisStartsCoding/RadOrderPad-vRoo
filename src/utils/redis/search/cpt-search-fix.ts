/**
 * CPT code search using RedisSearch
 */
import { getRedisClient } from '../../../config/redis';
import { CPTRow } from '../../database/types';
import { CategorizedKeywords } from '../../database/types';
import { processSearchTerms, processRedisSearchResults, extractKeyFromRedisKey } from './common';

/**
 * Search for CPT codes using RedisSearch
 * @param keywords Keywords to search for
 * @param categorizedKeywords Optional pre-categorized keywords
 * @returns Array of CPT codes
 */
export async function searchCPTCodes(keywords: string[], categorizedKeywords?: CategorizedKeywords): Promise<CPTRow[]> {
  try {
    // Get Redis client
    const client = getRedisClient();
    
    // Process search terms
    const searchTerms = processSearchTerms(keywords);
    
    // Categorize keywords if not provided
    if (!categorizedKeywords) {
      categorizedKeywords = {
        anatomyTerms: keywords.filter(kw => 
          ['head', 'neck', 'shoulder', 'arm', 'elbow', 'wrist', 'hand', 'finger', 
           'chest', 'thorax', 'abdomen', 'pelvis', 'hip', 'leg', 'knee', 'ankle', 'foot', 'toe',
           'brain', 'spine', 'cervical', 'thoracic', 'lumbar', 'sacral', 'skull',
           'liver', 'kidney', 'spleen', 'pancreas', 'gallbladder', 'bladder', 'uterus', 'ovary', 'prostate',
           'lung', 'heart', 'aorta', 'artery', 'vein'].includes(kw.toLowerCase())
        ),
        modalities: keywords.filter(kw => 
          ['x-ray', 'xray', 'radiograph', 'ct', 'cat scan', 'computed tomography',
           'mri', 'magnetic resonance', 'ultrasound', 'sonogram', 'pet', 'nuclear',
           'angiogram', 'angiography', 'mammogram', 'mammography', 'dexa', 'bone density'].includes(kw.toLowerCase())
        ),
        symptoms: keywords.filter(kw => 
          !['head', 'neck', 'shoulder', 'arm', 'elbow', 'wrist', 'hand', 'finger', 
            'chest', 'thorax', 'abdomen', 'pelvis', 'hip', 'leg', 'knee', 'ankle', 'foot', 'toe',
            'brain', 'spine', 'cervical', 'thoracic', 'lumbar', 'sacral', 'skull',
            'liver', 'kidney', 'spleen', 'pancreas', 'gallbladder', 'bladder', 'uterus', 'ovary', 'prostate',
            'lung', 'heart', 'aorta', 'artery', 'vein',
            'x-ray', 'xray', 'radiograph', 'ct', 'cat scan', 'computed tomography',
            'mri', 'magnetic resonance', 'ultrasound', 'sonogram', 'pet', 'nuclear',
            'angiogram', 'angiography', 'mammogram', 'mammography', 'dexa', 'bone density'].includes(kw.toLowerCase())
        ),
        codes: keywords.filter(kw => kw.match(/^\d{5}$/))
      };
    }
    
    // Add code filter if we have specific codes
    if (categorizedKeywords.codes.length > 0) {
      const codes = categorizedKeywords.codes.filter(c => c.match(/^\d{5}$/));
      if (codes.length > 0) {
        // If we have specific CPT codes, search for those directly
        return await getCPTCodesByIds(codes);
      }
    }
    
    // Create an array to store all results
    const allResults: CPTRow[] = [];
    
    // Search by description - using simple format without field specifier
    const descriptionQuery = searchTerms;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const descriptionResults = await (client as any).call(
      'FT.SEARCH',
      'cpt_index',
      descriptionQuery,
      'LIMIT', '0', '10',
      'RETURN', '4', '$.cpt_code', '$.description', '$.modality', '$.body_part'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any[];
    
    // Process description results
    const descriptionRows = processRedisSearchResults<CPTRow>(descriptionResults, (key, data) => {
      // Extract the CPT code from the key (format: cpt:CODE)
      const cptCode = extractKeyFromRedisKey(key);
      
      // Create a CPTRow object
      const row: CPTRow = {
        cpt_code: cptCode,
        description: '',
        modality: '',
        body_part: ''
      };
      
      // Process the returned fields
      for (let j = 0; j < data.length; j += 2) {
        const fieldName = data[j] as string;
        const fieldValue = data[j + 1] as string;
        
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
      
      return row;
    });
    
    // Add description results to all results
    allResults.push(...descriptionRows);
    
    // Search by modality if we have modalities
    if (categorizedKeywords.modalities.length > 0) {
      const modalities = categorizedKeywords.modalities.join('|');
      // Use simple format without field specifier
      const modalityQuery = modalities;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const modalityResults = await (client as any).call(
        'FT.SEARCH',
        'cpt_index',
        modalityQuery,
        'LIMIT', '0', '10',
        'RETURN', '4', '$.cpt_code', '$.description', '$.modality', '$.body_part'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) as any[];
      
      // Process modality results
      const modalityRows = processRedisSearchResults<CPTRow>(modalityResults, (key, data) => {
        // Extract the CPT code from the key (format: cpt:CODE)
        const cptCode = extractKeyFromRedisKey(key);
        
        // Create a CPTRow object
        const row: CPTRow = {
          cpt_code: cptCode,
          description: '',
          modality: '',
          body_part: ''
        };
        
        // Process the returned fields
        for (let j = 0; j < data.length; j += 2) {
          const fieldName = data[j] as string;
          const fieldValue = data[j + 1] as string;
          
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
        
        return row;
      });
      
      // Add modality results to all results
      for (const row of modalityRows) {
        // Check if this CPT code is already in the results
        if (!allResults.some(r => r.cpt_code === row.cpt_code)) {
          allResults.push(row);
        }
      }
    }
    
    // Search by body part if we have anatomy terms
    if (categorizedKeywords.anatomyTerms.length > 0) {
      const bodyParts = categorizedKeywords.anatomyTerms.join('|');
      // Use simple format without field specifier
      const bodyPartQuery = bodyParts;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bodyPartResults = await (client as any).call(
        'FT.SEARCH',
        'cpt_index',
        bodyPartQuery,
        'LIMIT', '0', '10',
        'RETURN', '4', '$.cpt_code', '$.description', '$.modality', '$.body_part'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) as any[];
      
      // Process body part results
      const bodyPartRows = processRedisSearchResults<CPTRow>(bodyPartResults, (key, data) => {
        // Extract the CPT code from the key (format: cpt:CODE)
        const cptCode = extractKeyFromRedisKey(key);
        
        // Create a CPTRow object
        const row: CPTRow = {
          cpt_code: cptCode,
          description: '',
          modality: '',
          body_part: ''
        };
        
        // Process the returned fields
        for (let j = 0; j < data.length; j += 2) {
          const fieldName = data[j] as string;
          const fieldValue = data[j + 1] as string;
          
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
        
        return row;
      });
      
      // Add body part results to all results
      for (const row of bodyPartRows) {
        // Check if this CPT code is already in the results
        if (!allResults.some(r => r.cpt_code === row.cpt_code)) {
          allResults.push(row);
        }
      }
    }
    
    // Return all results
    return allResults;
  } catch (error) {
    console.error('Error searching CPT codes with RedisSearch:', error);
    return [];
  }
}

/**
 * Get CPT codes by IDs
 * @param cptCodes Array of CPT codes
 * @returns Array of CPT codes
 */
export async function getCPTCodesByIds(cptCodes: string[]): Promise<CPTRow[]> {
  try {
    // Get Redis client
    const client = getRedisClient();
    
    // Create an array to store the results
    const results: CPTRow[] = [];
    
    // Get each CPT code
    for (const cptCode of cptCodes) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await (client as any).call('JSON.GET', `cpt:${cptCode}`);
        
        // Parse the JSON data
        const parsedData = JSON.parse(data);
        
        // Create a CPTRow object
        const row: CPTRow = {
          cpt_code: parsedData.cpt_code || cptCode,
          description: parsedData.description || '',
          modality: parsedData.modality || '',
          body_part: parsedData.body_part || ''
        };
        
        // Add the row to the results
        results.push(row);
      } catch (error) {
        console.error(`Error getting CPT code ${cptCode}:`, error);
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error getting CPT codes by IDs:', error);
    return [];
  }
}