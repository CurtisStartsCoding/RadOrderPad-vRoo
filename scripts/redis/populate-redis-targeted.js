/**
 * Script to populate Redis with targeted data from PostgreSQL
 */
import { queryMainDb } from '../dist/config/db.js';
import { getRedisClient, closeRedisConnection } from '../dist/config/redis.js';

async function populateRedisTargeted() {
  try {
    console.log('Populating Redis with targeted data from PostgreSQL...');
    const client = getRedisClient();
    
    // Check if Redis is connected
    const pingResult = await client.ping();
    console.log(`Redis ping result: ${pingResult}`);
    
    // Get shoulder-related CPT codes from PostgreSQL
    console.log('Getting shoulder-related CPT codes from PostgreSQL...');
    const shoulderCptResult = await queryMainDb("SELECT cpt_code, description, modality, body_part FROM medical_cpt_codes WHERE description ILIKE '%shoulder%' OR body_part ILIKE '%shoulder%'");
    console.log(`Found ${shoulderCptResult.rows.length} shoulder-related CPT codes`);
    
    // Store shoulder-related CPT codes in Redis
    console.log('Storing shoulder-related CPT codes in Redis...');
    for (const row of shoulderCptResult.rows) {
      const key = `cpt:${row.cpt_code}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (client).call('JSON.SET', key, '.', JSON.stringify(row));
      console.log(`Stored ${key}`);
    }
    
    // Get MRI-related CPT codes from PostgreSQL
    console.log('Getting MRI-related CPT codes from PostgreSQL...');
    const mriCptResult = await queryMainDb("SELECT cpt_code, description, modality, body_part FROM medical_cpt_codes WHERE description ILIKE '%MRI%' OR modality ILIKE '%MRI%'");
    console.log(`Found ${mriCptResult.rows.length} MRI-related CPT codes`);
    
    // Store MRI-related CPT codes in Redis
    console.log('Storing MRI-related CPT codes in Redis...');
    for (const row of mriCptResult.rows) {
      const key = `cpt:${row.cpt_code}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (client).call('JSON.SET', key, '.', JSON.stringify(row));
      console.log(`Stored ${key}`);
    }
    
    // Get shoulder-related ICD-10 codes from PostgreSQL
    console.log('Getting shoulder-related ICD-10 codes from PostgreSQL...');
    const shoulderIcd10Result = await queryMainDb("SELECT icd10_code, description, clinical_notes, imaging_modalities, primary_imaging FROM medical_icd10_codes WHERE description ILIKE '%shoulder%' LIMIT 100");
    console.log(`Found ${shoulderIcd10Result.rows.length} shoulder-related ICD-10 codes (limited to 100)`);
    
    // Store shoulder-related ICD-10 codes in Redis
    console.log('Storing shoulder-related ICD-10 codes in Redis...');
    for (const row of shoulderIcd10Result.rows) {
      const key = `icd10:${row.icd10_code}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (client).call('JSON.SET', key, '.', JSON.stringify(row));
      console.log(`Stored ${key}`);
    }
    
    // Get mappings for shoulder-related codes from PostgreSQL
    console.log('Getting mappings for shoulder-related codes from PostgreSQL...');
    const mappingResult = await queryMainDb(`
      SELECT m.id, m.icd10_code, i.description as icd10_description, 
             m.cpt_code, c.description as cpt_description, 
             m.appropriateness, m.evidence_source, m.refined_justification
      FROM medical_cpt_icd10_mappings m
      JOIN medical_icd10_codes i ON m.icd10_code = i.icd10_code
      JOIN medical_cpt_codes c ON m.cpt_code = c.cpt_code
      WHERE i.description ILIKE '%shoulder%' OR c.description ILIKE '%shoulder%' OR c.body_part ILIKE '%shoulder%'
    `);
    console.log(`Found ${mappingResult.rows.length} mappings for shoulder-related codes`);
    
    // Store mappings in Redis
    console.log('Storing mappings in Redis...');
    for (const row of mappingResult.rows) {
      const key = `mapping:${row.icd10_code}:${row.cpt_code}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (client).call('JSON.SET', key, '.', JSON.stringify(row));
      console.log(`Stored ${key}`);
    }
    
    // Get markdown docs for shoulder-related ICD-10 codes from PostgreSQL
    console.log('Getting markdown docs for shoulder-related ICD-10 codes from PostgreSQL...');
    const markdownResult = await queryMainDb(`
      SELECT md.id, md.icd10_code, i.description as icd10_description, 
             md.content
      FROM medical_icd10_markdown_docs md
      JOIN medical_icd10_codes i ON md.icd10_code = i.icd10_code
      WHERE i.description ILIKE '%shoulder%'
    `);
    console.log(`Found ${markdownResult.rows.length} markdown docs for shoulder-related ICD-10 codes`);
    
    // Store markdown docs in Redis
    console.log('Storing markdown docs in Redis...');
    for (const row of markdownResult.rows) {
      const key = `markdown:${row.icd10_code}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (client).call('JSON.SET', key, '.', JSON.stringify(row));
      console.log(`Stored ${key}`);
    }
    
    // Check if the data was stored
    const keys = await client.keys('*');
    console.log(`Total Redis keys after population: ${keys.length}`);
    
    // Rebuild the indexes to make sure they include the new data
    try {
      console.log('Dropping existing CPT index...');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (client).call('FT.DROPINDEX', 'cpt_index');
      console.log('CPT index dropped');
    } catch (error) {
      console.log('Error dropping CPT index:', error.message);
    }
    
    try {
      console.log('Dropping existing ICD-10 index...');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (client).call('FT.DROPINDEX', 'icd10_index');
      console.log('ICD-10 index dropped');
    } catch (error) {
      console.log('Error dropping ICD-10 index:', error.message);
    }
    
    // Create CPT index
    console.log('Creating CPT index...');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (client).call(
      'FT.CREATE', 'cpt_index', 'ON', 'JSON', 'PREFIX', '1', 'cpt:',
      'SCHEMA',
      '$.description', 'AS', 'description', 'TEXT', 'WEIGHT', '5.0',
      '$.modality', 'AS', 'modality', 'TAG',
      '$.body_part', 'AS', 'body_part', 'TAG',
      '$.description', 'AS', 'description_nostem', 'TEXT', 'NOSTEM'
    );
    console.log('CPT index created');
    
    // Create ICD-10 index
    console.log('Creating ICD-10 index...');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (client).call(
      'FT.CREATE', 'icd10_index', 'ON', 'JSON', 'PREFIX', '1', 'icd10:',
      'SCHEMA',
      '$.description', 'AS', 'description', 'TEXT', 'WEIGHT', '5.0',
      '$.keywords', 'AS', 'keywords', 'TEXT', 'WEIGHT', '2.0',
      '$.category', 'AS', 'category', 'TAG',
      '$.is_billable', 'AS', 'is_billable', 'TAG',
      '$.description', 'AS', 'description_nostem', 'TEXT', 'NOSTEM'
    );
    console.log('ICD-10 index created');
    
    console.log('Redis population complete!');
  } catch (error) {
    console.error('Error populating Redis:', error);
  } finally {
    await closeRedisConnection();
  }
}

populateRedisTargeted();      await (client).call('FT.DROPINDEX', 'icd10_index');
      console.log('ICD-10 index dropped');
    } catch (error) {
      console.log('Error dropping ICD-10 index:', error.message);
    }
    
    // Create CPT index
    console.log('Creating CPT index...');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (client).call(
      'FT.CREATE', 'cpt_index', 'ON', 'JSON', 'PREFIX', '1', 'cpt:',
      'SCHEMA',
      '$.description', 'AS', 'description', 'TEXT', 'WEIGHT', '5.0',
      '$.modality', 'AS', 'modality', 'TAG',
      '$.body_part', 'AS', 'body_part', 'TAG',
      '$.description', 'AS', 'description_nostem', 'TEXT', 'NOSTEM'
    );
    console.log('CPT index created');
    
    // Create ICD-10 index
    console.log('Creating ICD-10 index...');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (client).call(
      'FT.CREATE', 'icd10_index', 'ON', 'JSON', 'PREFIX', '1', 'icd10:',
      'SCHEMA',
      '$.description', 'AS', 'description', 'TEXT', 'WEIGHT', '5.0',
      '$.keywords', 'AS', 'keywords', 'TEXT', 'WEIGHT', '2.0',
      '$.category', 'AS', 'category', 'TAG',
      '$.is_billable', 'AS', 'is_billable', 'TAG',
      '$.description', 'AS', 'description_nostem', 'TEXT', 'NOSTEM'
    );
    console.log('ICD-10 index created');
    
    console.log('Redis population complete!');
  } catch (error) {
    console.error('Error populating Redis:', error);
  } finally {
    await closeRedisConnection();
  }
}

populateRedisTargeted();