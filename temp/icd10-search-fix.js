
// Common functions
function processSearchTerms(keywords) {
  return keywords.map(kw => kw.replace(/[^a-zA-Z0-9]/g, ' ')).join('|');
}

function extractKeyFromRedisKey(key) {
  return key.split(':')[1];
}

function processRedisSearchResults(results, processor) {
  const processedResults = [];
  
  // Skip the first element (count) and process the rest
  if (results && results.length > 1) {
    for (let i = 1; i < results.length; i += 2) {
      const key = results[i];
      const data = results[i + 1];
      processedResults.push(processor(key, data));
    }
  }
  
  return processedResults;
}

// Get Redis client
import { getRedisClient } from '../dist/config/redis.js';
/**
 * ICD-10 code search using RedisSearch
 */





/**
 * Search for ICD-10 codes using RedisSearch
 * @param keywords Keywords to search for
 * @returns Array of ICD-10 codes
 */
export async function searchICD10Codes(keywords)10Row[]> {
  try {
    // Get Redis client
    const client = getRedisClient();
    
    // Process search terms
    const searchTerms = processSearchTerms(keywords);
    
    // Categorize keywords
    const categorizedKeywords = {
      anatomyTerms.filter(kw => 
        ['head', 'neck', 'shoulder', 'arm', 'elbow', 'wrist', 'hand', 'finger', 
         'chest', 'thorax', 'abdomen', 'pelvis', 'hip', 'leg', 'knee', 'ankle', 'foot', 'toe',
         'brain', 'spine', 'cervical', 'thoracic', 'lumbar', 'sacral', 'skull',
         'liver', 'kidney', 'spleen', 'pancreas', 'gallbladder', 'bladder', 'uterus', 'ovary', 'prostate',
         'lung', 'heart', 'aorta', 'artery', 'vein'].includes(kw.toLowerCase())
      ),
      modalities.filter(kw => 
        ['x-ray', 'xray', 'radiograph', 'ct', 'cat scan', 'computed tomography',
         'mri', 'magnetic resonance', 'ultrasound', 'sonogram', 'pet', 'nuclear',
         'angiogram', 'angiography', 'mammogram', 'mammography', 'dexa', 'bone density'].includes(kw.toLowerCase())
      ),
      symptoms.filter(kw => 
        !['head', 'neck', 'shoulder', 'arm', 'elbow', 'wrist', 'hand', 'finger', 
          'chest', 'thorax', 'abdomen', 'pelvis', 'hip', 'leg', 'knee', 'ankle', 'foot', 'toe',
          'brain', 'spine', 'cervical', 'thoracic', 'lumbar', 'sacral', 'skull',
          'liver', 'kidney', 'spleen', 'pancreas', 'gallbladder', 'bladder', 'uterus', 'ovary', 'prostate',
          'lung', 'heart', 'aorta', 'artery', 'vein',
          'x-ray', 'xray', 'radiograph', 'ct', 'cat scan', 'computed tomography',
          'mri', 'magnetic resonance', 'ultrasound', 'sonogram', 'pet', 'nuclear',
          'angiogram', 'angiography', 'mammogram', 'mammography', 'dexa', 'bone density'].includes(kw.toLowerCase())
      ),
      codes.filter(kw => kw.match(/^[A-Z]\d{2}(\.\d{1,2})$/))
    };
    
    // Add code filter if we have specific codes
    if (categorizedKeywords.codes.length > 0) {
      const codes = categorizedKeywords.codes.filter(c => c.match(/^[A-Z]\d{2}(\.\d{1,2})$/));
      if (codes.length > 0) {
        // If we have specific ICD-10 codes, search for those directly
        return await getICD10CodesByIds(codes);
      }
    }
    
    // Create an array to store all results
    const allResults10Row[] = [];
    
    // Search by description and keywords
    let descriptionQuery = `@description:(${searchTerms})`;
    
    // If we have symptoms, use them for a more targeted search
    if (categorizedKeywords.symptoms.length > 0) {
      const symptoms = processSearchTerms(categorizedKeywords.symptoms);
      descriptionQuery = `@description:(${symptoms})`;
    }
    
    // Execute the search
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const descriptionResults = await (client as any).call(
      'FT.SEARCH',
      'icd10_index',
      descriptionQuery,
      'LIMIT', '0', '10',
      'RETURN', '5', '$.icd10_code', '$.description', '$.clinical_notes', '$.imaging_modalities', '$.primary_imaging'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any[];
    
    // Process description results
    const descriptionRows = processRedisSearchResults<ICD10Row>(descriptionResults, (key, data) => {
      // Extract the ICD-10 code from the key (format10:CODE)
      const icd10Code = extractKeyFromRedisKey(key);
      
      // Create an ICD10Row object
      const row10Row = {
        icd10_code10Code,
        description: '',
        clinical_notes: '',
        imaging_modalities: '',
        primary_imaging: ''
      };
      
      // Process the returned fields
      for (let j = 0; j < data.length; j += 2) {
        const fieldName = data[j] as string;
        const fieldValue = data[j + 1] as string;
        
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
      
      return row;
    });
    
    // Add description results to all results
    allResults.push(...descriptionRows);
    
    // If we have anatomy terms, search for them in the description
    if (categorizedKeywords.anatomyTerms.length > 0) {
      const anatomyTerms = processSearchTerms(categorizedKeywords.anatomyTerms);
      const anatomyQuery = `@description:(${anatomyTerms})`;
      
      // Execute the search
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anatomyResults = await (client as any).call(
        'FT.SEARCH',
        'icd10_index',
        anatomyQuery,
        'LIMIT', '0', '10',
        'RETURN', '5', '$.icd10_code', '$.description', '$.clinical_notes', '$.imaging_modalities', '$.primary_imaging'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) as any[];
      
      // Process anatomy results
      const anatomyRows = processRedisSearchResults<ICD10Row>(anatomyResults, (key, data) => {
        // Extract the ICD-10 code from the key (format10:CODE)
        const icd10Code = extractKeyFromRedisKey(key);
        
        // Create an ICD10Row object
        const row10Row = {
          icd10_code10Code,
          description: '',
          clinical_notes: '',
          imaging_modalities: '',
          primary_imaging: ''
        };
        
        // Process the returned fields
        for (let j = 0; j < data.length; j += 2) {
          const fieldName = data[j] as string;
          const fieldValue = data[j + 1] as string;
          
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
        
        return row;
      });
      
      // Add anatomy results to all results
      for (const row of anatomyRows) {
        // Check if this ICD-10 code is already in the results
        if (!allResults.some(r => r.icd10_code === row.icd10_code)) {
          allResults.push(row);
        }
      }
    }
    
    // Return all results
    return allResults;
  } catch (error) {
    console.error('Error searching ICD-10 codes with RedisSearch:', error);
    return [];
  }
}

/**
 * Get ICD-10 codes by IDs
 * @param icd10Codes Array of ICD-10 codes
 * @returns Array of ICD-10 codes
 */
async function getICD10CodesByIds(icd10Codes)10Row[]> {
  try {
    // Get Redis client
    const client = getRedisClient();
    
    // Create an array to store the results
    const results10Row[] = [];
    
    // Get each ICD-10 code
    for (const icd10Code of icd10Codes) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await (client as any).call('JSON.GET', `icd10:${icd10Code}`);
        
        // Parse the JSON data
        const parsedData = JSON.parse(data);
        
        // Create an ICD10Row object
        const row10Row = {
          icd10_code.icd10_code || icd10Code,
          description.description || '',
          clinical_notes.clinical_notes || '',
          imaging_modalities.imaging_modalities || '',
          primary_imaging.primary_imaging || ''
        };
        
        // Add the row to the results
        results.push(row);
      } catch (error) {
        console.error(`Error getting ICD-10 code ${icd10Code}:`, error);
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error getting ICD-10 codes by IDs:', error);
    return [];
  }
}