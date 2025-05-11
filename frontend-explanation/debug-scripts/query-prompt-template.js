/**
 * Query the prompt_templates table to get information about prompt ID 18
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.production
const envPath = path.resolve(process.cwd(), '.env.production');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
for (const key in envConfig) {
  process.env[key] = envConfig[key];
}

// Get connection strings from .env.production
const mainDbUrl = process.env.DEV_MAIN_DATABASE_URL;
const phiDbUrl = process.env.DEV_PHI_DATABASE_URL;

console.log('Using DEV connection strings from .env.production:');
console.log(`DEV Main DB URL: ${mainDbUrl}`);
console.log(`DEV PHI DB URL: ${phiDbUrl}`);

// Create connection pools using connection strings
const mainPool = new Pool({
  connectionString: mainDbUrl,
  ssl: { rejectUnauthorized: false }
});
const phiPool = new Pool({
  connectionString: phiDbUrl,
  ssl: { rejectUnauthorized: false }
});

/**
 * Query the prompt_templates table in the main database
 */
async function queryMainPromptTemplate(id) {
  try {
    console.log(`Querying prompt_templates in Main DB for ID ${id}...`);
    
    const query = `
      SELECT *
      FROM prompt_templates
      WHERE id = $1
    `;
    
    const result = await mainPool.query(query, [id]);
    
    if (result.rows.length === 0) {
      console.log(`No prompt template found with ID ${id} in Main DB`);
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error(`Error querying Main DB prompt_templates:`, error);
    return null;
  }
}

/**
 * Query the prompt_templates table in the PHI database
 */
async function queryPhiPromptTemplate(id) {
  try {
    console.log(`Querying prompt_templates in PHI DB for ID ${id}...`);
    
    const query = `
      SELECT *
      FROM prompt_templates
      WHERE id = $1
    `;
    
    const result = await phiPool.query(query, [id]);
    
    if (result.rows.length === 0) {
      console.log(`No prompt template found with ID ${id} in PHI DB`);
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error(`Error querying PHI DB prompt_templates:`, error);
    return null;
  }
}

/**
 * List all prompt templates in the main database
 */
async function listMainPromptTemplates() {
  try {
    console.log(`Listing all prompt_templates in Main DB...`);
    
    const query = `
      SELECT id, name, type, version, active, created_at, updated_at
      FROM prompt_templates
      ORDER BY id
    `;
    
    const result = await mainPool.query(query);
    
    if (result.rows.length === 0) {
      console.log(`No prompt templates found in Main DB`);
      return [];
    }
    
    return result.rows;
  } catch (error) {
    console.error(`Error listing Main DB prompt_templates:`, error);
    return [];
  }
}

/**
 * List all prompt templates in the PHI database
 */
async function listPhiPromptTemplates() {
  try {
    console.log(`Listing all prompt_templates in PHI DB...`);
    
    const query = `
      SELECT id, name, type, version, active, created_at, updated_at
      FROM prompt_templates
      ORDER BY id
    `;
    
    const result = await phiPool.query(query);
    
    if (result.rows.length === 0) {
      console.log(`No prompt templates found in PHI DB`);
      return [];
    }
    
    return result.rows;
  } catch (error) {
    console.error(`Error listing PHI DB prompt_templates:`, error);
    return [];
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('=== QUERYING PROMPT TEMPLATES ===');
    
    // Query prompt ID 18 in both databases
    const promptId = 18;
    const mainPrompt = await queryMainPromptTemplate(promptId);
    const phiPrompt = await queryPhiPromptTemplate(promptId);
    
    console.log('\n=== PROMPT TEMPLATE ID 18 ===');
    
    if (mainPrompt) {
      console.log('\nFound in Main DB:');
      console.log(`ID: ${mainPrompt.id}`);
      console.log(`Name: ${mainPrompt.name}`);
      console.log(`Type: ${mainPrompt.type}`);
      console.log(`Version: ${mainPrompt.version}`);
      console.log(`Active: ${mainPrompt.active}`);
      console.log(`Created At: ${mainPrompt.created_at}`);
      console.log(`Updated At: ${mainPrompt.updated_at}`);
      console.log('\nFull Content Template:');
      console.log(mainPrompt.content_template);
    } else {
      console.log('Not found in Main DB');
    }
    
    if (phiPrompt) {
      console.log('\nFound in PHI DB:');
      console.log(`ID: ${phiPrompt.id}`);
      console.log(`Name: ${phiPrompt.name}`);
      console.log(`Type: ${phiPrompt.type}`);
      console.log(`Version: ${phiPrompt.version}`);
      console.log(`Active: ${phiPrompt.active}`);
      console.log(`Created At: ${phiPrompt.created_at}`);
      console.log(`Updated At: ${phiPrompt.updated_at}`);
      console.log('\nFull Content Template:');
      console.log(phiPrompt.content_template);
    } else {
      console.log('Not found in PHI DB');
    }
    
    // List all prompt templates in both databases
    console.log('\n=== ALL PROMPT TEMPLATES ===');
    
    const mainPrompts = await listMainPromptTemplates();
    if (mainPrompts.length > 0) {
      console.log('\nMain DB Prompt Templates:');
      console.table(mainPrompts);
    }
    
    const phiPrompts = await listPhiPromptTemplates();
    if (phiPrompts.length > 0) {
      console.log('\nPHI DB Prompt Templates:');
      console.table(phiPrompts);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close connections
    await mainPool.end();
    await phiPool.end();
    console.log('\n=== QUERY COMPLETE ===');
  }
}

// Run the main function
main().catch(console.error);