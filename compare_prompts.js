/**
 * Compare Prompts
 * 
 * This script fetches and compares the optimized prompt with template 15 from the database.
 */

require('dotenv').config();
const { Client } = require('pg');

// PostgreSQL connection parameters
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  database: process.env.DB_NAME || 'radorder_main',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123'
};

// Connect to the database
async function connectToDatabase() {
  const client = new Client(dbConfig);
  await client.connect();
  return client;
}

// Fetch prompt templates from the database
async function fetchPromptTemplates() {
  try {
    const client = await connectToDatabase();
    
    // Fetch template 15
    const template15Query = `
      SELECT id, name, type, version, content_template, active, created_at
      FROM prompt_templates
      WHERE id = 15
      LIMIT 1;
    `;
    
    // Fetch optimized prompt
    const optimizedPromptQuery = `
      SELECT id, name, type, version, content_template, active, created_at
      FROM prompt_templates
      WHERE name = 'Optimized Validation with STAT Detection'
      ORDER BY created_at DESC
      LIMIT 1;
    `;
    
    const template15Result = await client.query(template15Query);
    const optimizedPromptResult = await client.query(optimizedPromptQuery);
    
    await client.end();
    
    return {
      template15: template15Result.rows[0],
      optimizedPrompt: optimizedPromptResult.rows[0]
    };
  } catch (error) {
    console.error('Error fetching prompt templates:', error);
    throw error;
  }
}

// Compare the prompts
async function comparePrompts() {
  try {
    console.log('Fetching and comparing prompts...');
    
    const { template15, optimizedPrompt } = await fetchPromptTemplates();
    
    if (!template15) {
      console.error('Template 15 not found in the database.');
      return;
    }
    
    if (!optimizedPrompt) {
      console.error('Optimized prompt not found in the database. Make sure to run the insertion script first.');
      return;
    }
    
    console.log('\n=== TEMPLATE 15 ===');
    console.log(`ID: ${template15.id}`);
    console.log(`Name: ${template15.name}`);
    console.log(`Type: ${template15.type}`);
    console.log(`Version: ${template15.version}`);
    console.log(`Active: ${template15.active}`);
    console.log(`Created: ${template15.created_at}`);
    console.log('\nPrompt Content:');
    console.log('='.repeat(80));
    console.log(template15.content_template);
    console.log('='.repeat(80));
    
    console.log('\n=== OPTIMIZED PROMPT WITH STAT DETECTION ===');
    console.log(`ID: ${optimizedPrompt.id}`);
    console.log(`Name: ${optimizedPrompt.name}`);
    console.log(`Type: ${optimizedPrompt.type}`);
    console.log(`Version: ${optimizedPrompt.version}`);
    console.log(`Active: ${optimizedPrompt.active}`);
    console.log(`Created: ${optimizedPrompt.created_at}`);
    console.log('\nPrompt Content:');
    console.log('='.repeat(80));
    console.log(optimizedPrompt.content_template);
    console.log('='.repeat(80));
    
    // Calculate token savings
    const template15Length = template15.content_template.length;
    const optimizedLength = optimizedPrompt.content_template.length;
    const savings = template15Length - optimizedLength;
    const savingsPercent = Math.round((savings / template15Length) * 100);
    
    console.log('\n=== COMPARISON ===');
    console.log(`Template 15 Length: ${template15Length} characters`);
    console.log(`Optimized Prompt Length: ${optimizedLength} characters`);
    console.log(`Character Savings: ${savings} (${savingsPercent}% reduction)`);
    
    console.log('\n=== KEY DIFFERENCES ===');
    console.log('1. Added STAT detection capability');
    console.log('2. Removed unnecessary clinical guidelines');
    console.log('3. Simplified instructions');
    console.log('4. Changed field name from "urgencyLevel" to "priority" to match database schema');
    console.log('5. Removed internal reasoning field');
    
  } catch (error) {
    console.error('Error comparing prompts:', error);
  }
}

// Run the comparison
comparePrompts()
  .then(() => {
    console.log('\nComparison completed successfully.');
  })
  .catch(error => {
    console.error('Error running comparison:', error);
  });