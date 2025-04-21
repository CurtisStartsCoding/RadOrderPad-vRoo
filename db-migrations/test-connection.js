/**
 * Database Connection Test Script
 * 
 * This script tests connectivity to PostgreSQL databases before migration.
 * It verifies that the connection strings are valid and the user has proper access.
 * 
 * Usage:
 * node test-connection.js --db=<database-connection-url>
 */

const { Client } = require('pg');
const { program } = require('commander');

// Parse command line arguments
program
  .option('--db <url>', 'Database connection URL to test')
  .parse(process.argv);

const options = program.opts();

if (!options.db) {
  console.error('Error: Missing database connection URL. Use --db parameter.');
  console.error('Example: node test-connection.js --db="postgresql://user:password@host:port/dbname"');
  process.exit(1);
}

async function testConnection() {
  console.log('Testing database connection...');
  console.log(`Connection URL: ${options.db.replace(/\/\/([^:]+):[^@]+@/, '//***:***@')}`); // Hide password in logs
  
  const client = new Client(options.db);
  
  try {
    // Connect to the database
    await client.connect();
    console.log('✅ Connection successful!');
    
    // Test query execution
    console.log('Testing query execution...');
    const result = await client.query('SELECT current_database() as db_name, current_user as username, version() as version');
    
    console.log('\nDatabase information:');
    console.log(`Database name: ${result.rows[0].db_name}`);
    console.log(`Connected as: ${result.rows[0].username}`);
    console.log(`PostgreSQL version: ${result.rows[0].version.split(' on ')[0]}`);
    
    // Test permissions
    console.log('\nChecking permissions...');
    
    // Check table creation permission
    try {
      await client.query('BEGIN');
      await client.query('CREATE TABLE _test_permissions (id SERIAL PRIMARY KEY, test_col TEXT)');
      await client.query('DROP TABLE _test_permissions');
      await client.query('COMMIT');
      console.log('✅ CREATE/DROP TABLE permission: Yes');
    } catch (error) {
      await client.query('ROLLBACK');
      console.log('❌ CREATE/DROP TABLE permission: No');
      console.log(`   Error: ${error.message}`);
    }
    
    // Check if user can list tables
    try {
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        LIMIT 5
      `);
      
      if (tablesResult.rows.length > 0) {
        console.log(`✅ LIST TABLES permission: Yes (found ${tablesResult.rowCount} tables)`);
        console.log('   Sample tables:');
        tablesResult.rows.forEach(row => {
          console.log(`   - ${row.table_name}`);
        });
      } else {
        console.log('✅ LIST TABLES permission: Yes (no tables found)');
      }
    } catch (error) {
      console.log('❌ LIST TABLES permission: No');
      console.log(`   Error: ${error.message}`);
    }
    
    console.log('\nConnection test completed successfully.');
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  } finally {
    await client.end();
  }
}

testConnection().catch(error => {
  console.error(`Unhandled error: ${error.message}`);
  process.exit(1);
});