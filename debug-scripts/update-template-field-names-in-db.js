/**
 * Script to update field names in the comprehensive prompt template in the database
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
    
    // Step 1: Get the current content of the comprehensive template (ID 2)
    console.log('\nStep 1: Getting current template content...');
    const result = await client.query(`
      SELECT id, name, content_template
      FROM prompt_templates
      WHERE id = 2;
    `);
    
    if (result.rows.length === 0) {
      console.error('Template with ID 2 not found!');
      return;
    }
    
    const template = result.rows[0];
    console.log(`Found template: ID: ${template.id}, Name: ${template.name}`);
    
    // Step 2: Update the field names in the template content
    console.log('\nStep 2: Updating field names in template content...');
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
    console.log('\nStep 3: Updating template in database...');
    await client.query(`
      UPDATE prompt_templates
      SET content_template = $1,
          updated_at = NOW()
      WHERE id = 2;
    `, [updatedContent]);
    
    console.log('Template updated successfully.');
    
    // Step 4: Verify the update
    console.log('\nStep 4: Verifying update...');
    const verifyResult = await client.query(`
      SELECT id, name, updated_at
      FROM prompt_templates
      WHERE id = 2;
    `);
    
    if (verifyResult.rows.length === 0) {
      console.error('Template with ID 2 not found after update!');
    } else {
      const updatedTemplate = verifyResult.rows[0];
      console.log(`Updated template: ID: ${updatedTemplate.id}, Name: ${updatedTemplate.name}, Updated At: ${updatedTemplate.updated_at}`);
    }
    
    console.log('\nTemplate field names update completed successfully.');
    
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