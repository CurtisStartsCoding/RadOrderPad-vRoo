/**
 * Script to list all tables in the database with detailed information
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

async function listAllTables() {
  let client;
  
  try {
    console.log('Connecting to database...');
    console.log(`Host: ${DB_HOST}, Port: ${DB_PORT}, Database: ${DB_NAME}, User: ${DB_USER}`);
    
    client = await pool.connect();
    console.log('Database connection established successfully');
    
    // Get database size
    const dbSizeQuery = `
      SELECT pg_size_pretty(pg_database_size($1)) as size;
    `;
    const dbSizeResult = await client.query(dbSizeQuery, [DB_NAME]);
    console.log(`\nTotal database size: ${dbSizeResult.rows[0].size}`);
    
    // List all schemas
    console.log('\n=== DATABASE SCHEMAS ===');
    const schemasQuery = `
      SELECT schema_name 
      FROM information_schema.schemata 
      ORDER BY schema_name;
    `;
    const schemasResult = await client.query(schemasQuery);
    schemasResult.rows.forEach(row => {
      console.log(`Schema: ${row.schema_name}`);
    });
    
    // List all tables
    console.log('\n=== ALL TABLES IN DATABASE ===');
    const tablesQuery = `
      SELECT 
        table_schema,
        table_name,
        (SELECT count(*) FROM information_schema.columns WHERE table_schema = t.table_schema AND table_name = t.table_name) as column_count
      FROM 
        information_schema.tables t
      WHERE 
        table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY 
        table_schema, table_name;
    `;
    
    const tablesResult = await client.query(tablesQuery);
    
    if (tablesResult.rows.length === 0) {
      console.log('No tables found in the database.');
    } else {
      console.log(`Found ${tablesResult.rows.length} tables:`);
      
      // Group tables by schema
      const tablesBySchema = {};
      tablesResult.rows.forEach(row => {
        if (!tablesBySchema[row.table_schema]) {
          tablesBySchema[row.table_schema] = [];
        }
        tablesBySchema[row.table_schema].push(row);
      });
      
      // Print tables by schema
      for (const schema in tablesBySchema) {
        console.log(`\nSchema: ${schema}`);
        for (const table of tablesBySchema[schema]) {
          console.log(`  Table: ${table.table_name} (${table.column_count} columns)`);
          
          // Get row count for each table
          try {
            const countQuery = `SELECT COUNT(*) FROM "${schema}"."${table.table_name}";`;
            const countResult = await client.query(countQuery);
            console.log(`    Rows: ${countResult.rows[0].count.toLocaleString()}`);
            
            // If it's a medical table, show sample data
            if (table.table_name.startsWith('medical_')) {
              const sampleQuery = `SELECT * FROM "${schema}"."${table.table_name}" LIMIT 1;`;
              const sampleResult = await client.query(sampleQuery);
              
              if (sampleResult.rows.length > 0) {
                console.log('    Sample data:');
                const sample = sampleResult.rows[0];
                Object.keys(sample).forEach(key => {
                  let value = sample[key];
                  if (typeof value === 'string' && value.length > 50) {
                    value = value.substring(0, 50) + '...';
                  }
                  console.log(`      ${key}: ${value}`);
                });
              }
            }
          } catch (error) {
            console.log(`    Error getting row count: ${error.message}`);
          }
        }
      }
    }
    
    // Check for specific tables
    console.log('\n=== CHECKING FOR MEDICAL TABLES ===');
    const medicalTables = [
      'medical_icd10_codes',
      'medical_cpt_codes',
      'medical_cpt_icd10_mappings',
      'medical_icd10_markdown_docs'
    ];
    
    for (const tableName of medicalTables) {
      const checkQuery = `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        );
      `;
      const checkResult = await client.query(checkQuery, [tableName]);
      
      if (checkResult.rows[0].exists) {
        console.log(`Table ${tableName}: EXISTS`);
        
        // Get row count
        const countQuery = `SELECT COUNT(*) FROM ${tableName};`;
        const countResult = await client.query(countQuery);
        console.log(`  Row count: ${countResult.rows[0].count}`);
        
        // Get table size
        const sizeQuery = `
          SELECT pg_size_pretty(pg_total_relation_size($1)) as size;
        `;
        const sizeResult = await client.query(sizeQuery, [tableName]);
        console.log(`  Table size: ${sizeResult.rows[0].size}`);
        
        // Get column names
        const columnsQuery = `
          SELECT column_name, data_type
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = $1
          ORDER BY ordinal_position;
        `;
        const columnsResult = await client.query(columnsQuery, [tableName]);
        console.log(`  Columns: ${columnsResult.rows.length}`);
        columnsResult.rows.forEach(col => {
          console.log(`    ${col.column_name} (${col.data_type})`);
        });
      } else {
        console.log(`Table ${tableName}: DOES NOT EXIST`);
      }
    }
    
    // List all databases on the server
    console.log('\n=== ALL DATABASES ON SERVER ===');
    const databasesQuery = `
      SELECT datname, pg_size_pretty(pg_database_size(datname)) as size
      FROM pg_database
      WHERE datistemplate = false
      ORDER BY pg_database_size(datname) DESC;
    `;
    const databasesResult = await client.query(databasesQuery);
    databasesResult.rows.forEach(db => {
      console.log(`Database: ${db.datname} (${db.size})`);
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
listAllTables().catch(err => {
  console.error('Unhandled error:', err);
  pool.end();
});