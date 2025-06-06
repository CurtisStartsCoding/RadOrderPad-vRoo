const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    connectionString: 'postgresql://postgres:password2@radorderpad-phi-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_phi?sslmode=disable',
    connectionTimeoutMillis: 5000
  });

  try {
    console.log('Attempting to connect to PHI database...');
    console.log('Host: radorderpad-phi-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com');
    console.log('Port: 5432');
    console.log('Database: radorder_phi');
    console.log('SSL Mode: disabled');
    
    await client.connect();
    console.log('✓ Connected successfully!');
    
    const result = await client.query('SELECT NOW()');
    console.log('Current time from database:', result.rows[0].now);
    
    await client.end();
  } catch (error) {
    console.error('✗ Connection failed:', error.message);
    if (error.code === 'ETIMEDOUT') {
      console.error('\nThe connection timed out. This usually means:');
      console.error('1. The database is not publicly accessible');
      console.error('2. The security group is blocking your IP address');
      console.error('3. There is a network firewall blocking the connection');
      console.error('\nPlease ensure the RDS instance security group allows inbound connections on port 5432 from your IP address.');
    }
  }
}

testConnection();