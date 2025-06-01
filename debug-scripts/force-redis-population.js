const { queryMainDb } = require('../src/config/db');
const { getRedisClient } = require('../src/config/redis');
const enhancedLogger = require('../src/utils/enhanced-logger').default;

/**
 * Cache data in Redis using batch operations
 * @param items - Array of items to cache
 * @param keyFn - Function to generate key for each item
 */
async function cacheBatch(items, keyFn) {
  const BATCH_SIZE = 1000; // Process 1000 items at a time
  const client = getRedisClient();
  
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    const pipeline = client.pipeline();
    
    for (const item of batch) {
      const key = keyFn(item);
      
      // Determine storage method based on key prefix
      if (key.startsWith('cpt:') || key.startsWith('icd10:') || key.startsWith('markdown:')) {
        // Store as JSON document for CPT, ICD-10, and Markdown data
        pipeline.call('JSON.SET', key, '.', JSON.stringify(item));
      } else {
        // Store as a hash for other data types (e.g., mappings)
        for (const [field, value] of Object.entries(item)) {
          if (value !== null && value !== undefined) {
            pipeline.hset(key, field, typeof value === 'object' ? JSON.stringify(value) : String(value));
          }
        }
      }
    }
    
    await pipeline.exec();
    console.log(`Processed batch ${i / BATCH_SIZE + 1}/${Math.ceil(items.length / BATCH_SIZE)}, ${i + batch.length}/${items.length} items`);
  }
}

async function forceRedisPopulation() {
  try {
    console.log('=== Forcing Complete Redis Population ===\n');
    
    // Get database counts
    const cptCount = await queryMainDb('SELECT COUNT(*) as count FROM medical_cpt_codes');
    const icd10Count = await queryMainDb('SELECT COUNT(*) as count FROM medical_icd10_codes');
    const mappingCount = await queryMainDb('SELECT COUNT(*) as count FROM medical_cpt_icd10_mappings');
    
    console.log('Database record counts:');
    console.log(`- CPT codes: ${cptCount.rows[0].count}`);
    console.log(`- ICD-10 codes: ${icd10Count.rows[0].count}`);
    console.log(`- Mappings: ${mappingCount.rows[0].count}`);
    
    // Check Redis counts
    const client = getRedisClient();
    const cptKeys = await client.keys('cpt:code:*');
    const icd10Keys = await client.keys('icd10:code:*');
    const mappingKeys = await client.keys('mapping:icd10-to-cpt:*');
    
    console.log('\nCurrent Redis key counts:');
    console.log(`- CPT keys: ${cptKeys.length}`);
    console.log(`- ICD-10 keys: ${icd10Keys.length}`);
    console.log(`- Mapping keys: ${mappingKeys.length}`);
    
    // Check for discrepancies
    const cptMissing = parseInt(cptCount.rows[0].count) - cptKeys.length;
    const icd10Missing = parseInt(icd10Count.rows[0].count) - icd10Keys.length;
    const mappingMissing = parseInt(mappingCount.rows[0].count) - mappingKeys.length;
    
    console.log('\nMissing records:');
    console.log(`- CPT missing: ${cptMissing}`);
    console.log(`- ICD-10 missing: ${icd10Missing}`);
    console.log(`- Mappings missing: ${mappingMissing}`);
    
    // Ask for confirmation
    console.log('\nWARNING: This will delete all existing Redis keys and repopulate from the database.');
    console.log('Press Ctrl+C to cancel or wait 5 seconds to continue...');
    
    // Wait for 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Delete all existing keys
    console.log('\nDeleting existing Redis keys...');
    
    if (cptKeys.length > 0) {
      console.log(`Deleting ${cptKeys.length} CPT keys...`);
      for (const key of cptKeys) {
        await client.del(key);
      }
    }
    
    if (icd10Keys.length > 0) {
      console.log(`Deleting ${icd10Keys.length} ICD-10 keys...`);
      for (const key of icd10Keys) {
        await client.del(key);
      }
    }
    
    if (mappingKeys.length > 0) {
      console.log(`Deleting ${mappingKeys.length} mapping keys...`);
      for (const key of mappingKeys) {
        await client.del(key);
      }
    }
    
    console.log('\nPopulating Redis from PostgreSQL...');
    const startTime = Date.now();
    
    // Populate CPT codes
    console.log('Populating CPT codes...');
    const cptResult = await queryMainDb('SELECT * FROM medical_cpt_codes');
    await cacheBatch(cptResult.rows, row => `cpt:code:${row.cpt_code || row.code}`);
    
    // Populate ICD-10 codes
    console.log('Populating ICD-10 codes...');
    const icd10Result = await queryMainDb('SELECT * FROM medical_icd10_codes');
    await cacheBatch(icd10Result.rows, row => `icd10:code:${row.icd10_code || row.code}`);
    
    // Populate mappings
    console.log('Populating mappings...');
    const mappingResult = await queryMainDb('SELECT * FROM medical_cpt_icd10_mappings');
    await cacheBatch(mappingResult.rows, row => `mapping:icd10-to-cpt:${row.icd10_code || row.icd_code}`);
    
    // Populate markdown docs if available
    try {
      console.log('Populating markdown docs...');
      const markdownResult = await queryMainDb('SELECT * FROM medical_icd10_markdown_docs');
      await cacheBatch(markdownResult.rows, row => `markdown:${row.icd10_code || row.icd_code}`);
    } catch (error) {
      console.log('Markdown docs table not found or empty, skipping');
    }
    
    const endTime = Date.now();
    console.log(`\nRedis population completed in ${(endTime - startTime) / 1000} seconds`);
    
    // Verify population
    const newCptKeys = await client.keys('cpt:code:*');
    const newIcd10Keys = await client.keys('icd10:code:*');
    const newMappingKeys = await client.keys('mapping:icd10-to-cpt:*');
    
    console.log('\nNew Redis key counts:');
    console.log(`- CPT keys: ${newCptKeys.length}`);
    console.log(`- ICD-10 keys: ${newIcd10Keys.length}`);
    console.log(`- Mapping keys: ${newMappingKeys.length}`);
    
    console.log('\nPopulation complete!');
    
  } catch (error) {
    console.error('Error during Redis population:', error);
  } finally {
    process.exit(0);
  }
}

forceRedisPopulation();