/**
 * Script to fix the prompt template by:
 * 1. Removing duplicated fields in the RESPONSE FORMAT section
 * 2. Simplifying the internalReasoning example
 * 3. Creating a version without the word limit part
 */
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

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
    
    // Step 1: Get the current active prompt template
    console.log('\nStep 1: Getting current active prompt template...');
    const result = await client.query(`
      SELECT id, name, type, version, content_template, word_limit
      FROM prompt_templates
      WHERE active = TRUE
      ORDER BY id DESC
      LIMIT 1;
    `);
    
    if (result.rows.length === 0) {
      console.error('No active prompt template found!');
      return;
    }
    
    const activeTemplate = result.rows[0];
    console.log(`Found active template: ID: ${activeTemplate.id}, Name: ${activeTemplate.name}`);
    
    // Step 2: Create the fixed template
    console.log('\nStep 2: Creating fixed template...');
    
    // Get the original content
    let content = activeTemplate.content_template;
    
    // Fix 1: Remove the duplicated fields in the RESPONSE FORMAT section
    const responseFormatSection = 
`RESPONSE FORMAT:
Provide your response in JSON format with the following fields:
- validationStatus: "appropriate", "inappropriate", or "needs_clarification"
- complianceScore: numeric score from 1-9
- feedback: educational note for the physician
- suggestedICD10Codes: array of objects with code, description, and isPrimary flag (EXACTLY ONE code must have isPrimary set to true)
- suggestedCPTCodes: array of objects with code and description
- internalReasoning: explanation of your reasoning process`;

    const duplicatedFieldsSection = 
`- validationStatus: "appropriate", "inappropriate", or "needs_clarification"
- complianceScore: numeric score from 1-9
- feedback: educational note for the physician
- suggestedICD10Codes: array of objects with code and description
- suggestedCPTCodes: array of objects with code and description
- internalReasoning: explanation of your reasoning process`;

    // Replace the entire RESPONSE FORMAT section
    content = content.replace(/RESPONSE FORMAT:[\s\S]*?Example response format:/g, responseFormatSection + '\n\nExample response format:');
    
    // Fix 2: Simplify the internalReasoning example
    content = content.replace(
      /"internalReasoning": "This 45-year-old female presents with persistent RLQ pain for 3 weeks with characteristics concerning for appendicitis \(RLQ tenderness, guarding, elevated WBC\) or gynecological pathology \(history of ovarian cysts\). The prior ultrasound was inconclusive, which is an appropriate first-line imaging study, but due to continued symptoms and lack of diagnosis, advancing to CT is justified. CT abdomen\/pelvis with contrast is the preferred modality for evaluating appendicitis and can also assess for gynecological pathology, inflammatory bowel disease, and other etiologies of RLQ pain. The use of IV contrast is important to evaluate for inflammatory changes and vascular structures. This request aligns with ACR Appropriateness Criteria for acute abdominal pain, particularly when appendicitis or gynecological pathology is suspected after an inconclusive ultrasound."/g,
      '"internalReasoning": "Explain your reasoning process here, including why the requested study is appropriate or inappropriate based on clinical guidelines, patient presentation, and medical necessity."'
    );
    
    // Create a version with the word limit
    const withWordLimitContent = content;
    
    // Create a version without the word limit
    const noWordLimitContent = content.replace('5. Limit your feedback to {{WORD_LIMIT}} words.\n', '');
    
    // Step 3: Insert the fixed template with word limit
    console.log('\nStep 3: Inserting fixed template with word limit...');
    const withLimitResult = await client.query(`
      INSERT INTO prompt_templates (
        name, 
        type, 
        version, 
        content_template, 
        active, 
        created_at, 
        updated_at,
        word_limit
      )
      VALUES (
        'Fixed Validation Prompt', 
        'default', 
        '1.0', 
        $1, 
        FALSE, 
        NOW(), 
        NOW(),
        33
      )
      RETURNING id;
    `, [withWordLimitContent]);
    
    const withLimitId = withLimitResult.rows[0].id;
    console.log(`Fixed template with word limit inserted with ID: ${withLimitId}`);
    
    // Step 4: Insert the fixed template without word limit
    console.log('\nStep 4: Inserting fixed template without word limit...');
    const noLimitResult = await client.query(`
      INSERT INTO prompt_templates (
        name, 
        type, 
        version, 
        content_template, 
        active, 
        created_at, 
        updated_at,
        word_limit
      )
      VALUES (
        'Fixed No-Word-Limit Validation Prompt', 
        'default', 
        '1.0', 
        $1, 
        FALSE, 
        NOW(), 
        NOW(),
        33
      )
      RETURNING id;
    `, [noWordLimitContent]);
    
    const noLimitId = noLimitResult.rows[0].id;
    console.log(`Fixed template without word limit inserted with ID: ${noLimitId}`);
    
    // Step 5: Save the templates to files for inspection
    const withLimitPath = path.join(__dirname, '..', `fixed_prompt_with_limit_${withLimitId}.txt`);
    fs.writeFileSync(withLimitPath, withWordLimitContent);
    console.log(`\nFixed template with word limit saved to ${withLimitPath}`);
    
    const noLimitPath = path.join(__dirname, '..', `fixed_prompt_no_limit_${noLimitId}.txt`);
    fs.writeFileSync(noLimitPath, noWordLimitContent);
    console.log(`Fixed template without word limit saved to ${noLimitPath}`);
    
    console.log('\nTo activate the fixed template with word limit, run:');
    console.log(`node debug-scripts/activate-prompt-template.js ${withLimitId}`);
    
    console.log('\nTo activate the fixed template without word limit, run:');
    console.log(`node debug-scripts/activate-prompt-template.js ${noLimitId}`);
    
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