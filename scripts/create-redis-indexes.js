/**
 * Script to create Redis indexes for CPT and ICD-10 codes
 */
import { getRedisClient, closeRedisConnection } from '../dist/config/redis.js';

async function createRedisIndexes() {
  try {
    console.log('Creating Redis indexes...');
    const client = getRedisClient();
    
    // Check if Redis is connected
    const pingResult = await client.ping();
    console.log(`Redis ping result: ${pingResult}`);
    
    // Create CPT index
    try {
      console.log('Creating CPT index...');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (client).call(
        'FT.CREATE', 'cpt_index',
        'ON', 'JSON',
        'PREFIX', '1', 'cpt:',
        'SCHEMA',
        '$.description', 'TEXT', 'WEIGHT', '5.0', 'AS', 'description',
        '$.modality', 'TAG', 'AS', 'modality',
        '$.body_part', 'TAG', 'AS', 'body_part',
        '$.description', 'TEXT', 'WEIGHT', '1.0', 'NOSTEM', 'AS', 'description_nostem'
      );
      console.log('CPT index created successfully');
    } catch (error) {
      if (error.message && error.message.includes('Index already exists')) {
        console.log('CPT index already exists');
      } else {
        console.error('Error creating CPT index:', error);
        
        // Try a simpler index creation
        try {
          console.log('Trying simpler CPT index creation...');
          await (client).call(
            'FT.CREATE', 'cpt_index',
            'ON', 'JSON',
            'PREFIX', '1', 'cpt:',
            'SCHEMA',
            '$.description', 'TEXT'
          );
          console.log('Simple CPT index created successfully');
        } catch (simpleError) {
          console.error('Error creating simple CPT index:', simpleError);
        }
      }
    }
    
    // Create ICD-10 index
    try {
      console.log('Creating ICD-10 index...');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (client).call(
        'FT.CREATE', 'icd10_index',
        'ON', 'JSON',
        'PREFIX', '1', 'icd10:',
        'SCHEMA',
        '$.description', 'TEXT', 'WEIGHT', '5.0', 'AS', 'description',
        '$.clinical_notes', 'TEXT', 'AS', 'clinical_notes',
        '$.keywords', 'TEXT', 'AS', 'keywords'
      );
      console.log('ICD-10 index created successfully');
    } catch (error) {
      if (error.message && error.message.includes('Index already exists')) {
        console.log('ICD-10 index already exists');
      } else {
        console.error('Error creating ICD-10 index:', error);
        
        // Try a simpler index creation
        try {
          console.log('Trying simpler ICD-10 index creation...');
          await (client).call(
            'FT.CREATE', 'icd10_index',
            'ON', 'JSON',
            'PREFIX', '1', 'icd10:',
            'SCHEMA',
            '$.description', 'TEXT'
          );
          console.log('Simple ICD-10 index created successfully');
        } catch (simpleError) {
          console.error('Error creating simple ICD-10 index:', simpleError);
        }
      }
    }
    
    // Check if indexes were created
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cptIndexInfo = await (client).call('FT.INFO', 'cpt_index');
      console.log('CPT index info:', cptIndexInfo);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const icd10IndexInfo = await (client).call('FT.INFO', 'icd10_index');
      console.log('ICD-10 index info:', icd10IndexInfo);
    } catch (error) {
      console.error('Error checking indexes:', error);
    }
    
    // Close Redis connection
    await closeRedisConnection();
    console.log('Redis connection closed');
  } catch (error) {
    console.error('Error creating Redis indexes:', error);
    
    // Try to close Redis connection on error
    try {
      await closeRedisConnection();
      console.log('Redis connection closed after error');
    } catch (closeError) {
      console.error('Error closing Redis connection:', closeError);
    }
  }
}

// Run the function
createRedisIndexes();