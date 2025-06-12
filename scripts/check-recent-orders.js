const pg = require('pg');

async function checkRecentOrderStatuses() {
  const client = new pg.Client({
    connectionString: 'postgresql://postgres:password2@localhost:15433/radorder_phi',
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    
    // Get orders from last 5 days with status distribution
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    
    console.log('Orders from last 5 days (since ' + fiveDaysAgo.toLocaleDateString() + '):\n');
    
    const recentStatuses = await client.query(
      'SELECT status, COUNT(*) as count, DATE(created_at) as order_date ' +
      'FROM orders ' +
      'WHERE created_at >= $1 ' +
      'GROUP BY status, DATE(created_at) ' +
      'ORDER BY order_date DESC, status',
      [fiveDaysAgo]
    );
    
    // Group by date
    const dateGroups = {};
    recentStatuses.rows.forEach(row => {
      const date = new Date(row.order_date).toLocaleDateString();
      if (!dateGroups[date]) {
        dateGroups[date] = {};
      }
      dateGroups[date][row.status] = parseInt(row.count);
    });
    
    // Display by date
    Object.entries(dateGroups).forEach(([date, statuses]) => {
      const total = Object.values(statuses).reduce((sum, count) => sum + count, 0);
      console.log(`${date}: (${total} orders)`);
      Object.entries(statuses).forEach(([status, count]) => {
        console.log(`  ${status}: ${count}`);
      });
      console.log('');
    });
    
    // Get all possible status values
    console.log('\nAll possible order statuses in the system:');
    const allStatuses = await client.query(
      'SELECT DISTINCT status, COUNT(*) as total_count ' +
      'FROM orders ' +
      'GROUP BY status ' +
      'ORDER BY total_count DESC'
    );
    
    allStatuses.rows.forEach(row => {
      console.log(`  ${row.status}: ${row.total_count} total orders`);
    });
    
    // Get orders by status for last 5 days
    console.log('\n\nDetailed breakdown for last 5 days:');
    const detailedRecent = await client.query(
      'SELECT status, COUNT(*) as count ' +
      'FROM orders ' +
      'WHERE created_at >= $1 ' +
      'GROUP BY status ' +
      'ORDER BY count DESC',
      [fiveDaysAgo]
    );
    
    let totalRecent = 0;
    detailedRecent.rows.forEach(row => {
      totalRecent += parseInt(row.count);
      console.log(`  ${row.status}: ${row.count} orders`);
    });
    console.log(`  TOTAL: ${totalRecent} orders in last 5 days`);
    
    await client.end();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkRecentOrderStatuses();