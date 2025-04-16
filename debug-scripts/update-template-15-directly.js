/**
 * Script to directly update template #15 with improved JSON response block format
 * This script updates the existing template instead of creating a new one
 */
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');

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

// The improved JSON response block
const improvedJsonBlock = `
RESPONSE FORMAT:
Return your output in this exact JSON structure:

\`\`\`json
{
  "validationStatus": "appropriate",  // or "needs_clarification" or "inappropriate"
  "complianceScore": 1-9,
  "feedback": "Always return a concise, educational note (33 words target length). If the order is appropriate, highlight what was done well to support payer approval.",
  "suggestedICD10Codes": [
    { "code": "ICD-10", "description": "Diagnosis description", "isPrimary": true },
    { "code": "ICD-10", "description": "Diagnosis description", "isPrimary": false }
  ],
  "suggestedCPTCodes": [
    { "code": "CPT", "description": "Procedure description" }
  ],
  "internalReasoning": "Explanation of validation logic, including which clinical elements are present and which are missing. This should include appropriateness rationale and payer-review risk based on gaps."
}
\`\`\`
`;

async function run() {
  let client;
  
  try {
    console.log('Connecting to database...');
    client = await pool.connect();
    console.log('Connected to database');
    
    // Step 1: Get the current template content
    console.log('\nFetching template #15...');
    const templateResult = await client.query(`
      SELECT id, name, type, version, content_template, word_limit
      FROM prompt_templates
      WHERE id = 15;
    `);
    
    if (templateResult.rows.length === 0) {
      console.error('Template #15 not found!');
      return;
    }
    
    const template = templateResult.rows[0];
    console.log(`Found template: ID: ${template.id}, Name: ${template.name}, Type: ${template.type}, Version: ${template.version}, Word Limit: ${template.word_limit || 'Not set'}`);
    
    // Step 2: Update the JSON response block in the template content
    console.log('\nUpdating JSON response block...');
    
    // Find the current JSON response block and replace it
    let updatedContent = template.content_template;
    
    // Look for the RESPONSE FORMAT: section
    const responseFormatIndex = updatedContent.indexOf('RESPONSE FORMAT:');
    if (responseFormatIndex === -1) {
      console.error('Could not find "RESPONSE FORMAT:" section in the template!');
      
      // Print the template content for debugging
      console.log('\nTemplate content:');
      console.log(updatedContent);
      return;
    }
    
    // Replace everything from RESPONSE FORMAT: to the end of the template
    updatedContent = updatedContent.substring(0, responseFormatIndex) + improvedJsonBlock;
    
    // Step 3: Update the template directly
    console.log('\nUpdating template #15...');
    await client.query(`
      UPDATE prompt_templates
      SET content_template = $1,
          updated_at = NOW()
      WHERE id = 15;
    `, [updatedContent]);
    console.log('Template #15 updated successfully');
    
    // Step 4: Verify the update
    console.log('\nVerifying update...');
    const verifyResult = await client.query(`
      SELECT id, name, type, version, updated_at
      FROM prompt_templates
      WHERE id = 15;
    `);
    
    if (verifyResult.rows.length === 0) {
      console.error('Template #15 not found after update!');
    } else {
      const updatedTemplate = verifyResult.rows[0];
      console.log(`Updated template: ID: ${updatedTemplate.id}, Name: ${updatedTemplate.name}, Type: ${updatedTemplate.type}, Version: ${updatedTemplate.version}`);
      console.log(`Updated at: ${updatedTemplate.updated_at}`);
    }
    
    console.log('\nTemplate update completed successfully.');
    console.log('\nTo test the updated template, run:');
    console.log('node debug-scripts/enhanced-test-additional-notes.js');
    
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