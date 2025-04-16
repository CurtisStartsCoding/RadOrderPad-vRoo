/**
 * Script to clean up the prompt template by:
 * 1. Removing duplicated fields
 * 2. Keeping the isPrimary flag requirement
 * 3. Simplifying the internalReasoning example
 * 4. Creating a new template without the word limit part
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
    
    // Step 2: Clean up the template
    console.log('\nStep 2: Cleaning up the template...');
    
    let newContent = activeTemplate.content_template;
    
    // 1. Remove the duplicated fields
    newContent = newContent.replace(
      `- validationStatus: "appropriate", "inappropriate", or "needs_clarification"
- complianceScore: numeric score from 1-9
- feedback: educational note for the physician
- suggestedICD10Codes: array of objects with code and description
- suggestedCPTCodes: array of objects with code and description
- internalReasoning: explanation of your reasoning process`,
      ''
    );
    
    // 2. Simplify the internalReasoning example
    newContent = newContent.replace(
      `"internalReasoning": "This 45-year-old female presents with persistent RLQ pain for 3 weeks with characteristics concerning for appendicitis (RLQ tenderness, guarding, elevated WBC) or gynecological pathology (history of ovarian cysts). The prior ultrasound was inconclusive, which is an appropriate first-line imaging study, but due to continued symptoms and lack of diagnosis, advancing to CT is justified. CT abdomen/pelvis with contrast is the preferred modality for evaluating appendicitis and can also assess for gynecological pathology, inflammatory bowel disease, and other etiologies of RLQ pain. The use of IV contrast is important to evaluate for inflammatory changes and vascular structures. This request aligns with ACR Appropriateness Criteria for acute abdominal pain, particularly when appendicitis or gynecological pathology is suspected after an inconclusive ultrasound."`,
      `"internalReasoning": "Explain your reasoning process here, including why the requested study is appropriate or inappropriate based on clinical guidelines, patient presentation, and medical necessity."`
    );
    
    // 3. Remove the word limit part for the new template
    const noWordLimitContent = newContent.replace('5. Limit your feedback to {{WORD_LIMIT}} words.\n', '');
    
    // Step 3: Insert the cleaned-up template
    console.log('\nStep 3: Inserting cleaned-up template...');
    const insertResult = await client.query(`
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
        'Cleaned-Up Validation Prompt', 
        'default', 
        '1.0', 
        $1, 
        FALSE, 
        NOW(), 
        NOW(),
        33
      )
      RETURNING id;
    `, [newContent]);
    
    const newTemplateId = insertResult.rows[0].id;
    console.log(`New cleaned-up template inserted with ID: ${newTemplateId}`);
    
    // Step 4: Insert the no-word-limit template
    console.log('\nStep 4: Inserting no-word-limit template...');
    const noWordLimitResult = await client.query(`
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
        'No-Word-Limit Validation Prompt', 
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
    
    const noWordLimitId = noWordLimitResult.rows[0].id;
    console.log(`New no-word-limit template inserted with ID: ${noWordLimitId}`);
    
    // Step 5: Verify the new templates
    console.log('\nStep 5: Verifying new templates...');
    const verifyResult = await client.query(`
      SELECT id, name, type, version, active, word_limit
      FROM prompt_templates
      WHERE id IN ($1, $2);
    `, [newTemplateId, noWordLimitId]);
    
    console.log('New templates:');
    verifyResult.rows.forEach(template => {
      console.log(`- ID: ${template.id}, Name: ${template.name}, Active: ${template.active}, Word Limit: ${template.word_limit}`);
    });
    
    console.log('\nTo activate the cleaned-up template, run:');
    console.log(`node debug-scripts/activate-prompt-template.js ${newTemplateId}`);
    
    console.log('\nTo activate the no-word-limit template, run:');
    console.log(`node debug-scripts/activate-prompt-template.js ${noWordLimitId}`);
    
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