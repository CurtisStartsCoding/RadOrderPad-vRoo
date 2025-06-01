const { queryMainDb } = require('../src/config/db');
const { getRedisClient } = require('../src/config/redis');

async function diagnose500Limit() {
  try {
    console.log('=== Diagnosing 500 Record Limit Issue ===\n');
    
    // Step 1: Check actual database counts
    console.log('Step 1: Checking database record counts...');
    const cptCount = await queryMainDb('SELECT COUNT(*) as count FROM medical_cpt_codes');
    const icd10Count = await queryMainDb('SELECT COUNT(*) as count FROM medical_icd10_codes');
    const mappingCount = await queryMainDb('SELECT COUNT(*) as count FROM medical_cpt_icd10_mappings');
    
    console.log(`Database counts:`);
    console.log(`  CPT codes: ${cptCount.rows[0].count}`);
    console.log(`  ICD-10 codes: ${icd10Count.rows[0].count}`);
    console.log(`  Mappings: ${mappingCount.rows[0].count}`);
    console.log(`  Total: ${parseInt(cptCount.rows[0].count) + parseInt(icd10Count.rows[0].count) + parseInt(mappingCount.rows[0].count)}`);
    
    // Step 2: Test direct query limits
    console.log('\nStep 2: Testing direct query results...');
    const cptDirect = await queryMainDb('SELECT * FROM medical_cpt_codes');
    const icd10Direct = await queryMainDb('SELECT * FROM medical_icd10_codes');
    const mappingDirect = await queryMainDb('SELECT * FROM medical_cpt_icd10_mappings');
    
    console.log(`Direct query row counts:`);
    console.log(`  CPT codes returned: ${cptDirect.rows.length}`);
    console.log(`  ICD-10 codes returned: ${icd10Direct.rows.length}`);
    console.log(`  Mappings returned: ${mappingDirect.rows.length}`);
    console.log(`  Total returned: ${cptDirect.rows.length + icd10Direct.rows.length + mappingDirect.rows.length}`);
    
    // Check if any are exactly 500
    if (cptDirect.rows.length === 500) {
      console.log('  ⚠️  CPT query returned exactly 500 rows!');
    }
    if (icd10Direct.rows.length === 500) {
      console.log('  ⚠️  ICD-10 query returned exactly 500 rows!');
    }
    if (mappingDirect.rows.length === 500) {
      console.log('  ⚠️  Mapping query returned exactly 500 rows!');
    }
    
    // Step 3: Check Redis keys with different methods
    console.log('\nStep 3: Checking Redis keys...');
    const client = getRedisClient();
    
    // Method 1: Using KEYS command
    const cptKeys = await client.keys('cpt:code:*');
    const icd10Keys = await client.keys('icd10:code:*');
    const mappingKeys = await client.keys('mapping:icd10-to-cpt:*');
    
    console.log(`Redis KEYS command counts:`);
    console.log(`  CPT keys: ${cptKeys.length}`);
    console.log(`  ICD-10 keys: ${icd10Keys.length}`);
    console.log(`  Mapping keys: ${mappingKeys.length}`);
    console.log(`  Total: ${cptKeys.length + icd10Keys.length + mappingKeys.length}`);
    
    // Method 2: Using SCAN to verify
    console.log('\nVerifying with SCAN command...');
    let scanCounts = { cpt: 0, icd10: 0, mapping: 0 };
    let cursor = '0';
    
    do {
      const result = await client.scan(cursor, 'COUNT', 1000);
      cursor = result[0];
      const keys = result[1];
      
      for (const key of keys) {
        if (key.startsWith('cpt:code:')) scanCounts.cpt++;
        else if (key.startsWith('icd10:code:')) scanCounts.icd10++;
        else if (key.startsWith('mapping:icd10-to-cpt:')) scanCounts.mapping++;
      }
    } while (cursor !== '0');
    
    console.log(`Redis SCAN command counts:`);
    console.log(`  CPT keys: ${scanCounts.cpt}`);
    console.log(`  ICD-10 keys: ${scanCounts.icd10}`);
    console.log(`  Mapping keys: ${scanCounts.mapping}`);
    console.log(`  Total: ${scanCounts.cpt + scanCounts.icd10 + scanCounts.mapping}`);
    
    // Step 4: Check for patterns
    console.log('\nStep 4: Analyzing patterns...');
    
    // Check if database queries are being limited
    if (cptDirect.rows.length < parseInt(cptCount.rows[0].count)) {
      console.log(`⚠️  Database query limitation detected for CPT codes!`);
      console.log(`    Expected: ${cptCount.rows[0].count}, Got: ${cptDirect.rows.length}`);
    }
    
    if (icd10Direct.rows.length < parseInt(icd10Count.rows[0].count)) {
      console.log(`⚠️  Database query limitation detected for ICD-10 codes!`);
      console.log(`    Expected: ${icd10Count.rows[0].count}, Got: ${icd10Direct.rows.length}`);
    }
    
    if (mappingDirect.rows.length < parseInt(mappingCount.rows[0].count)) {
      console.log(`⚠️  Database query limitation detected for mappings!`);
      console.log(`    Expected: ${mappingCount.rows[0].count}, Got: ${mappingDirect.rows.length}`);
    }
    
    // Check if Redis population is incomplete
    if (cptKeys.length < cptDirect.rows.length) {
      console.log(`⚠️  Redis population incomplete for CPT codes!`);
      console.log(`    Database returned: ${cptDirect.rows.length}, Redis has: ${cptKeys.length}`);
    }
    
    if (icd10Keys.length < icd10Direct.rows.length) {
      console.log(`⚠️  Redis population incomplete for ICD-10 codes!`);
      console.log(`    Database returned: ${icd10Direct.rows.length}, Redis has: ${icd10Keys.length}`);
    }
    
    if (mappingKeys.length < mappingDirect.rows.length) {
      console.log(`⚠️  Redis population incomplete for mappings!`);
      console.log(`    Database returned: ${mappingDirect.rows.length}, Redis has: ${mappingKeys.length}`);
    }
    
    // Step 5: Test a specific limited query
    console.log('\nStep 5: Testing queries with explicit limits...');
    const limitedQuery = await queryMainDb('SELECT * FROM medical_cpt_codes LIMIT 10');
    console.log(`Query with LIMIT 10 returned: ${limitedQuery.rows.length} rows`);
    
    // Step 6: Check PostgreSQL connection pool settings
    console.log('\nStep 6: Checking connection pool info...');
    const poolInfo = await queryMainDb(`
      SELECT 
        current_setting('max_connections') as max_connections,
        current_setting('work_mem') as work_mem,
        current_setting('shared_buffers') as shared_buffers
    `);
    console.log('PostgreSQL settings:', poolInfo.rows[0]);
    
  } catch (error) {
    console.error('\nError during diagnosis:', error);
  } finally {
    process.exit(0);
  }
}

diagnose500Limit();