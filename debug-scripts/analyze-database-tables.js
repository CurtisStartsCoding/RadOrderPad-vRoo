/**
 * Script to thoroughly analyze database tables
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

async function analyzeDatabase() {
  let client;
  
  try {
    console.log('Connecting to database...');
    console.log(`Host: ${DB_HOST}, Port: ${DB_PORT}, Database: ${DB_NAME}`);
    
    client = await pool.connect();
    console.log('Database connection established successfully');
    
    // Get list of all tables
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    console.log('Querying database for tables...');
    const tablesResult = await client.query(tablesQuery);
    
    console.log(`\nFound ${tablesResult.rows.length} tables in the database:`);
    
    // Get database size
    const dbSizeQuery = `
      SELECT pg_size_pretty(pg_database_size($1)) as size;
    `;
    const dbSizeResult = await client.query(dbSizeQuery, [DB_NAME]);
    console.log(`Total database size: ${dbSizeResult.rows[0].size}`);
    
    // Focus on medical tables
    const medicalTables = [
      'medical_icd10_codes',
      'medical_cpt_codes',
      'medical_cpt_icd10_mappings',
      'medical_icd10_markdown_docs'
    ];
    
    console.log('\n=== DETAILED ANALYSIS OF MEDICAL TABLES ===');
    
    for (const tableName of medicalTables) {
      console.log(`\n--- ${tableName} ---`);
      
      // Get table size
      const tableSizeQuery = `
        SELECT pg_size_pretty(pg_total_relation_size($1)) as size;
      `;
      const tableSizeResult = await client.query(tableSizeQuery, [tableName]);
      console.log(`Table size: ${tableSizeResult.rows[0].size}`);
      
      // Get row count
      const countQuery = `SELECT COUNT(*) FROM ${tableName};`;
      const countResult = await client.query(countQuery);
      const rowCount = parseInt(countResult.rows[0].count);
      console.log(`Row count: ${rowCount.toLocaleString()}`);
      
      if (rowCount > 0) {
        // Get column names
        const columnsQuery = `
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_schema = 'public' AND table_name = $1
          ORDER BY ordinal_position;
        `;
        const columnsResult = await client.query(columnsQuery, [tableName]);
        const columns = columnsResult.rows.map(row => row.column_name);
        
        // Get sample data (first 5 rows)
        const sampleQuery = `SELECT * FROM ${tableName} LIMIT 5;`;
        const sampleResult = await client.query(sampleQuery);
        
        console.log('\nSample data (first 5 rows):');
        sampleResult.rows.forEach((row, index) => {
          console.log(`\nRow ${index + 1}:`);
          columns.forEach(column => {
            // Truncate long values
            let value = row[column];
            if (typeof value === 'string' && value.length > 100) {
              value = value.substring(0, 100) + '...';
            }
            console.log(`  ${column}: ${value}`);
          });
        });
        
        // Get distribution of data if it's a code table
        if (tableName === 'medical_icd10_codes') {
          // Distribution by chapter
          const chapterQuery = `
            SELECT chapter, COUNT(*) as count
            FROM ${tableName}
            GROUP BY chapter
            ORDER BY count DESC;
          `;
          try {
            const chapterResult = await client.query(chapterQuery);
            console.log('\nDistribution by chapter:');
            chapterResult.rows.forEach(row => {
              console.log(`  ${row.chapter || 'NULL'}: ${row.count}`);
            });
          } catch (error) {
            console.log('Could not get chapter distribution (column may not exist)');
          }
        } else if (tableName === 'medical_cpt_codes') {
          // Distribution by modality
          const modalityQuery = `
            SELECT modality, COUNT(*) as count
            FROM ${tableName}
            GROUP BY modality
            ORDER BY count DESC;
          `;
          try {
            const modalityResult = await client.query(modalityQuery);
            console.log('\nDistribution by modality:');
            modalityResult.rows.forEach(row => {
              console.log(`  ${row.modality || 'NULL'}: ${row.count}`);
            });
          } catch (error) {
            console.log('Could not get modality distribution (column may not exist)');
          }
        }
      } else {
        console.log('Table is empty');
      }
    }
    
    // Check for specific codes that we added
    const testCodes = ['M54.5', 'R10.31', 'R51', '72110', '74177', '70551'];
    console.log('\n=== CHECKING FOR SPECIFIC CODES ===');
    
    for (const code of testCodes) {
      let tableName;
      let codeColumn;
      
      if (code.match(/^[A-Z]/)) {
        tableName = 'medical_icd10_codes';
        codeColumn = 'icd10_code';
      } else {
        tableName = 'medical_cpt_codes';
        codeColumn = 'cpt_code';
      }
      
      const codeQuery = `
        SELECT * FROM ${tableName} WHERE ${codeColumn} = $1;
      `;
      const codeResult = await client.query(codeQuery, [code]);
      
      console.log(`\nCode ${code} in ${tableName}:`);
      if (codeResult.rows.length > 0) {
        console.log('  FOUND');
        console.log(`  Description: ${codeResult.rows[0].description}`);
      } else {
        console.log('  NOT FOUND');
      }
    }
    
    // Check for mappings
    console.log('\n=== CHECKING FOR SPECIFIC MAPPINGS ===');
    const mappingQuery = `
      SELECT * FROM medical_cpt_icd10_mappings 
      WHERE (icd10_code = 'M54.5' AND cpt_code = '72110')
         OR (icd10_code = 'R10.31' AND cpt_code = '74177')
         OR (icd10_code = 'R51' AND cpt_code = '70551');
    `;
    const mappingResult = await client.query(mappingQuery);
    
    console.log(`Found ${mappingResult.rows.length} specific mappings:`);
    mappingResult.rows.forEach(row => {
      console.log(`  ${row.icd10_code} -> ${row.cpt_code} (Appropriateness: ${row.appropriateness})`);
    });
    
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
analyzeDatabase().catch(err => {
  console.error('Unhandled error:', err);
  pool.end();
});