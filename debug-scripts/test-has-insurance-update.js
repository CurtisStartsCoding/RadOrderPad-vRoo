const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// PHI Database connection
const phiDbPool = new Pool({
  host: process.env.PG_PHI_HOST,
  port: process.env.PG_PHI_PORT,
  database: process.env.PG_PHI_DATABASE,
  user: process.env.PG_PHI_USER,
  password: process.env.PG_PHI_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function addHasInsuranceColumn() {
  const client = await phiDbPool.connect();
  
  try {
    console.log('🔧 Adding has_insurance column to orders table...');
    
    // Check if column already exists
    const columnCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'orders' 
      AND column_name = 'has_insurance'
    `);
    
    if (columnCheck.rows.length > 0) {
      console.log('✅ Column has_insurance already exists');
      return;
    }
    
    // Add the column
    await client.query(`
      ALTER TABLE orders 
      ADD COLUMN has_insurance boolean NOT NULL DEFAULT false
    `);
    
    // Add comment
    await client.query(`
      COMMENT ON COLUMN orders.has_insurance IS 
      'Indicates whether patient has insurance for this order. False = uninsured/cash-pay, True = has insurance'
    `);
    
    // Update existing orders that have insurance
    const updateResult = await client.query(`
      UPDATE orders o
      SET has_insurance = true
      WHERE EXISTS (
        SELECT 1 
        FROM patient_insurance pi 
        WHERE pi.patient_id = o.patient_id
        AND pi.insurer_name IS NOT NULL
        AND pi.policy_number IS NOT NULL
      )
    `);
    
    console.log(`✅ Column added successfully`);
    console.log(`📊 Updated ${updateResult.rowCount} orders to has_insurance = true`);
    
    // Show some stats
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN has_insurance = true THEN 1 ELSE 0 END) as with_insurance,
        SUM(CASE WHEN has_insurance = false THEN 1 ELSE 0 END) as without_insurance
      FROM orders
    `);
    
    const { total_orders, with_insurance, without_insurance } = stats.rows[0];
    console.log(`\n📈 Order Insurance Stats:`);
    console.log(`   Total orders: ${total_orders}`);
    console.log(`   With insurance: ${with_insurance}`);
    console.log(`   Without insurance: ${without_insurance}`);
    
  } catch (error) {
    console.error('❌ Error adding column:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

async function testHasInsuranceUpdate() {
  console.log('\n🧪 Testing has_insurance update functionality...\n');
  
  try {
    // First add the column
    await addHasInsuranceColumn();
    
    console.log('\n✅ Database is ready for has_insurance field!');
    console.log('\n📝 Frontend should now send:');
    console.log('   - hasInsurance: true (when patient has insurance)');
    console.log('   - hasInsurance: false (when patient is uninsured/cash-pay)');
    console.log('\n🔧 Backend will:');
    console.log('   - Update orders.has_insurance field');
    console.log('   - Only process insurance data when hasInsurance is true');
    console.log('   - Delete insurance records when hasInsurance is false');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await phiDbPool.end();
  }
}

// Run the test
testHasInsuranceUpdate();