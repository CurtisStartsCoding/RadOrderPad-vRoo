/**
 * Script to restore specialty word counts from the documentation
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

// Parse the specialty word count list from the markdown file
function parseSpecialtyWordCounts() {
  const filePath = path.join(__dirname, '..', 'Docs', 'specialty_word_count_list.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Extract the table content
  const tableMatch = fileContent.match(/```\n([\s\S]*?)```/);
  if (!tableMatch) {
    throw new Error('Could not find table in markdown file');
  }
  
  const tableContent = tableMatch[1];
  const lines = tableContent.trim().split('\n');
  
  // Skip the header and separator lines
  const dataLines = lines.slice(2);
  
  // Parse each line into specialty and word count
  const specialtyWordCounts = {};
  dataLines.forEach(line => {
    const [specialty, wordCount] = line.split('|').map(s => s.trim());
    specialtyWordCounts[specialty] = parseInt(wordCount, 10);
  });
  
  return specialtyWordCounts;
}

async function run() {
  let client;
  
  try {
    console.log('Connecting to database...');
    client = await pool.connect();
    console.log('Connected to database');
    
    // Step 1: Parse the specialty word counts from the markdown file
    console.log('\nStep 1: Parsing specialty word counts from markdown file...');
    const specialtyWordCounts = parseSpecialtyWordCounts();
    console.log(`Parsed ${Object.keys(specialtyWordCounts).length} specialty word counts`);
    
    // Step 2: Get current specialty configurations
    console.log('\nStep 2: Getting current specialty configurations...');
    const result = await client.query(`
      SELECT specialty_name, optimal_word_count
      FROM specialty_configurations
      ORDER BY specialty_name;
    `);
    
    if (result.rows.length === 0) {
      console.error('No specialty configurations found!');
      return;
    }
    
    console.log('Current specialty configurations:');
    result.rows.forEach(row => {
      console.log(`${row.specialty_name}: ${row.optimal_word_count} words`);
    });
    
    // Step 3: Update specialty word counts
    console.log('\nStep 3: Updating specialty word counts...');
    
    // Start a transaction
    await client.query('BEGIN');
    
    let updatedCount = 0;
    for (const [specialty, wordCount] of Object.entries(specialtyWordCounts)) {
      const updateResult = await client.query(`
        UPDATE specialty_configurations
        SET optimal_word_count = $1,
            updated_at = NOW()
        WHERE specialty_name = $2;
      `, [wordCount, specialty]);
      
      if (updateResult.rowCount > 0) {
        updatedCount++;
        console.log(`Updated ${specialty} to ${wordCount} words`);
      }
    }
    
    // Commit the transaction
    await client.query('COMMIT');
    
    console.log(`Updated ${updatedCount} specialty word counts`);
    
    // Step 4: Verify the update
    console.log('\nStep 4: Verifying the update...');
    const verifyResult = await client.query(`
      SELECT specialty_name, optimal_word_count
      FROM specialty_configurations
      ORDER BY specialty_name;
    `);
    
    console.log('Updated specialty configurations:');
    verifyResult.rows.forEach(row => {
      const expectedWordCount = specialtyWordCounts[row.specialty_name];
      const status = expectedWordCount === row.optimal_word_count ? '✓' : '✗';
      console.log(`${status} ${row.specialty_name}: ${row.optimal_word_count} words (Expected: ${expectedWordCount || 'N/A'})`);
    });
    
    console.log('\nUpdate completed successfully.');
    
  } catch (error) {
    console.error('Error:', error.message);
    
    // Rollback the transaction if there was an error
    if (client) {
      await client.query('ROLLBACK');
    }
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