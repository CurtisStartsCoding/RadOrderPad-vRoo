/**
 * Verify Redis JSON Search Implementation
 * 
 * This script verifies that the Redis JSON search implementation is working correctly.
 * It deletes existing data, recreates indices, stores sample data, and runs search queries.
 */

// Import required modules
const Redis = require('ioredis');

// Redis Cloud connection details from .env.production
const redisHost = 'redis-11584.crce197.us-east-2-1.ec2.redns.redis-cloud.com';
const redisPort = 11584;
const redisPassword = 'zHUbspGPcewJsoT9G9TSQncuSl0v0MUH';

console.log('Starting Redis JSON Search Verification...');
console.log(`Connection details: { host: '${redisHost}', port: ${redisPort}, tls: enabled }`);

// Create a Redis client with production settings
const client = new Redis({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  tls: {}, // Enable TLS for Redis Cloud
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    console.log(`Redis client reconnecting ${times * 50}`);
    return delay;
  }
});

// Set up event handlers
client.on('connect', () => {
  console.log('Redis client connected successfully');
});

client.on('error', (err) => {
  console.error('Redis Client Error', err);
});

/**
 * Delete existing data
 */
async function deleteExistingData() {
  console.log('\n=== DELETING EXISTING DATA ===');
  
  try {
    // Delete CPT codes
    const cptKeys = await client.keys('cpt:code:*');
    if (cptKeys.length > 0) {
      console.log(`Deleting ${cptKeys.length} CPT codes`);
      const pipeline = client.pipeline();
      cptKeys.forEach(key => pipeline.del(key));
      await pipeline.exec();
    } else {
      console.log('No CPT codes to delete');
    }
    
    // Delete ICD-10 codes
    const icd10Keys = await client.keys('icd10:code:*');
    if (icd10Keys.length > 0) {
      console.log(`Deleting ${icd10Keys.length} ICD-10 codes`);
      const pipeline = client.pipeline();
      icd10Keys.forEach(key => pipeline.del(key));
      await pipeline.exec();
    } else {
      console.log('No ICD-10 codes to delete');
    }
    
    // Delete Markdown documents
    const markdownKeys = await client.keys('markdown:*');
    if (markdownKeys.length > 0) {
      console.log(`Deleting ${markdownKeys.length} Markdown documents`);
      const pipeline = client.pipeline();
      markdownKeys.forEach(key => pipeline.del(key));
      await pipeline.exec();
    } else {
      console.log('No Markdown documents to delete');
    }
    
    console.log('Existing data deleted successfully');
  } catch (error) {
    console.error('Error deleting existing data:', error);
  }
}

/**
 * Create Redis search indices
 */
async function createIndices() {
  console.log('\n=== CREATING REDIS SEARCH INDICES ===');
  
  try {
    // Get existing indices
    const indices = await client.call('FT._LIST');
    console.log('Existing indices:', indices);
    
    // Drop existing indices if they exist
    if (indices.includes('idx:cpt')) {
      console.log('Dropping existing CPT index');
      await client.call('FT.DROPINDEX', 'idx:cpt');
    }
    
    if (indices.includes('idx:icd10')) {
      console.log('Dropping existing ICD-10 index');
      await client.call('FT.DROPINDEX', 'idx:icd10');
    }
    
    if (indices.includes('idx:markdown')) {
      console.log('Dropping existing Markdown index');
      await client.call('FT.DROPINDEX', 'idx:markdown');
    }
    
    // Create CPT index
    console.log('Creating CPT index');
    await client.call(
      'FT.CREATE', 'idx:cpt', 'ON', 'JSON', 'PREFIX', '1', 'cpt:code:',
      'SCHEMA',
      '$.cpt_code', 'AS', 'cpt_code', 'TAG', 'SORTABLE',
      '$.description', 'AS', 'description', 'TEXT', 'WEIGHT', '5.0',
      '$.body_part', 'AS', 'body_part', 'TEXT', 'WEIGHT', '3.0',
      '$.modality', 'AS', 'modality', 'TAG',
      '$.category', 'AS', 'category', 'TAG',
      '$.clinical_justification', 'AS', 'clinical_justification', 'TEXT', 'WEIGHT', '3.0',
      '$.key_findings', 'AS', 'key_findings', 'TEXT', 'WEIGHT', '2.0'
    );
    
    // Create ICD-10 index
    console.log('Creating ICD-10 index');
    await client.call(
      'FT.CREATE', 'idx:icd10', 'ON', 'JSON', 'PREFIX', '1', 'icd10:code:',
      'SCHEMA',
      '$.icd10_code', 'AS', 'icd10_code', 'TAG', 'SORTABLE',
      '$.description', 'AS', 'description', 'TEXT', 'WEIGHT', '5.0',
      '$.clinical_notes', 'AS', 'clinical_notes', 'TEXT', 'WEIGHT', '1.0',
      '$.category', 'AS', 'category', 'TAG',
      '$.specialty', 'AS', 'specialty', 'TAG',
      '$.keywords', 'AS', 'keywords', 'TEXT', 'WEIGHT', '3.0',
      '$.primary_imaging_rationale', 'AS', 'primary_imaging_rationale', 'TEXT', 'WEIGHT', '2.0'
    );
    
    // Create Markdown index
    console.log('Creating Markdown index');
    await client.call(
      'FT.CREATE', 'idx:markdown', 'ON', 'JSON', 'PREFIX', '1', 'markdown:',
      'SCHEMA',
      '$.icd10_code', 'AS', 'icd10_code', 'TAG', 'SORTABLE',
      '$.icd10_description', 'AS', 'icd10_description', 'TEXT', 'WEIGHT', '2.0',
      '$.content', 'AS', 'content', 'TEXT', 'WEIGHT', '5.0',
      '$.content_preview', 'AS', 'content_preview', 'TEXT', 'WEIGHT', '1.0'
    );
    
    console.log('Indices created successfully');
    
    // Verify indices
    const updatedIndices = await client.call('FT._LIST');
    console.log('Updated indices:', updatedIndices);
    
    // Check index info
    console.log('\nCPT Index Information:');
    const cptIndexInfo = await client.call('FT.INFO', 'idx:cpt');
    console.log('Index Type:', cptIndexInfo.indexOf('key_type') >= 0 ? 
      cptIndexInfo[cptIndexInfo.indexOf('key_type') + 1] : 'Unknown');
    
    console.log('\nICD-10 Index Information:');
    const icd10IndexInfo = await client.call('FT.INFO', 'idx:icd10');
    console.log('Index Type:', icd10IndexInfo.indexOf('key_type') >= 0 ? 
      icd10IndexInfo[icd10IndexInfo.indexOf('key_type') + 1] : 'Unknown');
    
    console.log('\nMarkdown Index Information:');
    const markdownIndexInfo = await client.call('FT.INFO', 'idx:markdown');
    console.log('Index Type:', markdownIndexInfo.indexOf('key_type') >= 0 ? 
      markdownIndexInfo[markdownIndexInfo.indexOf('key_type') + 1] : 'Unknown');
    
  } catch (error) {
    console.error('Error creating indices:', error);
  }
}

