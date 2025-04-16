/**
 * Script to update field names in the lean prompt template and set it as active
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

// Field name mappings
const fieldNameMappings = {
  'diagnosisCodes': 'suggestedICD10Codes',
  'procedureCodes': 'suggestedCPTCodes'
};

// Fields to remove entirely
const fieldsToRemove = [
  'primaryDiagnosis',
  'codeJustification'
];

async function run() {
  let client;
  
  try {
    console.log('Connecting to database...');
    client = await pool.connect();
    console.log('Connected to database');
    
    // Step 1: Get the current content of the lean template (ID 1)
    console.log('\nStep 1: Getting current lean template content...');
    const result = await client.query(`
      SELECT id, name, content_template
      FROM prompt_templates
      WHERE id = 1;
    `);
    
    if (result.rows.length === 0) {
      console.error('Lean template with ID 1 not found!');
      return;
    }
    
    const template = result.rows[0];
    console.log(`Found template: ID: ${template.id}, Name: ${template.name}`);
    
    // Step 2: Update the field names in the template content
    console.log('\nStep 2: Updating field names in lean template content...');
    let updatedContent = template.content_template;
    
    // Apply the mappings
    Object.entries(fieldNameMappings).forEach(([oldName, newName]) => {
      // Use regex to replace the field names while preserving formatting
      const regex = new RegExp(`"${oldName}"`, 'g');
      updatedContent = updatedContent.replace(regex, `"${newName}"`);
      
      // Also replace any references to the field names in text
      const textRegex = new RegExp(`\`${oldName}\``, 'g');
      updatedContent = updatedContent.replace(textRegex, `\`${newName}\``);
    });
    
    // Remove fields that should be removed entirely
    fieldsToRemove.forEach(fieldToRemove => {
      // Remove the field from JSON structure (including the line with the field name, value, and comma if present)
      const jsonFieldRegex = new RegExp(`\\s*"${fieldToRemove}"\\s*:\\s*[^,}]+(,)?\\s*\\n?`, 'g');
      updatedContent = updatedContent.replace(jsonFieldRegex, '');
      
      // Also remove any references to the field in text
      const textRegex = new RegExp(`\`${fieldToRemove}\``, 'g');
      updatedContent = updatedContent.replace(textRegex, '');
    });
    
    // Step 3: Update the template in the database
    console.log('\nStep 3: Updating lean template in database...');
    await client.query(`
      UPDATE prompt_templates
      SET content_template = $1,
          updated_at = NOW()
      WHERE id = 1;
    `, [updatedContent]);
    
    console.log('Lean template updated successfully.');
    
    // Step 4: Set all templates to inactive
    console.log('\nStep 4: Setting all templates to inactive...');
    await client.query(`
      UPDATE prompt_templates
      SET active = FALSE,
          updated_at = NOW()
      WHERE type = 'default';
    `);
    console.log('All templates set to inactive');
    
    // Step 5: Set the lean template (ID 1) to active
    console.log('\nStep 5: Setting the lean template (ID 1) to active...');
    await client.query(`
      UPDATE prompt_templates
      SET active = TRUE,
          updated_at = NOW()
      WHERE id = 1;
    `);
    console.log('Lean template set to active');
    
    // Step 6: Verify the active template
    console.log('\nStep 6: Verifying active template...');
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
    
    console.log('\nLean template update and activation completed successfully.');
    
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