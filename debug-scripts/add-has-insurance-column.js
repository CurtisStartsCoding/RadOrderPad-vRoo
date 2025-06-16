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
    console.log('🔧 Adding has_insurance column to orders table...\n');
    
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
    
    console.log('✅ Column has_insurance added successfully');
    
    // Add comment
    await client.query(`
      COMMENT ON COLUMN orders.has_insurance IS 
      'Indicates whether patient has insurance for this order. False = uninsured/cash-pay, True = has insurance'
    `);
    
    console.log('✅ Column comment added');
    
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
    
    console.log(`✅ Updated ${updateResult.rowCount} existing orders to has_insurance = true`);
    
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
    
    console.log('\n✅ Database is now ready for has_insurance field!');
    console.log('\n📝 How it works:');
    console.log('   - Frontend sends hasInsurance: true/false');
    console.log('   - Backend updates orders.has_insurance field');
    console.log('   - Insurance data only processed when hasInsurance = true');
    console.log('   - Existing insurance deleted when hasInsurance = false');
    
  } catch (error) {
    console.error('❌ Error adding column:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Run the migration
addHasInsuranceColumn()
  .then(() => {
    console.log('\n✅ Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });