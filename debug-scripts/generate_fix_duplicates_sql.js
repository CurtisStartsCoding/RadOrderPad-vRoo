/**
 * Script to generate SQL statements to fix duplicate mappings
 * This script analyzes duplicate mappings and generates SQL to remove duplicates
 * but does NOT execute the SQL directly - it saves it to a file for review
 */
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5433';
const DB_NAME = process.env.DB_NAME || 'radorder_main';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres123';

// Output SQL file
const outputSqlFile = path.resolve(__dirname, '..', 'Data', 'fix_duplicate_mappings.sql');

// Create a connection pool
const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD
});

async function generateFixDuplicatesSql() {
  let client;
  let sqlStatements = '';
  
  try {
    console.log('Connecting to database...');
    client = await pool.connect();
    console.log('Database connection established successfully');
    
    // Find all duplicate mappings
    console.log('\n=== IDENTIFYING DUPLICATE MAPPINGS ===');
    
    const duplicateQuery = `
      SELECT m1.id as id1, m2.id as id2, 
             m1.icd10_code, m1.cpt_code, 
             i.description as icd10_description,
             c.description as cpt_description,
             m1.appropriateness as appropriateness1,
             m2.appropriateness as appropriateness2
      FROM medical_cpt_icd10_mappings m1
      JOIN medical_cpt_icd10_mappings m2 ON m1.icd10_code = m2.icd10_code 
                                        AND m1.cpt_code = m2.cpt_code
                                        AND m1.id < m2.id
      JOIN medical_icd10_codes i ON m1.icd10_code = i.icd10_code
      JOIN medical_cpt_codes c ON m1.cpt_code = c.cpt_code
      ORDER BY m1.icd10_code, m1.cpt_code;
    `;
    
    const duplicateResult = await client.query(duplicateQuery);
    const duplicateCount = duplicateResult.rows.length;
    console.log(`Found ${duplicateCount} duplicate mappings`);
    
    if (duplicateCount > 0) {
      // Generate SQL to fix duplicates
      sqlStatements += '-- SQL to fix duplicate mappings in medical_cpt_icd10_mappings table\n';
      sqlStatements += '-- Generated on ' + new Date().toISOString() + '\n';
      sqlStatements += '-- This script will remove duplicate mappings, keeping the one with the higher appropriateness score\n\n';
      sqlStatements += 'BEGIN;\n\n';
      
      // For each duplicate, delete the one with the lower appropriateness score or higher ID if scores are equal
      for (const row of duplicateResult.rows) {
        const idToDelete = row.appropriateness1 >= row.appropriateness2 ? row.id2 : row.id1;
        const idToKeep = row.appropriateness1 >= row.appropriateness2 ? row.id1 : row.id2;
        
        sqlStatements += `-- Delete duplicate mapping for ICD-10: ${row.icd10_code} (${row.icd10_description}), CPT: ${row.cpt_code} (${row.cpt_description})\n`;
        sqlStatements += `-- Keeping ID ${idToKeep} (appropriateness ${row.appropriateness1 >= row.appropriateness2 ? row.appropriateness1 : row.appropriateness2})\n`;
        sqlStatements += `-- Removing ID ${idToDelete} (appropriateness ${row.appropriateness1 >= row.appropriateness2 ? row.appropriateness2 : row.appropriateness1})\n`;
        sqlStatements += `DELETE FROM medical_cpt_icd10_mappings WHERE id = ${idToDelete};\n\n`;
      }
      
      sqlStatements += 'COMMIT;\n';
      
      // Write the SQL to a file
      fs.writeFileSync(outputSqlFile, sqlStatements);
      console.log(`\nSQL statements to fix duplicates written to ${outputSqlFile}`);
      console.log('Review this file carefully before executing the SQL!');
    } else {
      console.log('No duplicate mappings found, no SQL file generated');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (client) {
      client.release();
      console.log('\nDatabase connection released');
    }
    
    // Close the pool
    await pool.end();
    console.log('Connection pool closed');
  }
}

// Run the function
generateFixDuplicatesSql().catch(err => {
  console.error('Unhandled error:', err);
  pool.end();
});