const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.production
const envPath = path.resolve(process.cwd(), '.env.production');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
for (const key in envConfig) {
  process.env[key] = envConfig[key];
}

// Configuration for PHI database (Production)
const phiDbConfig = {
  host: process.env.PROD_PHI_DB_HOST,
  port: process.env.PROD_PHI_DB_PORT,
  database: process.env.PROD_PHI_DB_NAME,
  user: process.env.PROD_DB_USER,
  password: process.env.PROD_DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
};

// Create connection pool
const phiPool = new Pool(phiDbConfig);

// Function to update order organization IDs
async function updateOrderOrganizations(orderId, radiologyOrgId) {
  try {
    console.log(`Updating order #${orderId} to use radiology organization #${radiologyOrgId}...`);
    
    // First, get current order details
    const getQuery = `
      SELECT 
        id,
        order_number,
        referring_organization_id,
        radiology_organization_id,
        status
      FROM 
        orders
      WHERE 
        id = $1;
    `;
    
    const getResult = await phiPool.query(getQuery, [orderId]);
    
    if (getResult.rows.length === 0) {
      console.log(`❌ Order #${orderId} not found`);
      return false;
    }
    
    const order = getResult.rows[0];
    console.log('Current order details:', order);
    
    // Update the order
    const updateQuery = `
      UPDATE orders
      SET radiology_organization_id = $1
      WHERE id = $2
      RETURNING id, order_number, referring_organization_id, radiology_organization_id, status;
    `;
    
    const updateResult = await phiPool.query(updateQuery, [radiologyOrgId, orderId]);
    
    if (updateResult.rows.length === 0) {
      console.log(`❌ Failed to update order #${orderId}`);
      return false;
    }
    
    const updatedOrder = updateResult.rows[0];
    console.log('✅ Order updated successfully');
    console.log('Updated order details:', updatedOrder);
    
    return true;
  } catch (error) {
    console.error(`Error updating order #${orderId}:`, error);
    return false;
  }
}

// Main function to update orders
async function updateOrders() {
  console.log('=== UPDATING ORDER ORGANIZATIONS ===');
  console.log('Updating orders to use different radiology organizations...\n');

  try {
    // Update order #606
    console.log('--- Updating Order #606 ---');
    await updateOrderOrganizations(606, 2);
    console.log('\n');
    
    // Update order #607
    console.log('--- Updating Order #607 ---');
    await updateOrderOrganizations(607, 2);
    console.log('\n');
    
  } catch (error) {
    console.error('Error updating orders:', error);
  } finally {
    // Close connection
    await phiPool.end();
    console.log('=== UPDATE COMPLETE ===');
  }
}

// Run the update
updateOrders().catch(console.error);