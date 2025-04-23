const { Pool } = require('pg');

// Database configuration from test-new-db-connection.js
const mainDbConfig = {
  user: 'postgres',
  password: 'SimplePassword123',
  host: 'radorderpad-main-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com',
  port: 5432,
  database: 'radorder_main',
  ssl: {
    rejectUnauthorized: false
  }
};

// Create connection pool
const mainDbPool = new Pool(mainDbConfig);

async function getOrganizationTableSchema() {
  try {
    console.log('Connecting to database to get organization table schema...');
    
    // Query to get table schema from PostgreSQL information_schema
    const schemaQuery = `
      SELECT 
        column_name, 
        data_type, 
        character_maximum_length, 
        column_default, 
        is_nullable
      FROM 
        information_schema.columns
      WHERE 
        table_name = 'organizations'
      ORDER BY 
        ordinal_position;
    `;
    
    const schemaResult = await mainDbPool.query(schemaQuery);
    console.log('\nORGANIZATION TABLE SCHEMA:');
    console.table(schemaResult.rows);
    
    // Query to get table constraints (primary keys, foreign keys, etc.)
    const constraintsQuery = `
      SELECT
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM
        information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        LEFT JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
      WHERE
        tc.table_name = 'organizations'
      ORDER BY
        tc.constraint_name;
    `;
    
    const constraintsResult = await mainDbPool.query(constraintsQuery);
    console.log('\nORGANIZATION TABLE CONSTRAINTS:');
    console.table(constraintsResult.rows);
    
    // Query to get indexes on the organization table
    const indexesQuery = `
      SELECT
        indexname,
        indexdef
      FROM
        pg_indexes
      WHERE
        tablename = 'organizations';
    `;
    
    const indexesResult = await mainDbPool.query(indexesQuery);
    console.log('\nORGANIZATION TABLE INDEXES:');
    console.table(indexesResult.rows);
    
  } catch (error) {
    console.error('Error getting organization table schema:', error);
  } finally {
    // Close the connection pool
    await mainDbPool.end();
  }
}

// Run the function
getOrganizationTableSchema().catch(console.error);