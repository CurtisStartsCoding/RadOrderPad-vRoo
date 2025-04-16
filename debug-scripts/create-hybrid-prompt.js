/**
 * Script to create a hybrid prompt template that combines:
 * - The lean template's simple wording
 * - The comprehensive template's JSON output format and critical requirements
 */
require('dotenv').config();
const { Pool } = require('pg');

// Get database connection details from environment variables
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5433';
const DB_NAME = process.env.DB_NAME || 'radorder_main';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres123';

// Create a connection pool
const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD
});

async function run() {
  let client;
  
  try {
    console.log('Connecting to database...');
    client = await pool.connect();
    console.log('Connected to database');
    
    // Step 1: Get the lean template content
    console.log('\nStep 1: Getting lean template content...');
    const leanResult = await client.query(`
      SELECT id, name, content_template
      FROM prompt_templates
      WHERE id = 1;
    `);
    
    if (leanResult.rows.length === 0) {
      console.error('Lean template with ID 1 not found!');
      return;
    }
    
    const leanTemplate = leanResult.rows[0];
    console.log(`Found lean template: ID: ${leanTemplate.id}, Name: ${leanTemplate.name}`);
    
    // Step 2: Get the comprehensive template content
    console.log('\nStep 2: Getting comprehensive template content...');
    const compResult = await client.query(`
      SELECT id, name, content_template
      FROM prompt_templates
      WHERE id = 2;
    `);
    
    if (compResult.rows.length === 0) {
      console.error('Comprehensive template with ID 2 not found!');
      return;
    }
    
    const compTemplate = compResult.rows[0];
    console.log(`Found comprehensive template: ID: ${compTemplate.id}, Name: ${compTemplate.name}`);
    
    // Step 3: Extract the lean template's wording (everything before the JSON example)
    console.log('\nStep 3: Extracting lean template wording...');
    const leanContent = leanTemplate.content_template;
    const leanWording = leanContent.split('Example response format:')[0].trim();
    console.log('Extracted lean template wording');
    
    // Step 4: Extract the comprehensive template's JSON output format and critical requirements
    console.log('\nStep 4: Extracting comprehensive template JSON format and requirements...');
    const compContent = compTemplate.content_template;
    const jsonFormatIndex = compContent.indexOf('```json');
    const criticalRequirementsIndex = compContent.indexOf('CRITICAL REQUIREMENTS:');
    
    if (jsonFormatIndex === -1 || criticalRequirementsIndex === -1) {
      console.error('Could not find JSON format or critical requirements in comprehensive template!');
      return;
    }
    
    const jsonFormatAndRequirements = compContent.substring(jsonFormatIndex).trim();
    console.log('Extracted comprehensive template JSON format and requirements');
    
    // Step 5: Create the hybrid template content
    console.log('\nStep 5: Creating hybrid template content...');
    const hybridContent = `${leanWording}

Example response format:
${jsonFormatAndRequirements}`;
    
    // Step 6: Create a new template record
    console.log('\nStep 6: Creating new hybrid template record...');
    const insertResult = await client.query(`
      INSERT INTO prompt_templates (
        name, 
        type, 
        version, 
        content_template, 
        active, 
        created_at, 
        updated_at
      )
      VALUES (
        'Hybrid Validation Prompt', 
        'default', 
        '1.0', 
        $1, 
        FALSE, 
        NOW(), 
        NOW()
      )
      RETURNING id;
    `, [hybridContent]);
    
    const newTemplateId = insertResult.rows[0].id;
    console.log(`Created new hybrid template with ID: ${newTemplateId}`);
    
    // Step 7: Set all templates to inactive
    console.log('\nStep 7: Setting all templates to inactive...');
    await client.query(`
      UPDATE prompt_templates
      SET active = FALSE,
          updated_at = NOW()
      WHERE type = 'default';
    `);
    console.log('All templates set to inactive');
    
    // Step 8: Set the new hybrid template to active
    console.log('\nStep 8: Setting the new hybrid template to active...');
    await client.query(`
      UPDATE prompt_templates
      SET active = TRUE,
          updated_at = NOW()
      WHERE id = $1;
    `, [newTemplateId]);
    console.log('Hybrid template set to active');
    
    // Step 9: Verify the active template
    console.log('\nStep 9: Verifying active template...');
    const verifyResult = await client.query(`
      SELECT id, name, type, version, active
      FROM prompt_templates
      WHERE active = TRUE;
    `);
    
    if (verifyResult.rows.length === 0) {
      console.error('No active templates found!');
    } else {
      console.log('Active templates:');
      verifyResult.rows.forEach(row => {
        console.log(`ID: ${row.id}, Name: ${row.name}, Type: ${row.type}, Version: ${row.version}, Active: ${row.active}`);
      });
    }
    
    console.log('\nHybrid template creation and activation completed successfully.');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (client) {
      client.release();
    }
    // Close the pool
    await pool.end();
  }
}

// Run the function
run().catch(err => {
  console.error('Unhandled error:', err);
});