/**
 * Deep Testing for Redis JSON Search Implementation
 * 
 * This script performs comprehensive testing of the Redis JSON storage and search functionality,
 * including complex queries, special characters, and JSONPath syntax.
 */

const Redis = require('ioredis');
const { performance } = require('perf_hooks');

// Redis Cloud connection details from .env.production
const redisHost = 'redis-11584.crce197.us-east-2-1.ec2.redns.redis-cloud.com';
const redisPort = 11584;
const redisPassword = 'zHUbspGPcewJsoT9G9TSQncuSl0v0MUH';

console.log('Starting Deep Redis JSON Search Testing...');
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
 * Create Redis search indices
 */
async function createIndices() {
  console.log('\n=== CREATING REDIS SEARCH INDICES ===');
  
  try {
    // Get existing indices
    const indices = await client.call('FT._LIST');
    console.log('Existing indices:', indices);
    
    // Drop existing indices if they exist
    if (indices.includes('idx:test-cpt')) {
      console.log('Dropping existing test CPT index');
      await client.call('FT.DROPINDEX', 'idx:test-cpt');
    }
    
    if (indices.includes('idx:test-icd10')) {
      console.log('Dropping existing test ICD-10 index');
      await client.call('FT.DROPINDEX', 'idx:test-icd10');
    }
    
    // Create test CPT index
    console.log('Creating test CPT index');
    await client.call(
      'FT.CREATE', 'idx:test-cpt', 'ON', 'JSON', 'PREFIX', '1', 'test:cpt:',
      'SCHEMA',
      '$.cpt_code', 'AS', 'cpt_code', 'TAG', 'SORTABLE',
      '$.description', 'AS', 'description', 'TEXT', 'WEIGHT', '5.0',
      '$.body_part', 'AS', 'body_part', 'TEXT', 'WEIGHT', '3.0',
      '$.modality', 'AS', 'modality', 'TAG',
      '$.category', 'AS', 'category', 'TAG',
      '$.clinical_justification', 'AS', 'clinical_justification', 'TEXT', 'WEIGHT', '3.0',
      '$.key_findings', 'AS', 'key_findings', 'TEXT', 'WEIGHT', '2.0'
    );
    
    // Create test ICD-10 index
    console.log('Creating test ICD-10 index');
    await client.call(
      'FT.CREATE', 'idx:test-icd10', 'ON', 'JSON', 'PREFIX', '1', 'test:icd10:',
      'SCHEMA',
      '$.icd10_code', 'AS', 'icd10_code', 'TAG', 'SORTABLE',
      '$.description', 'AS', 'description', 'TEXT', 'WEIGHT', '5.0',
      '$.clinical_notes', 'AS', 'clinical_notes', 'TEXT', 'WEIGHT', '1.0',
      '$.category', 'AS', 'category', 'TAG',
      '$.specialty', 'AS', 'specialty', 'TAG',
      '$.keywords', 'AS', 'keywords', 'TEXT', 'WEIGHT', '3.0',
      '$.primary_imaging_rationale', 'AS', 'primary_imaging_rationale', 'TEXT', 'WEIGHT', '2.0',
      '$.numeric_field', 'AS', 'numeric_field', 'NUMERIC', 'SORTABLE'
    );
    
    console.log('Indices created successfully');
    
    // Verify indices
    const updatedIndices = await client.call('FT._LIST');
    console.log('Updated indices:', updatedIndices);
    
    // Check index info
    console.log('\nTest CPT Index Information:');
    const cptIndexInfo = await client.call('FT.INFO', 'idx:test-cpt');
    console.log('Index Type:', cptIndexInfo.indexOf('key_type') >= 0 ? 
      cptIndexInfo[cptIndexInfo.indexOf('key_type') + 1] : 'Unknown');
    
    console.log('\nTest ICD-10 Index Information:');
    const icd10IndexInfo = await client.call('FT.INFO', 'idx:test-icd10');
    console.log('Index Type:', icd10IndexInfo.indexOf('key_type') >= 0 ? 
      icd10IndexInfo[icd10IndexInfo.indexOf('key_type') + 1] : 'Unknown');
    
  } catch (error) {
    console.error('Error creating indices:', error);
  }
}

