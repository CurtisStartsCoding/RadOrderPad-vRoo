const { Client } = require('pg');

async function testDatabaseConnection(name, connectionString) {
  const client = new Client({
    connectionString: connectionString
  });

  try {
    console.log(`\n========== Testing ${name} Database ==========`);
    console.log(`Connecting to: ${connectionString.replace(/:[^:@]+@/, ':****@')}`);
    
    await client.connect();
    console.log(`✅ Successfully connected to ${name} database`);

    // Get list of tables
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
      LIMIT 10
    `;
    
    const result = await client.query(tablesQuery);
    console.log(`\nTables in ${name} database (first 10):`);
    result.rows.forEach((row, index) => {
      console.log(`  ${index + 1}. ${row.table_name}`);
    });

    // Get total table count
    const countQuery = `
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    const countResult = await client.query(countQuery);
    console.log(`\nTotal tables in public schema: ${countResult.rows[0].count}`);

  } catch (error) {
    console.error(`❌ Failed to connect to ${name} database:`);
    console.error(`   Error: ${error.message}`);
  } finally {
    await client.end();
  }
}

async function main() {
  console.log('Testing PostgreSQL database connections through SSH tunnels...');
  
  // Test Main Database
  await testDatabaseConnection(
    'Main (radorder_main)',
    'postgresql://postgres:password@localhost:15432/radorder_main?sslmode=require'
  );

  // Test PHI Database
  await testDatabaseConnection(
    'PHI (radorder_phi)', 
    'postgresql://postgres:password2@localhost:15433/radorder_phi?sslmode=require'
  );

  console.log('\n========== Connection Test Complete ==========');
}

main().catch(console.error);