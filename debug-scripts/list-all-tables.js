// Script to list all tables in the database
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env.production' });

// Get the database URL from environment variables
const mainDbUrl = process.env.MAIN_DATABASE_URL;
const phiDbUrl = process.env.PHI_DATABASE_URL;

// Create modified connection strings with SSL verification disabled
const noVerifyMainDbUrl = mainDbUrl ? mainDbUrl.replace('?sslmode=require', '?sslmode=no-verify') : null;
const noVerifyPhiDbUrl = phiDbUrl ? phiDbUrl.replace('?sslmode=require', '?sslmode=no-verify') : null;

console.log('=== Database Tables List Tool ===');
console.log('This tool will list all tables in both the main and PHI databases.');

// Function to list all tables in a database
async function listAllTables(connectionString, dbName) {
  if (!connectionString) {
    console.log(`\n❌ No connection string provided for ${dbName} database.`);
    return;
  }

  console.log(`\n=== Tables in ${dbName} Database ===`);
  
  // Create connection pool with SSL verification disabled
  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false // Disable SSL certificate verification
    }
  });
  
  try {
    // Query to get all tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log(`❌ No tables found in the ${dbName} database.`);
      return;
    }
    
    console.log(`✅ Found ${tablesResult.rows.length} tables:`);
    tablesResult.rows.forEach((row, index) => {
      console.log(`  ${index + 1}. ${row.table_name}`);
    });
    
    // For each table, get the column information
    for (const row of tablesResult.rows) {
      const tableName = row.table_name;
      console.log(`\n--- Columns in ${tableName} ---`);
      
      const columnsResult = await pool.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = $1 
        ORDER BY ordinal_position;
      `, [tableName]);
      
      if (columnsResult.rows.length === 0) {
        console.log(`  No columns found for table ${tableName}`);
        continue;
      }
      
      columnsResult.rows.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        console.log(`  - ${col.column_name} (${col.data_type}, ${nullable})`);
      });
      
      // Get row count for the table
      try {
        const countResult = await pool.query(`SELECT COUNT(*) FROM "${tableName}"`);
        console.log(`  Total rows: ${countResult.rows[0].count}`);
      } catch (countErr) {
        console.log(`  Error getting row count: ${countErr.message}`);
      }
    }
  } catch (err) {
    console.error(`❌ Error querying the ${dbName} database:`, err.message);
    if (err.code) {
      console.error('Error code:', err.code);
    }
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Function to check for pending migrations
async function checkPendingMigrations(connectionString, dbName) {
  if (!connectionString) {
    console.log(`\n❌ No connection string provided for ${dbName} database.`);
    return;
  }

  console.log(`\n=== Checking Migrations in ${dbName} Database ===`);
  
  // Create connection pool with SSL verification disabled
  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false // Disable SSL certificate verification
    }
  });
  
  try {
    // Check if migrations table exists
    const migrationsTableResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'migrations'
      );
    `);
    
    if (!migrationsTableResult.rows[0].exists) {
      console.log(`❌ Migrations table does not exist in the ${dbName} database.`);
      return;
    }
    
    // Get all migrations
    const migrationsResult = await pool.query(`
      SELECT * FROM migrations ORDER BY id;
    `);
    
    if (migrationsResult.rows.length === 0) {
      console.log(`❌ No migrations found in the ${dbName} database.`);
      return;
    }
    
    console.log(`✅ Found ${migrationsResult.rows.length} migrations:`);
    migrationsResult.rows.forEach((row, index) => {
      const timestamp = new Date(row.timestamp).toISOString();
      console.log(`  ${index + 1}. ${row.name} (${timestamp})`);
    });
    
    // Check for pending migrations
    const pendingMigrationsResult = await pool.query(`
      SELECT * FROM migrations WHERE is_applied = false ORDER BY id;
    `);
    
    if (pendingMigrationsResult.rows.length === 0) {
      console.log(`✅ No pending migrations in the ${dbName} database.`);
    } else {
      console.log(`❌ Found ${pendingMigrationsResult.rows.length} pending migrations:`);
      pendingMigrationsResult.rows.forEach((row, index) => {
        const timestamp = new Date(row.timestamp).toISOString();
        console.log(`  ${index + 1}. ${row.name} (${timestamp})`);
      });
    }
  } catch (err) {
    console.error(`❌ Error checking migrations in the ${dbName} database:`, err.message);
    if (err.code) {
      console.error('Error code:', err.code);
    }
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Run the functions
async function run() {
  try {
    // List tables in the main database
    await listAllTables(noVerifyMainDbUrl, 'Main');
    
    // List tables in the PHI database
    await listAllTables(noVerifyPhiDbUrl, 'PHI');
    
    // Check for pending migrations in the main database
    await checkPendingMigrations(noVerifyMainDbUrl, 'Main');
    
    // Check for pending migrations in the PHI database
    await checkPendingMigrations(noVerifyPhiDbUrl, 'PHI');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run the script
run();