/**
 * Populate Redis with test data
 */
async function populateTestData() {
  console.log('\n=== POPULATING REDIS WITH TEST DATA ===');
  
  try {
    // Delete existing test keys
    const cptKeys = await client.keys('test:cpt:*');
    if (cptKeys.length > 0) {
      console.log(`Deleting ${cptKeys.length} test CPT keys`);
      const pipeline = client.pipeline();
      cptKeys.forEach(key => pipeline.del(key));
      await pipeline.exec();
    }
    
    const icd10Keys = await client.keys('test:icd10:*');
    if (icd10Keys.length > 0) {
      console.log(`Deleting ${icd10Keys.length} test ICD-10 keys`);
      const pipeline = client.pipeline();
      icd10Keys.forEach(key => pipeline.del(key));
      await pipeline.exec();
    }
    
    // Sample CPT codes
    const cptCodes = [
      {
        cpt_code: '73221',
        description: 'MRI of upper extremity joint without contrast',
        modality: 'MRI',
        body_part: 'upper extremity joint',
        clinical_justification: 'Evaluation of joint pain, swelling, or suspected internal derangement',
        key_findings: 'Joint effusion, synovitis, ligament or tendon tears, cartilage damage',
        category: 'Diagnostic'
      },
      {
        cpt_code: '70450',
        description: 'CT scan of head without contrast',
        modality: 'CT',
        body_part: 'head',
        clinical_justification: 'Evaluation of trauma, headache, or suspected intracranial pathology',
        key_findings: 'Hemorrhage, mass effect, hydrocephalus, fractures',
        category: 'Diagnostic'
      },
      {
        cpt_code: '71045',
        description: 'X-ray of chest, single view',
        modality: 'X-ray',
        body_part: 'chest',
        clinical_justification: 'Screening for pneumonia, tuberculosis, or other pulmonary conditions',
        key_findings: 'Infiltrates, effusions, pneumothorax, cardiomegaly',
        category: 'Diagnostic'
      }
    ];
    
    // Sample ICD-10 codes
    const icd10Codes = [
      {
        icd10_code: 'M54.5',
        description: 'Low back pain',
        clinical_notes: 'Common condition affecting the lumbar spine region',
        category: 'Musculoskeletal',
        specialty: 'Orthopedics',
        keywords: 'back pain, lumbar pain, lumbago',
        primary_imaging_rationale: 'MRI is indicated for persistent pain with radicular symptoms',
        numeric_field: 1
      },
      {
        icd10_code: 'I63.9',
        description: 'Cerebral infarction, unspecified',
        clinical_notes: 'Stroke due to occlusion of cerebral arteries',
        category: 'Circulatory',
        specialty: 'Neurology',
        keywords: 'stroke, CVA, cerebrovascular accident, brain attack',
        primary_imaging_rationale: 'CT or MRI of brain to identify location and extent of infarction',
        numeric_field: 2
      },
      {
        icd10_code: 'J18.9',
        description: 'Pneumonia, unspecified organism',
        clinical_notes: 'Infection of the lung parenchyma',
        category: 'Respiratory',
        specialty: 'Pulmonology',
        keywords: 'lung infection, pneumonitis, bronchopneumonia',
        primary_imaging_rationale: 'Chest X-ray to identify infiltrates and assess severity',
        numeric_field: 3
      }
    ];
    
    // Store CPT codes as JSON
    console.log('Storing test CPT codes as JSON');
    const cptPipeline = client.pipeline();
    for (const cpt of cptCodes) {
      cptPipeline.call('JSON.SET', `test:cpt:${cpt.cpt_code}`, '.', JSON.stringify(cpt));
    }
    await cptPipeline.exec();
    
    // Store ICD-10 codes as JSON
    console.log('Storing test ICD-10 codes as JSON');
    const icd10Pipeline = client.pipeline();
    for (const icd10 of icd10Codes) {
      icd10Pipeline.call('JSON.SET', `test:icd10:${icd10.icd10_code}`, '.', JSON.stringify(icd10));
    }
    await icd10Pipeline.exec();
    
    console.log('Test data populated successfully');
    
  } catch (error) {
    console.error('Error populating test data:', error);
  }
}

