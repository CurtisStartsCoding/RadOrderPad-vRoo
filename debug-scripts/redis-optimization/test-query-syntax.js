const Redis = require('ioredis');

// Redis Cloud connection details from .env.production
const redisHost = 'redis-11584.crce197.us-east-2-1.ec2.redns.redis-cloud.com';
const redisPort = 11584;
const redisPassword = 'zHUbspGPcewJsoT9G9TSQncuSl0v0MUH';

const client = new Redis({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  tls: {}
});

async function testQueries() {
  try {
    const searchTerm = 'mri';
    const indexName = 'idx:cpt'; // Change as needed
    
    // Test different query syntaxes
    const queries = [
      // Current syntax
      `@description:(${searchTerm}) WEIGHT 5.0 | @body_part:(${searchTerm}) WEIGHT 3.0`,
      
      // Arrow function syntax
      `@description:((${searchTerm}) => { $weight: 5.0 }) @body_part:((${searchTerm}) => { $weight: 3.0 })`,
      
      // Simple field query (baseline)
      `@description:(${searchTerm})`,
      
      // Alternative pipe syntax
      `(@description:(${searchTerm})) | (@body_part:(${searchTerm}))`,

      // Simplified weight syntax
      `@description:(${searchTerm})=>{$weight:5.0} | @body_part:(${searchTerm})=>{$weight:3.0}`,

      // Standard RediSearch syntax without field aliases
      `(${searchTerm})=>{$weight:5.0}`
    ];
    
    // Test each query
    for (const [i, query] of queries.entries()) {
      console.log(`\n=== QUERY ${i+1}: ${query} ===`);
      
      try {
        // Try to explain the query
        console.log('Attempting to explain query...');
        const explanation = await client.call('FT.EXPLAINCLI', indexName, query);
        console.log('Explanation:', explanation);
        
        // Try to execute the query
        console.log('Attempting to execute query...');
        const result = await client.call(
          'FT.SEARCH',
          indexName,
          query,
          'WITHSCORES',
          'LIMIT', '0', '5'
        );
        
        console.log(`Results: ${result[0]}`);
        if (result[0] > 0) {
          console.log('First result:', result[1], 'Score:', result[2]);
        }
      } catch (error) {
        console.error('Query error:', error.message);
      }
    }
  } catch (error) {
    console.error('Error testing queries:', error);
  } finally {
    client.quit();
  }
}

testQueries();