/**
 * Populate Redis with sample data
 */
async function populateSampleData() {
  console.log('\n=== POPULATING REDIS WITH SAMPLE DATA ===');
  
  try {
    // Sample CPT code
    const cptCode = {
      cpt_code: '73221',
      description: 'MRI of upper extremity joint without contrast',
      modality: 'MRI',
      body_part: 'upper extremity joint',
      clinical_justification: 'Evaluation of joint pain, swelling, or suspected internal derangement',
      key_findings: 'Joint effusion, synovitis, ligament or tendon tears, cartilage damage'
    };
    
    // Sample ICD-10 code
    const icd10Code = {
      icd10_code: 'M54.5',
      description: 'Low back pain',
      clinical_notes: 'Common condition affecting the lumbar spine region',
      category: 'Musculoskeletal',
      specialty: 'Orthopedics',
      keywords: 'back pain, lumbar pain, lumbago',
      primary_imaging_rationale: 'MRI is indicated for persistent pain with radicular symptoms'
    };
    
    // Sample Markdown document
    const markdownDoc = {
      id: 1409,
      icd10_code: 'M54.5',
      icd10_description: 'Low back pain',
      content: '# Medical Imaging Recommendation for ICD-10 Code M54.5\n\n## Low Back Pain\n\nMRI lumbar spine without contrast is the preferred imaging modality for persistent low back pain with radicular symptoms.',
      content_preview: '# Medical Imaging Recommendation for ICD-10 Code M54.5...'
    };
    
    // Store CPT code as JSON
    console.log('Storing CPT code as JSON');
    await client.call('JSON.SET', `cpt:code:${cptCode.cpt_code}`, '.', JSON.stringify(cptCode));
    
    // Store ICD-10 code as JSON
    console.log('Storing ICD-10 code as JSON');
    await client.call('JSON.SET', `icd10:code:${icd10Code.icd10_code}`, '.', JSON.stringify(icd10Code));
    
    // Store Markdown document as JSON
    console.log('Storing Markdown document as JSON');
    await client.call('JSON.SET', `markdown:${markdownDoc.icd10_code}`, '.', JSON.stringify(markdownDoc));
    
    console.log('Sample data populated successfully');
    
  } catch (error) {
    console.error('Error populating sample data:', error);
  }
}

/**
 * Test search functionality
 */
async function testSearch() {
  console.log('\n=== TESTING SEARCH FUNCTIONALITY ===');
  
  try {
    // Test CPT search
    console.log('\nTesting CPT search:');
    const cptQuery = '@description:(mri) @body_part:(extremity)';
    const cptResult = await client.call(
      'FT.SEARCH',
      'idx:cpt',
      cptQuery,
      'WITHSCORES',
      'LIMIT', '0', '10',
      'RETURN', '6', '$.cpt_code', '$.description', '$.modality', '$.body_part', '$.clinical_justification', '$.key_findings'
    );
    
    console.log('CPT search results:', cptResult);
    
    // Test ICD-10 search
    console.log('\nTesting ICD-10 search:');
    const icd10Query = '@description:(back pain) | @keywords:(lumbago)';
    const icd10Result = await client.call(
      'FT.SEARCH',
      'idx:icd10',
      icd10Query,
      'WITHSCORES',
      'LIMIT', '0', '10',
      'RETURN', '7', '$.icd10_code', '$.description', '$.clinical_notes', '$.category', '$.specialty', '$.keywords', '$.primary_imaging_rationale'
    );
    
    console.log('ICD-10 search results:', icd10Result);
    
    // Test Markdown search
    console.log('\nTesting Markdown search:');
    const markdownQuery = '@content:(imaging recommendation)';
    const markdownResult = await client.call(
      'FT.SEARCH',
      'idx:markdown',
      markdownQuery,
      'WITHSCORES',
      'LIMIT', '0', '10',
      'RETURN', '4', '$.icd10_code', '$.icd10_description', '$.content', '$.content_preview'
    );
    
    console.log('Markdown search results:', markdownResult);
    
  } catch (error) {
    console.error('Error testing search:', error);
  }
}

/**
 * Main function
 */
async function main() {
  try {
    await deleteExistingData();
    await createIndices();
    await populateSampleData();
    await testSearch();
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    // Close the Redis connection
    client.quit();
    console.log('\nVerification completed');
  }
}

// Run the main function
main();