/**
 * Test different query formats
 */
async function testQueryFormats() {
  console.log('\n=== TESTING DIFFERENT QUERY FORMATS ===');
  
  try {
    // Test 1: Standard field name format
    console.log('\nTest 1: Standard field name format');
    const query1 = '@description:(mri)';
    const result1 = await client.call(
      'FT.SEARCH',
      'idx:test-cpt',
      query1,
      'WITHSCORES',
      'LIMIT', '0', '10',
      'RETURN', '3', '$.cpt_code', '$.description', '$.modality'
    );
    
    console.log(`Query: ${query1}`);
    console.log(`Results: ${result1[0]}`);
    console.log('First result:', result1.length > 1 ? result1[2] : 'No results');
    
    // Test 2: Field alias format with multiple fields
    console.log('\nTest 2: Field alias format with multiple fields');
    const query2 = '@description:(mri) @modality:{MRI}';
    try {
      const result2 = await client.call(
        'FT.SEARCH',
        'idx:test-cpt',
        query2,
        'WITHSCORES',
        'LIMIT', '0', '10',
        'RETURN', '3', '$.cpt_code', '$.description', '$.modality'
      );
      
      console.log(`Query: ${query2}`);
      console.log(`Results: ${result2[0]}`);
      console.log('First result:', result2.length > 1 ? result2[2] : 'No results');
    } catch (error) {
      console.log(`Query: ${query2}`);
      console.log('Error:', error.message);
    }
    
    // Test 3: Field alias format with OR condition
    console.log('\nTest 3: Field alias format with OR condition');
    const query3 = '@description:(mri) | @body_part:(extremity)';
    try {
      const result3 = await client.call(
        'FT.SEARCH',
        'idx:test-cpt',
        query3,
        'WITHSCORES',
        'LIMIT', '0', '10',
        'RETURN', '3', '$.cpt_code', '$.description', '$.modality'
      );
      
      console.log(`Query: ${query3}`);
      console.log(`Results: ${result3[0]}`);
      console.log('First result:', result3.length > 1 ? result3[2] : 'No results');
    } catch (error) {
      console.log(`Query: ${query3}`);
      console.log('Error:', error.message);
    }
    
    // Test 4: Field alias format with negation
    console.log('\nTest 4: Field alias format with negation');
    const query4 = '@modality:{MRI} -@description:(brain)';
    const result4 = await client.call(
      'FT.SEARCH',
      'idx:test-cpt',
      query4,
      'WITHSCORES',
      'LIMIT', '0', '10',
      'RETURN', '3', '$.cpt_code', '$.description', '$.modality'
    );
    
    console.log(`Query: ${query4}`);
    console.log(`Results: ${result4[0]}`);
    console.log('First result:', result4.length > 1 ? result4[2] : 'No results');
    
    // Test 5: Field alias format with weighted fields
    console.log('\nTest 5: Field alias format with weighted fields');
    const query5 = '(@description:(mri) WEIGHT 5.0) | (@body_part:(extremity) WEIGHT 3.0)';
    try {
      const result5 = await client.call(
        'FT.SEARCH',
        'idx:test-cpt',
        query5,
        'WITHSCORES',
        'LIMIT', '0', '10',
        'RETURN', '3', '$.cpt_code', '$.description', '$.modality'
      );
      
      console.log(`Query: ${query5}`);
      console.log(`Results: ${result5[0]}`);
      console.log('First result:', result5.length > 1 ? result5[2] : 'No results');
    } catch (error) {
      console.log(`Query: ${query5}`);
      console.log('Error:', error.message);
    }
    
  } catch (error) {
    console.error('Error testing query formats:', error);
  }
}

/**
 * Main function
 */
async function main() {
  try {
    await createIndices();
    await populateTestData();
    await testQueryFormats();
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    // Close the Redis connection
    client.quit();
    console.log('\nDeep testing completed');
  }
}

// Run the main function
main();