const { queryMainDb } = require('../src/config/db');

async function testDatabaseQueryLimits() {
  try {
    console.log('=== Testing Database Query Limits ===\n');
    
    // Test 1: Get counts from database
    console.log('Test 1: Getting counts from database...');
    const cptCount = await queryMainDb('SELECT COUNT(*) as count FROM medical_cpt_codes');
    const icd10Count = await queryMainDb('SELECT COUNT(*) as count FROM medical_icd10_codes');
    const mappingCount = await queryMainDb('SELECT COUNT(*) as count FROM medical_cpt_icd10_mappings');
    
    console.log(`Database counts:`);
    console.log(`  CPT codes: ${cptCount.rows[0].count}`);
    console.log(`  ICD-10 codes: ${icd10Count.rows[0].count}`);
    console.log(`  Mappings: ${mappingCount.rows[0].count}`);
    
    // Test 2: Get actual rows with SELECT *
    console.log('\nTest 2: Getting all rows with SELECT *...');
    console.log('  Querying CPT codes...');
    const cptRows = await queryMainDb('SELECT * FROM medical_cpt_codes');
    console.log(`  CPT rows returned: ${cptRows.rows.length}`);
    
    console.log('  Querying ICD-10 codes...');
    const icd10Rows = await queryMainDb('SELECT * FROM medical_icd10_codes');
    console.log(`  ICD-10 rows returned: ${icd10Rows.rows.length}`);
    
    console.log('  Querying mappings...');
    const mappingRows = await queryMainDb('SELECT * FROM medical_cpt_icd10_mappings');
    console.log(`  Mapping rows returned: ${mappingRows.rows.length}`);
    
    // Test 3: Test with explicit LIMIT
    console.log('\nTest 3: Testing with explicit LIMIT clauses...');
    
    // Test with LIMIT 500
    console.log('  Testing with LIMIT 500...');
    const cptLimit500 = await queryMainDb('SELECT * FROM medical_cpt_codes LIMIT 500');
    console.log(`  CPT with LIMIT 500: ${cptLimit500.rows.length} rows`);
    
    // Test with LIMIT 1000
    console.log('  Testing with LIMIT 1000...');
    const cptLimit1000 = await queryMainDb('SELECT * FROM medical_cpt_codes LIMIT 1000');
    console.log(`  CPT with LIMIT 1000: ${cptLimit1000.rows.length} rows`);
    
    // Test 4: Test with pagination
    console.log('\nTest 4: Testing with pagination...');
    
    // First 500 rows
    const firstBatch = await queryMainDb('SELECT * FROM medical_cpt_codes LIMIT 500 OFFSET 0');
    console.log(`  First batch (0-499): ${firstBatch.rows.length} rows`);
    
    // Next 500 rows
    const secondBatch = await queryMainDb('SELECT * FROM medical_cpt_codes LIMIT 500 OFFSET 500');
    console.log(`  Second batch (500-999): ${secondBatch.rows.length} rows`);
    
    // Test 5: Check database settings
    console.log('\nTest 5: Checking database settings...');
    const dbSettings = await queryMainDb(`
      SELECT 
        name, 
        setting, 
        unit, 
        context, 
        short_desc
      FROM 
        pg_settings 
      WHERE 
        name IN (
          'max_connections', 
          'statement_timeout', 
          'work_mem', 
          'shared_buffers',
          'max_parallel_workers',
          'effective_cache_size'
        )
    `);
    
    console.log('  Database settings:');
    dbSettings.rows.forEach(setting => {
      console.log(`    ${setting.name}: ${setting.setting}${setting.unit ? ' ' + setting.unit : ''} - ${setting.short_desc}`);
    });
    
    // Test 6: Check if there's a default row limit in the connection
    console.log('\nTest 6: Checking for default row limits in connection...');
    try {
      const rowLimitSetting = await queryMainDb(`SHOW max_rows`);
      console.log(`  max_rows setting: ${rowLimitSetting.rows[0].max_rows}`);
    } catch (error) {
      console.log(`  No max_rows setting found (this is normal)`);
    }
    
    // Summary
    console.log('\n=== Summary ===');
    
    // Check if any queries returned exactly 500 rows
    if (cptRows.rows.length === 500 && parseInt(cptCount.rows[0].count) > 500) {
      console.log(`⚠️  CPT query returned exactly 500 rows but database has ${cptCount.rows[0].count} rows!`);
      console.log(`    This suggests a 500 row limit is being applied somewhere.`);
    } else if (cptRows.rows.length < parseInt(cptCount.rows[0].count)) {
      console.log(`⚠️  CPT query returned ${cptRows.rows.length} rows but database has ${cptCount.rows[0].count} rows!`);
    } else {
      console.log(`✓ CPT query returned all ${cptRows.rows.length} rows as expected.`);
    }
    
    if (icd10Rows.rows.length === 500 && parseInt(icd10Count.rows[0].count) > 500) {
      console.log(`⚠️  ICD-10 query returned exactly 500 rows but database has ${icd10Count.rows[0].count} rows!`);
      console.log(`    This suggests a 500 row limit is being applied somewhere.`);
    } else if (icd10Rows.rows.length < parseInt(icd10Count.rows[0].count)) {
      console.log(`⚠️  ICD-10 query returned ${icd10Rows.rows.length} rows but database has ${icd10Count.rows[0].count} rows!`);
    } else {
      console.log(`✓ ICD-10 query returned all ${icd10Rows.rows.length} rows as expected.`);
    }
    
    if (mappingRows.rows.length === 500 && parseInt(mappingCount.rows[0].count) > 500) {
      console.log(`⚠️  Mapping query returned exactly 500 rows but database has ${mappingCount.rows[0].count} rows!`);
      console.log(`    This suggests a 500 row limit is being applied somewhere.`);
    } else if (mappingRows.rows.length < parseInt(mappingCount.rows[0].count)) {
      console.log(`⚠️  Mapping query returned ${mappingRows.rows.length} rows but database has ${mappingCount.rows[0].count} rows!`);
    } else {
      console.log(`✓ Mapping query returned all ${mappingRows.rows.length} rows as expected.`);
    }
    
  } catch (error) {
    console.error('\nError during testing:', error);
  } finally {
    process.exit(0);
  }
}

testDatabaseQueryLimits();