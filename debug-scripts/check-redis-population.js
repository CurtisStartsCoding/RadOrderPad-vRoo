const { queryMainDb } = require('../src/config/db');
const { getRedisClient } = require('../src/config/redis');
const enhancedLogger = require('../src/utils/enhanced-logger').default;

async function checkRedisPopulation() {
  try {
    console.log('Checking database record counts...\n');
    
    // Check database counts
    const cptCount = await queryMainDb('SELECT COUNT(*) FROM medical_cpt_codes');
    const icd10Count = await queryMainDb('SELECT COUNT(*) FROM medical_icd10_codes');
    const mappingCount = await queryMainDb('SELECT COUNT(*) FROM medical_cpt_icd10_mappings');
    
    console.log('Database record counts:');
    console.log(`- CPT codes: ${cptCount.rows[0].count}`);
    console.log(`- ICD-10 codes: ${icd10Count.rows[0].count}`);
    console.log(`- Mappings: ${mappingCount.rows[0].count}`);
    
    // Check if markdown docs table exists
    try {
      const markdownCount = await queryMainDb('SELECT COUNT(*) FROM medical_icd10_markdown_docs');
      console.log(`- Markdown docs: ${markdownCount.rows[0].count}`);
    } catch (error) {
      console.log('- Markdown docs: Table not found or empty');
    }
    
    console.log('\nChecking Redis key counts...\n');
    
    // Check Redis counts
    const client = getRedisClient();
    
    const cptKeys = await client.keys('cpt:code:*');
    const icd10Keys = await client.keys('icd10:code:*');
    const mappingKeys = await client.keys('mapping:icd10-to-cpt:*');
    const markdownKeys = await client.keys('markdown:*');
    
    console.log('Redis key counts:');
    console.log(`- CPT keys: ${cptKeys.length}`);
    console.log(`- ICD-10 keys: ${icd10Keys.length}`);
    console.log(`- Mapping keys: ${mappingKeys.length}`);
    console.log(`- Markdown keys: ${markdownKeys.length}`);
    
    // Check for discrepancies
    console.log('\nDiscrepancy analysis:');
    
    const cptDbCount = parseInt(cptCount.rows[0].count);
    const icd10DbCount = parseInt(icd10Count.rows[0].count);
    const mappingDbCount = parseInt(mappingCount.rows[0].count);
    
    if (cptKeys.length < cptDbCount) {
      console.log(`⚠️  CPT: Only ${cptKeys.length} of ${cptDbCount} records loaded (${((cptKeys.length/cptDbCount)*100).toFixed(1)}%)`);
    } else {
      console.log(`✓ CPT: All ${cptDbCount} records loaded`);
    }
    
    if (icd10Keys.length < icd10DbCount) {
      console.log(`⚠️  ICD-10: Only ${icd10Keys.length} of ${icd10DbCount} records loaded (${((icd10Keys.length/icd10DbCount)*100).toFixed(1)}%)`);
    } else {
      console.log(`✓ ICD-10: All ${icd10DbCount} records loaded`);
    }
    
    if (mappingKeys.length < mappingDbCount) {
      console.log(`⚠️  Mappings: Only ${mappingKeys.length} of ${mappingDbCount} records loaded (${((mappingKeys.length/mappingDbCount)*100).toFixed(1)}%)`);
    } else {
      console.log(`✓ Mappings: All ${mappingDbCount} records loaded`);
    }
    
    // Sample some data to check format
    console.log('\nSampling data format...\n');
    
    if (cptKeys.length > 0) {
      const sampleCptKey = cptKeys[0];
      const sampleCptData = await client.call('JSON.GET', sampleCptKey, '.');
      console.log(`Sample CPT data (${sampleCptKey}):`);
      console.log(JSON.stringify(JSON.parse(sampleCptData), null, 2).substring(0, 200) + '...');
    }
    
    if (icd10Keys.length > 0) {
      const sampleIcd10Key = icd10Keys[0];
      const sampleIcd10Data = await client.call('JSON.GET', sampleIcd10Key, '.');
      console.log(`\nSample ICD-10 data (${sampleIcd10Key}):`);
      console.log(JSON.stringify(JSON.parse(sampleIcd10Data), null, 2).substring(0, 200) + '...');
    }
    
    // Check for any limit patterns
    console.log('\nChecking for limit patterns...');
    
    // Check if exactly 500 of any type
    if (cptKeys.length === 500) {
      console.log('⚠️  CPT keys are exactly 500 - possible limit applied');
    }
    if (icd10Keys.length === 500) {
      console.log('⚠️  ICD-10 keys are exactly 500 - possible limit applied');
    }
    if (mappingKeys.length === 500) {
      console.log('⚠️  Mapping keys are exactly 500 - possible limit applied');
    }
    
    // Check total
    const totalRedisKeys = cptKeys.length + icd10Keys.length + mappingKeys.length + markdownKeys.length;
    if (totalRedisKeys === 500) {
      console.log(`⚠️  Total Redis keys are exactly 500 - possible global limit applied`);
    }
    
    console.log(`\nTotal Redis keys: ${totalRedisKeys}`);
    
  } catch (error) {
    console.error('Error checking Redis population:', error);
  } finally {
    process.exit(0);
  }
}

// Run the check
checkRedisPopulation();