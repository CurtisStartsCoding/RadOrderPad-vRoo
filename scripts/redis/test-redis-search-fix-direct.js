/**
 * Script to directly test the fixed Redis search logic
 */
import { getRedisClient, closeRedisConnection } from '../dist/config/redis.js';

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

// Fixed CPT search implementation
async function searchCPTCodes(keywords) {
  try {
    // Get Redis client
    const client = getRedisClient();
    
    // Process search terms
    const searchTerms = processSearchTerms(keywords);
    
    // Categorize keywords
    const categorizedKeywords = {
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
    
    // Add code filter if we have specific codes
    if (categorizedKeywords.codes.length > 0) {
      const codes = categorizedKeywords.codes.filter(c => c.match(/^\d{5}$/));
      if (codes.length > 0) {
        // If we have specific CPT codes, search for those directly
        return await getCPTCodesByIds(codes);
      }
    }
    
    // Create an array to store all results
    const allResults = [];
    
    // Search by description
    const descriptionQuery = `@description:(${searchTerms})`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const descriptionResults = await client.call(
      'FT.SEARCH',
      'cpt_index',
      descriptionQuery,
      'LIMIT', '0', '10',
      'RETURN', '4', '$.cpt_code', '$.description', '$.modality', '$.body_part'
    );
    
    // Process description results
    const descriptionRows = processRedisSearchResults(descriptionResults, (key, data) => {
      // Extract the CPT code from the key (format: cpt:CODE)
      const cptCode = extractKeyFromRedisKey(key);
      
      // Create a CPTRow object
      const row = {
        cpt_code: cptCode,
        description: '',
        modality: '',
        body_part: ''
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
      
      return row;
    });
    
    // Add description results to all results
    allResults.push(...descriptionRows);
    
    // Search by modality if we have modalities
    if (categorizedKeywords.modalities.length > 0) {
      const modalities = categorizedKeywords.modalities.join('|');
      const modalityQuery = `@modality:{${modalities}}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const modalityResults = await client.call(
        'FT.SEARCH',
        'cpt_index',
        modalityQuery,
        'LIMIT', '0', '10',
        'RETURN', '4', '$.cpt_code', '$.description', '$.modality', '$.body_part'
      );
      
      // Process modality results
      const modalityRows = processRedisSearchResults(modalityResults, (key, data) => {
        // Extract the CPT code from the key (format: cpt:CODE)
        const cptCode = extractKeyFromRedisKey(key);
        
        // Create a CPTRow object
        const row = {
          cpt_code: cptCode,
          description: '',
          modality: '',
          body_part: ''
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
      const bodyPartQuery = `@body_part:{${bodyParts}}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bodyPartResults = await client.call(
        'FT.SEARCH',
        'cpt_index',
        bodyPartQuery,
        'LIMIT', '0', '10',
        'RETURN', '4', '$.cpt_code', '$.description', '$.modality', '$.body_part'
      );
      
      // Process body part results
      const bodyPartRows = processRedisSearchResults(bodyPartResults, (key, data) => {
        // Extract the CPT code from the key (format: cpt:CODE)
        const cptCode = extractKeyFromRedisKey(key);
        
        // Create a CPTRow object
        const row = {
          cpt_code: cptCode,
          description: '',
          modality: '',
          body_part: ''
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

// Get CPT codes by IDs
async function getCPTCodesByIds(cptCodes) {
  try {
    // Get Redis client
    const client = getRedisClient();
    
    // Create an array to store the results
    const results = [];
    
    // Get each CPT code
    for (const cptCode of cptCodes) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await client.call('JSON.GET', `cpt:${cptCode}`);
        
        // Parse the JSON data
        const parsedData = JSON.parse(data);
        
        // Create a CPTRow object
        const row = {
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

// Fixed ICD-10 search implementation
async function searchICD10Codes(keywords) {
  try {
    // Get Redis client
    const client = getRedisClient();
    
    // Process search terms
    const searchTerms = processSearchTerms(keywords);
    
    // Categorize keywords
    const categorizedKeywords = {
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
      codes: keywords.filter(kw => kw.match(/^[A-Z]\d{2}(\.\d{1,2})?$/))
    };
    
    // Add code filter if we have specific codes
    if (categorizedKeywords.codes.length > 0) {
      const codes = categorizedKeywords.codes.filter(c => c.match(/^[A-Z]\d{2}(\.\d{1,2})?$/));
      if (codes.length > 0) {
        // If we have specific ICD-10 codes, search for those directly
        return await getICD10CodesByIds(codes);
      }
    }
    
    // Create an array to store all results
    const allResults = [];
    
    // Search by description and keywords
    let descriptionQuery = `@description:(${searchTerms})`;
    
    // If we have symptoms, use them for a more targeted search
    if (categorizedKeywords.symptoms.length > 0) {
      const symptoms = processSearchTerms(categorizedKeywords.symptoms);
      descriptionQuery = `@description:(${symptoms})`;
    }
    
    // Execute the search
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const descriptionResults = await client.call(
      'FT.SEARCH',
      'icd10_index',
      descriptionQuery,
      'LIMIT', '0', '10',
      'RETURN', '5', '$.icd10_code', '$.description', '$.clinical_notes', '$.imaging_modalities', '$.primary_imaging'
    );
    
    // Process description results
    const descriptionRows = processRedisSearchResults(descriptionResults, (key, data) => {
      // Extract the ICD-10 code from the key (format: icd10:CODE)
      const icd10Code = extractKeyFromRedisKey(key);
      
      // Create an ICD10Row object
      const row = {
        icd10_code: icd10Code,
        description: '',
        clinical_notes: '',
        imaging_modalities: '',
        primary_imaging: ''
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
      const anatomyResults = await client.call(
        'FT.SEARCH',
        'icd10_index',
        anatomyQuery,
        'LIMIT', '0', '10',
        'RETURN', '5', '$.icd10_code', '$.description', '$.clinical_notes', '$.imaging_modalities', '$.primary_imaging'
      );
      
      // Process anatomy results
      const anatomyRows = processRedisSearchResults(anatomyResults, (key, data) => {
        // Extract the ICD-10 code from the key (format: icd10:CODE)
        const icd10Code = extractKeyFromRedisKey(key);
        
        // Create an ICD10Row object
        const row = {
          icd10_code: icd10Code,
          description: '',
          clinical_notes: '',
          imaging_modalities: '',
          primary_imaging: ''
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

// Get ICD-10 codes by IDs
async function getICD10CodesByIds(icd10Codes) {
  try {
    // Get Redis client
    const client = getRedisClient();
    
    // Create an array to store the results
    const results = [];
    
    // Get each ICD-10 code
    for (const icd10Code of icd10Codes) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await client.call('JSON.GET', `icd10:${icd10Code}`);
        
        // Parse the JSON data
        const parsedData = JSON.parse(data);
        
        // Create an ICD10Row object
        const row = {
          icd10_code: parsedData.icd10_code || icd10Code,
          description: parsedData.description || '',
          clinical_notes: parsedData.clinical_notes || '',
          imaging_modalities: parsedData.imaging_modalities || '',
          primary_imaging: parsedData.primary_imaging || ''
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

// Test the fixed search implementations
async function testFixedSearchImplementations() {
  try {
    console.log('Testing fixed Redis search implementations...');
    
    // Test keywords
    const keywords = ['shoulder', 'pain', 'MRI', 'rotator cuff', 'tear', 'osteoarthritis'];
    console.log('Test keywords:', keywords);
    
    // Test CPT search
    console.log('\nTesting fixed CPT search implementation...');
    const cptResults = await searchCPTCodes(keywords);
    console.log(`Found ${cptResults.length} CPT codes`);
    
    if (cptResults.length > 0) {
      console.log('Sample CPT codes:');
      cptResults.slice(0, 10).forEach(row => {
        console.log(`${row.cpt_code}: ${row.description} (${row.modality}, ${row.body_part})`);
      });
    }
    
    // Test ICD-10 search
    console.log('\nTesting fixed ICD-10 search implementation...');
    const icd10Results = await searchICD10Codes(keywords);
    console.log(`Found ${icd10Results.length} ICD-10 codes`);
    
    if (icd10Results.length > 0) {
      console.log('Sample ICD-10 codes:');
      icd10Results.slice(0, 10).forEach(row => {
        console.log(`${row.icd10_code}: ${row.description}`);
      });
    }
    
    console.log('\nTest complete!');
  } catch (error) {
    console.error('Error testing fixed search implementations:', error);
  } finally {
    await closeRedisConnection();
  }
}

// Run the test
testFixedSearchImplementations();