/**
 * Script to update template #15 with improved JSON response block format
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

// The improved JSON response block
const improvedJsonBlock = `\`\`\`json
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
\`\`\``;

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
    
    // Look for the JSON block between RESPONSE FORMAT: and the end of the template
    const responseFormatIndex = updatedContent.indexOf('RESPONSE FORMAT:');
    if (responseFormatIndex === -1) {
      console.error('Could not find "RESPONSE FORMAT:" section in the template!');
      return;
    }
    
    // Find the start of the JSON block (```json)
    const jsonBlockStartIndex = updatedContent.indexOf('```json', responseFormatIndex);
    if (jsonBlockStartIndex === -1) {
      console.error('Could not find JSON block start in the template!');
      return;
    }
    
    // Find the end of the JSON block (```)
    const jsonBlockEndIndex = updatedContent.indexOf('```', jsonBlockStartIndex + 7);
    if (jsonBlockEndIndex === -1) {
      console.error('Could not find JSON block end in the template!');
      return;
    }
    
    // Replace the JSON block
    updatedContent = 
      updatedContent.substring(0, jsonBlockStartIndex) + 
      improvedJsonBlock + 
      updatedContent.substring(updatedContent.indexOf('\n', jsonBlockEndIndex));
    
    // Step 3: Create a new version of the template
    console.log('\nCreating updated template...');
    
    // Increment the version number
    const versionMatch = template.version.match(/(\d+)\.(\d+)/);
    let newVersion;
    if (versionMatch) {
      const major = parseInt(versionMatch[1]);
      const minor = parseInt(versionMatch[2]);
      newVersion = `${major}.${minor + 1}`;
    } else {
      newVersion = template.version + '.1';
    }
    
    const newName = template.name.replace(/v\d+\.\d+/, `v${newVersion}`);
    
    // Insert the new template
    console.log(`Creating new template with version ${newVersion}...`);
    const insertResult = await client.query(`
      INSERT INTO prompt_templates (
        name, type, version, content_template, word_limit, active, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, FALSE, NOW(), NOW()
      ) RETURNING id;
    `, [
      newName,
      template.type,
      newVersion,
      updatedContent,
      template.word_limit
    ]);
    
    const newTemplateId = insertResult.rows[0].id;
    console.log(`New template created with ID: ${newTemplateId}`);
    
    // Step 4: Set the new template as active
    console.log('\nSetting all templates to inactive...');
    await client.query(`
      UPDATE prompt_templates
      SET active = FALSE,
          updated_at = NOW()
      WHERE type = 'default';
    `);
    console.log('All templates set to inactive');
    
    console.log(`\nSetting template ID ${newTemplateId} to active...`);
    await client.query(`
      UPDATE prompt_templates
      SET active = TRUE,
          updated_at = NOW()
      WHERE id = $1;
    `, [newTemplateId]);
    console.log(`Template ID ${newTemplateId} set to active`);
    
    // Step 5: Verify the active template
    console.log('\nVerifying active template...');
    const result = await client.query(`
      SELECT id, name, type, version, active, word_limit
      FROM prompt_templates
      WHERE active = TRUE;
    `);
    
    if (result.rows.length === 0) {
      console.error('No active templates found!');
    } else {
      console.log('Active template:');
      const activeTemplate = result.rows[0];
      console.log(`ID: ${activeTemplate.id}, Name: ${activeTemplate.name}, Type: ${activeTemplate.type}, Version: ${activeTemplate.version}, Active: ${activeTemplate.active}, Word Limit: ${activeTemplate.word_limit || 'Not set'}`);
    }
    
    console.log('\nTemplate update completed successfully.');
    
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