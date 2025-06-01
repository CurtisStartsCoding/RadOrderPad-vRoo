const { getRedisClient } = require('../src/config/redis');

async function checkRedisWithScan() {
  try {
    const client = getRedisClient();
    
    console.log('Checking Redis keys using SCAN command...\n');
    
    // Count keys using SCAN instead of KEYS
    const counts = {
      cpt: 0,
      icd10: 0,
      mapping: 0,
      markdown: 0,
      other: 0
    };
    
    let cursor = '0';
    do {
      // Use SCAN to iterate through keys in batches
      const result = await client.scan(cursor, 'COUNT', 1000);
      cursor = result[0];
      const keys = result[1];
      
      // Count keys by type
      for (const key of keys) {
        if (key.startsWith('cpt:code:')) {
          counts.cpt++;
        } else if (key.startsWith('icd10:code:')) {
          counts.icd10++;
        } else if (key.startsWith('mapping:icd10-to-cpt:')) {
          counts.mapping++;
        } else if (key.startsWith('markdown:')) {
          counts.markdown++;
        } else {
          counts.other++;
        }
      }
      
      // Show progress
      process.stdout.write(`\rScanning... CPT: ${counts.cpt}, ICD-10: ${counts.icd10}, Mappings: ${counts.mapping}, Markdown: ${counts.markdown}`);
      
    } while (cursor !== '0');
    
    console.log('\n\nFinal counts using SCAN:');
    console.log(`- CPT codes: ${counts.cpt}`);
    console.log(`- ICD-10 codes: ${counts.icd10}`);
    console.log(`- Mappings: ${counts.mapping}`);
    console.log(`- Markdown docs: ${counts.markdown}`);
    console.log(`- Other keys: ${counts.other}`);
    console.log(`- Total keys: ${counts.cpt + counts.icd10 + counts.mapping + counts.markdown + counts.other}`);
    
    // Check Redis info for memory and key limits
    console.log('\nChecking Redis server info...\n');
    
    const info = await client.info('memory');
    const memoryLines = info.split('\r\n').filter(line => line.includes('used_memory') || line.includes('maxmemory'));
    console.log('Memory info:');
    memoryLines.forEach(line => console.log(`  ${line}`));
    
    const keyspaceInfo = await client.info('keyspace');
    console.log('\nKeyspace info:');
    console.log(keyspaceInfo);
    
    // Check if we're hitting exactly 500 anywhere
    const total = counts.cpt + counts.icd10 + counts.mapping + counts.markdown;
    if (total === 500 || counts.cpt === 500 || counts.icd10 === 500) {
      console.log('\n⚠️  WARNING: Found exactly 500 keys, which suggests a limit is being applied!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkRedisWithScan();