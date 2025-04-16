/**
 * Simple script to list all tables in the database
 */
require('dotenv').config();
const { Pool } = require('pg');

// Database connection
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

async function listTables() {
  let client;
  
  try {
    console.log('Connecting to database...');
    console.log(`Host: ${DB_HOST}, Port: ${DB_PORT}, Database: ${DB_NAME}`);
    
    client = await pool.connect();
    console.log('Database connection established successfully');
    
    // Query to list all tables
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    console.log('Querying database for tables...');
    const tablesResult = await client.query(tablesQuery);
    
    console.log(`\nFound ${tablesResult.rows.length} tables in the database:`);
    tablesResult.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.table_name}`);
    });
    
    // Look for tables related to ICD-10 and CPT codes
    console.log('\nSearching for tables related to ICD-10 and CPT codes:');
    const medicalTablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND (
        table_name LIKE '%icd%' OR 
        table_name LIKE '%cpt%' OR 
        table_name LIKE '%medical%' OR 
        table_name LIKE '%code%'
      )
      ORDER BY table_name;
    `;
    
    const medicalTablesResult = await client.query(medicalTablesQuery);
    
    if (medicalTablesResult.rows.length > 0) {
      console.log(`\nFound ${medicalTablesResult.rows.length} tables related to medical codes:`);
      medicalTablesResult.rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.table_name}`);
      });
      
      // For each medical table, show its structure
      for (const row of medicalTablesResult.rows) {
        const tableName = row.table_name;
        console.log(`\nStructure of table '${tableName}':`);
        
        const columnsQuery = `
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = $1
          ORDER BY ordinal_position;
        `;
        
        const columnsResult = await client.query(columnsQuery, [tableName]);
        
        columnsResult.rows.forEach(col => {
          console.log(`  - ${col.column_name} (${col.data_type})`);
        });
        
        // Count rows in the table
        const countQuery = `SELECT COUNT(*) FROM ${tableName};`;
        const countResult = await client.query(countQuery);
        console.log(`  Total rows: ${countResult.rows[0].count}`);
      }
    } else {
      console.log('No tables related to medical codes found.');
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
listTables().catch(err => {
  console.error('Unhandled error:', err);
  pool.end();
});