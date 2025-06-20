const { Client } = require('pg');
require('dotenv').config();

async function checkOrdersCoding() {
  // Use the PHI database URL from environment
  const connectionString = process.env.PHI_DATABASE_URL;
  
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('=== Last 10 Orders Coding Data Check ===');
    console.log('This script checks if the recent orders have coding fields populated.');
    console.log('\nConnecting to PHI database...');
    await client.connect();
    console.log('Connected!\n');

    // Query for the last 10 orders with coding fields
    const query = `
      SELECT 
        id,
        order_number,
        status,
        created_at,
        final_cpt_code,
        final_cpt_code_description,
        final_icd10_codes,
        final_icd10_code_descriptions,
        modality,
        body_part,
        clinical_indication
      FROM orders 
      ORDER BY created_at DESC 
      LIMIT 10
    `;
    
    console.log('--- Executing query for last 10 orders ---');
    const result = await client.query(query);
    
    if (result.rows.length === 0) {
      console.log('❌ No orders found in the database');
      return;
    }
    
    console.log(`\n✅ Found ${result.rows.length} recent orders. Analyzing coding data...\n`);
    
    let ordersWithCoding = 0;
    let ordersWithoutCoding = 0;
    
    result.rows.forEach((order, index) => {
      console.log(`--- Order ${index + 1} ---`);
      console.log(`ID: ${order.id}`);
      console.log(`Order Number: ${order.order_number}`);
      console.log(`Status: ${order.status}`);
      console.log(`Created: ${order.created_at}`);
      console.log(`Modality: ${order.modality || 'NULL'}`);
      console.log(`Body Part: ${order.body_part || 'NULL'}`);
      console.log(`Clinical Indication: ${order.clinical_indication ? order.clinical_indication.substring(0, 100) + '...' : 'NULL'}`);
      
      // Check coding fields
      const hasCptCode = order.final_cpt_code && order.final_cpt_code.trim() !== '';
      const hasCptDescription = order.final_cpt_code_description && order.final_cpt_code_description.trim() !== '';
      const hasIcd10Codes = order.final_icd10_codes && order.final_icd10_codes !== '[]' && order.final_icd10_codes.trim() !== '';
      const hasIcd10Descriptions = order.final_icd10_code_descriptions && order.final_icd10_code_descriptions !== '[]' && order.final_icd10_code_descriptions.trim() !== '';
      
      console.log('\n📋 CODING DATA STATUS:');
      console.log(`  CPT Code: ${hasCptCode ? '✅ ' + order.final_cpt_code : '❌ NULL/Empty'}`);
      console.log(`  CPT Description: ${hasCptDescription ? '✅ ' + order.final_cpt_code_description.substring(0, 50) + '...' : '❌ NULL/Empty'}`);
      console.log(`  ICD-10 Codes: ${hasIcd10Codes ? '✅ ' + order.final_icd10_codes : '❌ NULL/Empty'}`);
      console.log(`  ICD-10 Descriptions: ${hasIcd10Descriptions ? '✅ ' + (order.final_icd10_code_descriptions.length > 100 ? order.final_icd10_code_descriptions.substring(0, 100) + '...' : order.final_icd10_code_descriptions) : '❌ NULL/Empty'}`);
      
      const hasAnyCoding = hasCptCode || hasCptDescription || hasIcd10Codes || hasIcd10Descriptions;
      
      if (hasAnyCoding) {
        ordersWithCoding++;
        console.log('🟢 HAS CODING DATA');
      } else {
        ordersWithoutCoding++;
        console.log('🔴 NO CODING DATA');
      }
      
      console.log(''); // Empty line for readability
    });
    
    // Summary
    console.log('=== SUMMARY ===');
    console.log(`Total Orders Checked: ${result.rows.length}`);
    console.log(`Orders WITH Coding Data: ${ordersWithCoding}`);
    console.log(`Orders WITHOUT Coding Data: ${ordersWithoutCoding}`);
    
    if (ordersWithCoding > 0) {
      console.log('✅ SUCCESS: Some orders have coding data populated');
    } else {
      console.log('⚠️  WARNING: No orders have coding data - may indicate orders created before fix or validation issues');
    }
    
    // Test the GET endpoint fix by showing the query that was fixed
    console.log('\n--- RECENT FIX VERIFICATION ---');
    console.log('The GET /api/orders/:orderId endpoint was updated to explicitly SELECT these fields:');
    console.log('  - final_cpt_code');
    console.log('  - final_cpt_code_description'); 
    console.log('  - final_icd10_codes');
    console.log('  - final_icd10_code_descriptions');
    console.log('\nBefore the fix, these fields existed in the database but were not returned by the API.');
    console.log('After the fix, these fields should be visible to all authorized users.');

  } catch (err) {
    console.error('Error:', err.message);
    if (err.detail) {
      console.error('Details:', err.detail);
    }
  } finally {
    await client.end();
    console.log('\nDatabase connection closed.');
  }
}

// Run the script
checkOrdersCoding();