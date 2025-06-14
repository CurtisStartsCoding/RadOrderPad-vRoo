/**
 * Debug script to test order data retrieval
 * This will help identify why insurance and supplemental data isn't persisting
 */
require('dotenv').config();
const { Pool } = require('pg');

// PHI Database connection
const phiPool = new Pool({
  host: process.env.PG_PHI_HOST || 'localhost',
  port: process.env.PG_PHI_PORT || '5433',
  database: process.env.PG_PHI_DATABASE || 'radorder_phi',
  user: process.env.PG_PHI_USER || 'postgres',
  password: process.env.PG_PHI_PASSWORD || 'password',
});

async function queryPhiDb(query, values) {
  return await phiPool.query(query, values);
}

async function testOrderDataRetrieval() {
  const orderId = 974; // Test order ID from user's testing
  
  try {
    console.log('=== TESTING ORDER DATA RETRIEVAL ===');
    console.log(`Order ID: ${orderId}`);
    
    // Test 1: Check if order exists
    console.log('\n1. Checking if order exists...');
    const orderCheck = await queryPhiDb('SELECT id, patient_id, status FROM orders WHERE id = $1', [orderId]);
    if (orderCheck.rows.length === 0) {
      console.log('❌ Order not found');
      return;
    }
    console.log('✅ Order found:', orderCheck.rows[0]);
    const patientId = orderCheck.rows[0].patient_id;
    
    // Test 2: Check patient data
    console.log('\n2. Checking patient data...');
    const patientData = await queryPhiDb('SELECT first_name, last_name, city, state, zip_code FROM patients WHERE id = $1', [patientId]);
    console.log('Patient data:', patientData.rows[0] || 'No patient data');
    
    // Test 3: Check insurance data
    console.log('\n3. Checking insurance data...');
    const insuranceData = await queryPhiDb(
      'SELECT insurer_name, plan_type, policy_number, group_number, is_primary FROM patient_insurance WHERE patient_id = $1',
      [patientId]
    );
    console.log('Insurance records found:', insuranceData.rows.length);
    insuranceData.rows.forEach((row, index) => {
      console.log(`  Insurance ${index + 1}:`, row);
    });
    
    // Test 4: Check supplemental data
    console.log('\n4. Checking supplemental EMR data...');
    const supplementalData = await queryPhiDb(
      `SELECT id, record_type, content, added_at 
       FROM patient_clinical_records 
       WHERE order_id = $1 AND record_type = 'supplemental_docs_paste'
       ORDER BY added_at DESC`,
      [orderId]
    );
    console.log('Supplemental records found:', supplementalData.rows.length);
    supplementalData.rows.forEach((row, index) => {
      console.log(`  Record ${index + 1}:`, {
        id: row.id,
        record_type: row.record_type,
        content_preview: row.content ? row.content.substring(0, 100) + '...' : 'NO CONTENT',
        added_at: row.added_at
      });
    });
    
    // Test 5: Run the actual enhanced query
    console.log('\n5. Testing the enhanced query...');
    const enhancedQuery = `
      SELECT 
        o.id, o.order_number, o.status,
        -- Patient info
        p.first_name as patient_first_name,
        p.last_name as patient_last_name,
        p.city as patient_city,
        p.state as patient_state,
        p.zip_code as patient_zip_code,
        
        -- Primary insurance info
        pi.insurer_name as insurance_name,
        pi.plan_type as insurance_plan_name,
        pi.policy_number as insurance_policy_number,
        pi.group_number as insurance_group_number,
        pi.policy_holder_name as insurance_policy_holder_name,
        
        -- Supplemental EMR info (latest record)
        pcr.content as supplemental_emr_content
        
      FROM orders o
      LEFT JOIN patients p ON o.patient_id = p.id
      LEFT JOIN patient_insurance pi ON p.id = pi.patient_id AND pi.is_primary = true
      LEFT JOIN (
        SELECT DISTINCT ON (order_id) order_id, content
        FROM patient_clinical_records 
        WHERE record_type = 'supplemental_docs_paste'
        ORDER BY order_id, added_at DESC
      ) pcr ON o.id = pcr.order_id
      WHERE o.id = $1
    `;
    
    const enhancedResult = await queryPhiDb(enhancedQuery, [orderId]);
    if (enhancedResult.rows.length > 0) {
      const row = enhancedResult.rows[0];
      console.log('Enhanced query result:');
      console.log('  Patient data:', {
        patient_first_name: row.patient_first_name,
        patient_last_name: row.patient_last_name,
        patient_city: row.patient_city,
        patient_state: row.patient_state,
        patient_zip_code: row.patient_zip_code
      });
      console.log('  Insurance data:', {
        insurance_name: row.insurance_name,
        insurance_plan_name: row.insurance_plan_name,
        insurance_policy_number: row.insurance_policy_number,
        insurance_group_number: row.insurance_group_number,
        insurance_policy_holder_name: row.insurance_policy_holder_name
      });
      console.log('  Supplemental data:', {
        has_content: !!row.supplemental_emr_content,
        content_preview: row.supplemental_emr_content ? row.supplemental_emr_content.substring(0, 100) + '...' : 'NO CONTENT'
      });
    } else {
      console.log('❌ Enhanced query returned no results');
    }
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    await phiPool.end();
  }
  
  process.exit(0);
}

testOrderDataRetrieval();