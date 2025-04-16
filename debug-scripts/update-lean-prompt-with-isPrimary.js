/**
 * Script to update the lean prompt template to include the isPrimary flag
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
    
    // Step 2: Update the example JSON to include isPrimary flag
    console.log('\nStep 2: Updating example JSON to include isPrimary flag...');
    let updatedContent = template.content_template;
    
    // Find and replace the suggestedICD10Codes example
    const oldExampleRegex = /"suggestedICD10Codes": \[\s*{\s*"code": "[^"]+", "description": "[^"]+"\s*},\s*{\s*"code": "[^"]+", "description": "[^"]+"\s*}\s*\]/g;
    const newExample = `"suggestedICD10Codes": [
    {"code": "M54.5", "description": "Low back pain", "isPrimary": true},
    {"code": "M51.26", "description": "Intervertebral disc disorders with radiculopathy, lumbar region", "isPrimary": false}
  ]`;
    
    updatedContent = updatedContent.replace(oldExampleRegex, newExample);
    
    // Add instructions about the isPrimary flag
    const responseFormatRegex = /RESPONSE FORMAT:\s*Provide your response in JSON format with the following fields:/;
    const additionalInstructions = `RESPONSE FORMAT:
Provide your response in JSON format with the following fields:
- validationStatus: "appropriate", "inappropriate", or "needs_clarification"
- complianceScore: numeric score from 1-9
- feedback: educational note for the physician
- suggestedICD10Codes: array of objects with code, description, and isPrimary flag (EXACTLY ONE code must have isPrimary set to true)
- suggestedCPTCodes: array of objects with code and description
- internalReasoning: explanation of your reasoning process`;
    
    updatedContent = updatedContent.replace(responseFormatRegex, additionalInstructions);
    
    // Step 3: Update the template in the database
    console.log('\nStep 3: Updating lean template in database...');
    await client.query(`
      UPDATE prompt_templates
      SET content_template = $1,
          updated_at = NOW()
      WHERE id = 1;
    `, [updatedContent]);
    
    console.log('Lean template updated successfully with isPrimary flag.');
    
    // Step 4: Verify the update
    console.log('\nStep 4: Verifying update...');
    const verifyResult = await client.query(`
      SELECT id, name, updated_at
      FROM prompt_templates
      WHERE id = 1;
    `);
    
    if (verifyResult.rows.length === 0) {
      console.error('Lean template with ID 1 not found after update!');
    } else {
      const updatedTemplate = verifyResult.rows[0];
      console.log(`Updated template: ID: ${updatedTemplate.id}, Name: ${updatedTemplate.name}, Updated At: ${updatedTemplate.updated_at}`);
    }
    
    console.log('\nLean template update completed successfully.');
    
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