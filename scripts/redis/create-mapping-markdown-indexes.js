/**
 * Create RedisSearch Indexes for Mappings and Markdown Documents
 * 
 * This script creates RedisSearch indexes for mappings and markdown documents
 * to enable weighted search for these data types.
 */

import { getRedisClient } from '../../dist/config/redis.js';

async function createMappingMarkdownIndexes() {
  console.log('Creating RedisSearch indexes for mappings and markdown documents...');
  
  try {
    const client = getRedisClient();
    
    // Test connection
    console.log('Testing Redis connection...');
    const pingResult = await client.ping();
    console.log(`Redis connection test result: ${pingResult}`);
    
    // Create mapping index
    console.log('\nCreating mapping index...');
    try {
      // Check if index already exists
      try {
        await client.call('FT.INFO', 'mapping_index');
        console.log('Mapping index already exists, dropping it to recreate...');
        await client.call('FT.DROPINDEX', 'mapping_index');
      } catch (error) {
        if (!error.message.includes('Unknown index name')) {
          throw error;
        }
      }
      
      // Create the mapping index
      // FT.CREATE mapping_index ON JSON PREFIX 1 mapping: SCHEMA
      //   $.icd10_code AS icd10_code TAG
      //   $.cpt_code AS cpt_code TAG
      //   $.icd10_description AS icd10_description TEXT WEIGHT 3.0
      //   $.cpt_description AS cpt_description TEXT WEIGHT 3.0
      //   $.appropriateness AS appropriateness NUMERIC SORTABLE
      //   $.refined_justification AS justification TEXT WEIGHT 5.0
      //   $.evidence_source AS evidence TEXT WEIGHT 2.0
      await client.call(
        'FT.CREATE',
        'mapping_index',
        'ON', 'JSON',
        'PREFIX', '1', 'mapping:',
        'SCHEMA',
        '$.icd10_code', 'AS', 'icd10_code', 'TAG',
        '$.cpt_code', 'AS', 'cpt_code', 'TAG',
        '$.icd10_description', 'AS', 'icd10_description', 'TEXT', 'WEIGHT', '3.0',
        '$.cpt_description', 'AS', 'cpt_description', 'TEXT', 'WEIGHT', '3.0',
        '$.appropriateness', 'AS', 'appropriateness', 'NUMERIC', 'SORTABLE',
        '$.refined_justification', 'AS', 'justification', 'TEXT', 'WEIGHT', '5.0',
        '$.evidence_source', 'AS', 'evidence', 'TEXT', 'WEIGHT', '2.0'
      );
      
      console.log('Mapping index created successfully');
    } catch (error) {
      console.error('Error creating mapping index:', error.message);
    }
    
    // Create markdown index
    console.log('\nCreating markdown index...');
    try {
      // Check if index already exists
      try {
        await client.call('FT.INFO', 'markdown_index');
        console.log('Markdown index already exists, dropping it to recreate...');
        await client.call('FT.DROPINDEX', 'markdown_index');
      } catch (error) {
        if (!error.message.includes('Unknown index name')) {
          throw error;
        }
      }
      
      // Create the markdown index
      // FT.CREATE markdown_index ON JSON PREFIX 1 markdown: SCHEMA
      //   $.icd10_code AS icd10_code TAG
      //   $.icd10_description AS icd10_description TEXT WEIGHT 3.0
      //   $.content AS content TEXT WEIGHT 5.0
      //   $.content_preview AS preview TEXT WEIGHT 2.0
      await client.call(
        'FT.CREATE',
        'markdown_index',
        'ON', 'JSON',
        'PREFIX', '1', 'markdown:',
        'SCHEMA',
        '$.icd10_code', 'AS', 'icd10_code', 'TAG',
        '$.icd10_description', 'AS', 'icd10_description', 'TEXT', 'WEIGHT', '3.0',
        '$.content', 'AS', 'content', 'TEXT', 'WEIGHT', '5.0',
        '$.content_preview', 'AS', 'preview', 'TEXT', 'WEIGHT', '2.0'
      );
      
      console.log('Markdown index created successfully');
    } catch (error) {
      console.error('Error creating markdown index:', error.message);
    }
    
    // Close the connection
    await client.quit();
    console.log('\nRedis connection closed');
    
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

// Run the function
createMappingMarkdownIndexes().catch(console.error);