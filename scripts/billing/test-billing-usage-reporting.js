/**
 * Test script for the Radiology Order Usage Reporting functionality
 * 
 * This script tests the reportRadiologyOrderUsage function by:
 * 1. Optionally inserting sample test data (if --insert-test-data flag is provided)
 * 2. Calling the reportRadiologyOrderUsage function with a specified date range
 * 3. Displaying the results
 * 
 * Usage:
 *   node test-billing-usage-reporting.js [--insert-test-data] [--start-date YYYY-MM-DD] [--end-date YYYY-MM-DD]
 * 
 * After running, check the Stripe Test Dashboard to verify that invoice items were created:
 * https://dashboard.stripe.com/test/invoices
 */

const { program } = require('commander');
const BillingService = require('../../dist/services/billing').default;
const { queryPhiDb, queryMainDb } = require('../../dist/config/db');

// Parse command line arguments
program
  .option('--insert-test-data', 'Insert sample test data before running the report')
  .option('--start-date <date>', 'Start date for the reporting period (YYYY-MM-DD)', getDefaultStartDate())
  .option('--end-date <date>', 'End date for the reporting period (YYYY-MM-DD)', getDefaultEndDate());

program.parse(process.argv);
const options = program.opts();

// Set up date range
const startDate = new Date(options.startDate);
const endDate = new Date(options.endDate);

// Main function
async function main() {
  try {
    console.log('=== Testing Radiology Order Usage Reporting ===\n');
    
    // Insert test data if requested
    if (options.insertTestData) {
      await insertTestData();
    }
    
    console.log(`Reporting period: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}\n`);
    
    // Call the reportRadiologyOrderUsage function
    console.log('Calling reportRadiologyOrderUsage...');
    const reports = await BillingService.reportRadiologyOrderUsage(startDate, endDate);
    
    // Display results
    console.log('\nResults:');
    console.log(JSON.stringify(reports, null, 2));
    
    // Summary
    const successCount = reports.filter(r => r.reportedToStripe).length;
    const failureCount = reports.filter(r => !r.reportedToStripe).length;
    const totalAmount = reports.reduce((sum, r) => sum + r.totalAmount, 0);
    
    console.log('\nSummary:');
    console.log(`- Total organizations processed: ${reports.length}`);
    console.log(`- Successfully reported to Stripe: ${successCount}`);
    console.log(`- Failed to report to Stripe: ${failureCount}`);
    console.log(`- Total amount: $${(totalAmount / 100).toFixed(2)}`);
    
    console.log('\n=== Test Complete ===');
    console.log('\nIMPORTANT: Check the Stripe Test Dashboard to verify that invoice items were created:');
    console.log('https://dashboard.stripe.com/test/invoices');
  } catch (error) {
    console.error('Error running test:', error);
    process.exit(1);
  }
}

// Helper function to insert test data
async function insertTestData() {
  console.log('Inserting test data...');
  
  try {
    // 1. First, check if we have a test radiology organization with a Stripe billing ID
    const orgResult = await queryMainDb(`
      SELECT id, name, billing_id 
      FROM organizations 
      WHERE type = 'radiology_group' AND billing_id IS NOT NULL
      LIMIT 1
    `);
    
    if (orgResult.rows.length === 0) {
      console.log('No radiology organization with Stripe billing ID found.');
      console.log('Please create a test radiology organization with a valid Stripe customer ID first.');
      process.exit(1);
    }
    
    const radiologyOrg = orgResult.rows[0];
    console.log(`Using radiology organization: ${radiologyOrg.name} (ID: ${radiologyOrg.id})`);
    
    // 2. Check if we have a test referring organization
    const referringOrgResult = await queryMainDb(`
      SELECT id, name
      FROM organizations
      WHERE type = 'referring_practice'
      LIMIT 1
    `);
    
    if (referringOrgResult.rows.length === 0) {
      console.log('No referring organization found.');
      console.log('Please create a test referring organization first.');
      process.exit(1);
    }
    
    const referringOrg = referringOrgResult.rows[0];
    
    // 3. Check if we have a test patient
    const patientResult = await queryPhiDb(`
      SELECT id, first_name, last_name
      FROM patients
      LIMIT 1
    `);
    
    let patientId;
    
    if (patientResult.rows.length === 0) {
      // Create a test patient
      console.log('Creating a test patient...');
      
      const newPatientResult = await queryPhiDb(`
        INSERT INTO patients (
          pidn, organization_id, first_name, last_name, date_of_birth, gender
        ) VALUES (
          $1, $2, $3, $4, $5, $6
        ) RETURNING id
      `, [
        `TEST-${Date.now()}`,
        referringOrg.id,
        'Test',
        'Patient',
        '1980-01-01',
        'Male'
      ]);
      
      patientId = newPatientResult.rows[0].id;
      console.log(`Created test patient with ID: ${patientId}`);
    } else {
      patientId = patientResult.rows[0].id;
      console.log(`Using existing patient: ${patientResult.rows[0].first_name} ${patientResult.rows[0].last_name} (ID: ${patientId})`);
    }
    
    // 4. Create test orders
    console.log('Creating test orders...');
    
    // Create 3 standard orders and 2 advanced orders
    const orderTypes = [
      { modality: 'X-RAY', description: 'Standard X-Ray' },
      { modality: 'ULTRASOUND', description: 'Standard Ultrasound' },
      { modality: 'X-RAY', description: 'Standard X-Ray' },
      { modality: 'MRI', description: 'Advanced MRI' },
      { modality: 'CT', description: 'Advanced CT Scan' }
    ];
    
    for (const orderType of orderTypes) {
      // Create the order
      const orderResult = await queryPhiDb(`
        INSERT INTO orders (
          order_number,
          patient_id,
          referring_organization_id,
          radiology_organization_id,
          created_by_user_id,
          status,
          modality,
          clinical_indication
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8
        ) RETURNING id
      `, [
        `TEST-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        patientId,
        referringOrg.id,
        radiologyOrg.id,
        1, // Assuming user ID 1 exists
        'pending_radiology',
        orderType.modality,
        `Test clinical indication for ${orderType.description}`
      ]);
      
      const orderId = orderResult.rows[0].id;
      
      // Create order history entry to simulate sending to radiology
      await queryPhiDb(`
        INSERT INTO order_history (
          order_id,
          user_id,
          event_type,
          previous_status,
          new_status,
          details,
          created_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7
        )
      `, [
        orderId,
        1, // Assuming user ID 1 exists
        'sent_to_radiology',
        'pending_admin',
        'pending_radiology',
        'Test order sent to radiology',
        new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()))
      ]);
      
      console.log(`Created test order ID: ${orderId} (${orderType.description})`);
    }
    
    console.log('Test data insertion complete!');
  } catch (error) {
    console.error('Error inserting test data:', error);
    process.exit(1);
  }
}

// Helper functions for default dates
function getDefaultStartDate() {
  const date = new Date();
  date.setDate(1); // First day of current month
  return date.toISOString().split('T')[0];
}

function getDefaultEndDate() {
  const date = new Date();
  return date.toISOString().split('T')[0];
}

// Run the main function
main().catch(console.error);